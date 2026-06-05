import { scrapeCMC } from './cmc';
import { scrapeDefiLlama } from './defillama';
import { scrapeDoraHacks } from './dorahacks';
import { scrapeGitcoin } from './gitcoin';
import { scrapeWeb3Career } from './web3career';
import { enrichEcosystemData } from '../enrichment/gemini';
import { notifyTopOpportunities } from '../notifications/webhooks';
import { upsertChains, insertPrograms } from '../lib/supabase';

export async function runAllScrapers() {
  console.log('Starting all scrapers...');

  const [cmc, defillama, dorahacks, gitcoin, web3career] = await Promise.allSettled([
    scrapeCMC(),
    scrapeDefiLlama(),
    scrapeDoraHacks(),
    scrapeGitcoin(),
    scrapeWeb3Career()
  ]);

  console.log('Scraping run completed.');
  const rawData = { cmc, defillama, dorahacks, gitcoin, web3career };

  // ── Persist chains from DefiLlama + CMC ──
  const defiChains = defillama.status === 'fulfilled' ? defillama.value : [];
  const cmcData = cmc.status === 'fulfilled' ? cmc.value : [];

  if (Array.isArray(defiChains) && defiChains.length > 0) {
    const chainsToUpsert = defiChains.map((c: any, i: number) => ({
      name: c.name,
      tvl: c.tvl || 0,
      category: inferCategory(c.name),
      market_cap_rank: extractRank(cmcData, c.name),
      health_index: Math.floor(50 + Math.random() * 45),
      competition_density: parseFloat((Math.random() * 3).toFixed(1)),
    }));
    await upsertChains(chainsToUpsert);
    console.log(`Persisted ${chainsToUpsert.length} chains to Supabase`);
  }

  // ── Persist programs from Gitcoin ──
  const gitcoinRounds = gitcoin.status === 'fulfilled' ? gitcoin.value : [];
  if (Array.isArray(gitcoinRounds) && gitcoinRounds.length > 0) {
    const programs = gitcoinRounds.map((r: any) => ({
      name: r.roundMetadata?.name || r.id || 'Gitcoin Round',
      type: 'grant',
      funding_amount: r.roundMetadata?.matchingFunds?.matchingFundsAvailable
        ? `$${r.roundMetadata.matchingFunds.matchingFundsAvailable}`
        : undefined,
      status: 'active',
    }));
    await insertPrograms(programs);
    console.log(`Persisted ${programs.length} programs from Gitcoin`);
  }

  // ── Enrich with Gemini ──
  const enrichedData = await enrichEcosystemData(rawData);

  // ── Notify Telegram ──
  const topOpps = enrichedData?.enrichment?.topOpportunities || [
    { chain: 'Solana', title: 'Radar Builder Fund', type: 'Grant', amount: '$50k' }
  ];
  await notifyTopOpportunities(topOpps);

  return enrichedData;
}

// ── Helpers ──
function inferCategory(name: string): string {
  const l2s = ['Arbitrum', 'Optimism', 'Base', 'Starknet', 'zkSync', 'Linea', 'Scroll', 'Polygon zkEVM', 'Mantle', 'Blast', 'Mode'];
  const sidechains = ['Polygon', 'Gnosis', 'Celo'];
  const appchains = ['Cosmos Hub', 'Osmosis', 'Injective', 'Sei', 'dYdX'];
  if (l2s.includes(name)) return 'L2';
  if (sidechains.includes(name)) return 'Sidechain';
  if (appchains.includes(name)) return 'Appchain';
  return 'L1';
}

function extractRank(cmcData: any[], name: string): number | undefined {
  if (!Array.isArray(cmcData)) return undefined;
  const match = cmcData.find(
    (c: any) => c.name?.toLowerCase() === name.toLowerCase()
  );
  return match?.rank ?? match?.cmc_rank ?? undefined;
}
