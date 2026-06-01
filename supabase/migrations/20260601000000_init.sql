-- Create Chains table
CREATE TABLE chains (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT,
  market_cap_rank INTEGER,
  health_index NUMERIC,
  competition_density NUMERIC,
  tvl NUMERIC,
  dev_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Programs table (Grants, Hackathons, Accelerators)
CREATE TABLE programs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chain_id UUID REFERENCES chains(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'grant', 'accelerator', 'hackathon'
  funding_amount TEXT,
  prize_pool TEXT,
  status TEXT DEFAULT 'active',
  deadline TIMESTAMP WITH TIME ZONE,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Jobs table
CREATE TABLE jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chain_id UUID REFERENCES chains(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  company TEXT,
  role_type TEXT,
  salary_range TEXT,
  is_remote BOOLEAN DEFAULT TRUE,
  link TEXT,
  posted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Realtime replication
alter publication supabase_realtime add table chains;
alter publication supabase_realtime add table programs;
alter publication supabase_realtime add table jobs;
