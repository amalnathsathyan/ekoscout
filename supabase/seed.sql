-- Seed demo data for EkoScout dashboard
-- Run this in Supabase SQL Editor to populate initial data

INSERT INTO chains (name, category, market_cap_rank, health_index, competition_density, tvl, dev_count) VALUES
  ('Solana', 'L1', 4, 92, 2.4, 4200000000, 2800),
  ('Base', 'L2', 12, 88, 1.1, 1100000000, 1900),
  ('Arbitrum', 'L2', 8, 85, 1.8, 2800000000, 1200),
  ('Optimism', 'L2', 15, 82, 1.3, 890000000, 950),
  ('Polygon', 'Sidechain', 18, 74, 2.1, 950000000, 2100),
  ('Avalanche', 'L1', 11, 78, 1.6, 620000000, 850),
  ('Sui', 'L1', 22, 91, 0.7, 480000000, 1100),
  ('Aptos', 'L1', 25, 85, 0.8, 390000000, 720),
  ('Near', 'L1', 28, 80, 0.9, 310000000, 580),
  ('Starknet', 'L2', 32, 76, 0.5, 250000000, 420),
  ('zkSync', 'L2', 35, 72, 0.6, 180000000, 350),
  ('Injective', 'L1', 42, 83, 0.4, 95000000, 280)
ON CONFLICT (name) DO UPDATE SET
  category = EXCLUDED.category,
  market_cap_rank = EXCLUDED.market_cap_rank,
  health_index = EXCLUDED.health_index,
  competition_density = EXCLUDED.competition_density,
  tvl = EXCLUDED.tvl,
  dev_count = EXCLUDED.dev_count;
