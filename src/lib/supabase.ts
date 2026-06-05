import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function upsertChains(chains: Array<{
  name: string;
  category?: string;
  market_cap_rank?: number;
  tvl?: number;
  health_index?: number;
  competition_density?: number;
  dev_count?: number;
}>) {
  if (!chains.length) return;

  const { error } = await supabase
    .from('chains')
    .upsert(
      chains.map((c) => ({
        name: c.name,
        category: c.category || null,
        market_cap_rank: c.market_cap_rank || null,
        tvl: c.tvl || null,
        health_index: c.health_index || null,
        competition_density: c.competition_density || null,
        dev_count: c.dev_count || null,
        updated_at: new Date().toISOString(),
      })),
      { onConflict: 'name' }
    );

  if (error) {
    console.error('Failed to upsert chains:', error.message);
  } else {
    console.log(`Upserted ${chains.length} chains to Supabase`);
  }
}

export async function insertPrograms(programs: Array<{
  chain_name?: string;
  name: string;
  type: string;
  funding_amount?: string;
  prize_pool?: string;
  status?: string;
  link?: string;
}>) {
  if (!programs.length) return;

  const { error } = await supabase
    .from('programs')
    .insert(
      programs.map((p) => ({
        name: p.name,
        type: p.type,
        funding_amount: p.funding_amount || null,
        prize_pool: p.prize_pool || null,
        status: p.status || 'active',
        link: p.link || null,
      }))
    );

  if (error) {
    console.error('Failed to insert programs:', error.message);
  } else {
    console.log(`Inserted ${programs.length} programs to Supabase`);
  }
}
