import { scrapeCMC } from './cmc';
import { scrapeDefiLlama } from './defillama';
import { scrapeDoraHacks } from './dorahacks';
import { scrapeGitcoin } from './gitcoin';
import { scrapeWeb3Career } from './web3career';
import { enrichEcosystemData } from '../enrichment/gemini';

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
  
  // Pass the raw data through the Gemini enrichment pipeline
  const enrichedData = await enrichEcosystemData(rawData);
  
  return enrichedData;
}
