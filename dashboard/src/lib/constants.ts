import type { Chain, Program, Job, TierConfig } from './types'

// ── Token Tier Configuration ──

export const TIER_CONFIG: Record<string, TierConfig> = {
  free: {
    name: 'free',
    displayName: 'Free Tier',
    minBalance: 0,
    color: '#64748b',
    glowColor: 'rgba(100, 116, 139, 0.3)',
    icon: '🔓',
  },
  radar: {
    name: 'radar',
    displayName: 'Radar',
    minBalance: 1_000,
    color: '#a78bfa',
    glowColor: 'rgba(167, 139, 250, 0.3)',
    icon: '📡',
  },
  alpha: {
    name: 'alpha',
    displayName: 'Alpha',
    minBalance: 10_000,
    color: '#34d399',
    glowColor: 'rgba(52, 211, 153, 0.3)',
    icon: '⚡',
  },
  enterprise: {
    name: 'enterprise',
    displayName: 'Enterprise',
    minBalance: 100_000,
    color: '#fbbf24',
    glowColor: 'rgba(251, 191, 36, 0.3)',
    icon: '👑',
  },
}

// ── $EKO Token Mint Address (placeholder until launch) ──
export const EKO_TOKEN_MINT = 'EKoTokenMintAddressPlaceholderXXXXXXXXXXXXXX'

// ── Demo Chains ──

export const DEMO_CHAINS: Chain[] = [
  { id: 'c1', name: 'Solana', category: 'L1', market_cap_rank: 4, health_index: 92, competition_density: 2.4, tvl: 4.2e9, dev_count: 2800 },
  { id: 'c2', name: 'Base', category: 'L2', market_cap_rank: 12, health_index: 88, competition_density: 1.1, tvl: 1.1e9, dev_count: 1900 },
  { id: 'c3', name: 'Arbitrum', category: 'L2', market_cap_rank: 8, health_index: 85, competition_density: 1.8, tvl: 2.8e9, dev_count: 1200 },
  { id: 'c4', name: 'Optimism', category: 'L2', market_cap_rank: 15, health_index: 82, competition_density: 1.3, tvl: 890e6, dev_count: 950 },
  { id: 'c5', name: 'Polygon', category: 'Sidechain', market_cap_rank: 18, health_index: 74, competition_density: 2.1, tvl: 950e6, dev_count: 2100 },
  { id: 'c6', name: 'Avalanche', category: 'L1', market_cap_rank: 11, health_index: 78, competition_density: 1.6, tvl: 620e6, dev_count: 850 },
  { id: 'c7', name: 'Sui', category: 'L1', market_cap_rank: 22, health_index: 91, competition_density: 0.7, tvl: 480e6, dev_count: 1100 },
  { id: 'c8', name: 'Aptos', category: 'L1', market_cap_rank: 25, health_index: 85, competition_density: 0.8, tvl: 390e6, dev_count: 720 },
  { id: 'c9', name: 'Near', category: 'L1', market_cap_rank: 28, health_index: 80, competition_density: 0.9, tvl: 310e6, dev_count: 580 },
  { id: 'c10', name: 'Starknet', category: 'L2', market_cap_rank: 32, health_index: 76, competition_density: 0.5, tvl: 250e6, dev_count: 420 },
  { id: 'c11', name: 'zkSync', category: 'L2', market_cap_rank: 35, health_index: 72, competition_density: 0.6, tvl: 180e6, dev_count: 350 },
  { id: 'c12', name: 'Injective', category: 'L1', market_cap_rank: 42, health_index: 83, competition_density: 0.4, tvl: 95e6, dev_count: 280 },
]

// ── Demo Programs ──

export const DEMO_PROGRAMS: Program[] = [
  { id: 'p1', chain_id: 'c1', chain_name: 'Solana', name: 'Solana Radar Hackathon', type: 'hackathon', funding_amount: null, prize_pool: '$500K', status: 'active', deadline: '2026-07-15', link: 'https://solana.com/radar', chain_competition_density: 2.4 },
  { id: 'p2', chain_id: 'c2', chain_name: 'Base', name: 'Base Builder Grants Round 5', type: 'grant', funding_amount: 'Up to $250K', prize_pool: null, status: 'active', deadline: '2026-08-01', link: 'https://base.org/grants', chain_competition_density: 1.1 },
  { id: 'p3', chain_id: 'c3', chain_name: 'Arbitrum', name: 'Arbitrum Foundation Grant', type: 'grant', funding_amount: 'Up to $1M', prize_pool: null, status: 'active', deadline: '2026-09-30', link: 'https://arbitrum.foundation/grants', chain_competition_density: 1.8 },
  { id: 'p4', chain_id: 'c7', chain_name: 'Sui', name: 'Sui Overflow Hackathon', type: 'hackathon', funding_amount: null, prize_pool: '$300K', status: 'active', deadline: '2026-07-30', link: 'https://sui.io/hackathon', chain_competition_density: 0.7 },
  { id: 'p5', chain_id: 'c8', chain_name: 'Aptos', name: 'Aptos Accelerator Cohort 3', type: 'accelerator', funding_amount: '$100K + mentorship', prize_pool: null, status: 'active', deadline: '2026-08-15', link: 'https://aptosfoundation.org/accelerator', chain_competition_density: 0.8 },
  { id: 'p6', chain_id: 'c4', chain_name: 'Optimism', name: 'Retro Funding Round 6', type: 'grant', funding_amount: '10M OP tokens', prize_pool: null, status: 'active', deadline: '2026-07-01', link: 'https://optimism.io/retrofunding', chain_competition_density: 1.3 },
  { id: 'p7', chain_id: 'c10', chain_name: 'Starknet', name: 'Starknet Seed Grants', type: 'grant', funding_amount: 'Up to $50K', prize_pool: null, status: 'active', deadline: '2026-08-20', link: 'https://starknet.io/grants', chain_competition_density: 0.5 },
  { id: 'p8', chain_id: 'c9', chain_name: 'Near', name: 'Near Horizon Accelerator', type: 'accelerator', funding_amount: '$200K equity-free', prize_pool: null, status: 'active', deadline: '2026-09-01', link: 'https://near.org/horizon', chain_competition_density: 0.9 },
  { id: 'p9', chain_id: 'c12', chain_name: 'Injective', name: 'Injective Builders Hackathon', type: 'hackathon', funding_amount: null, prize_pool: '$150K', status: 'active', deadline: '2026-07-20', link: 'https://injective.com/hackathon', chain_competition_density: 0.4 },
]

// ── Demo Jobs ──

export const DEMO_JOBS: Job[] = [
  { id: 'j1', chain_id: 'c1', chain_name: 'Solana', title: 'Senior Rust Engineer', company: 'Solana Labs', role_type: 'Engineering', salary_range: '$180K-$250K', is_remote: true, link: 'https://solana.com/jobs/1', posted_at: '2026-06-01' },
  { id: 'j2', chain_id: 'c2', chain_name: 'Base', title: 'Protocol Engineer', company: 'Coinbase', role_type: 'Engineering', salary_range: '$200K-$300K', is_remote: false, link: 'https://base.org/jobs/1', posted_at: '2026-06-02' },
  { id: 'j3', chain_id: 'c3', chain_name: 'Arbitrum', title: 'DeFi Product Manager', company: 'Offchain Labs', role_type: 'Product', salary_range: '$150K-$200K', is_remote: true, link: 'https://offchainlabs.com/jobs/1', posted_at: '2026-06-03' },
  { id: 'j4', chain_id: 'c7', chain_name: 'Sui', title: 'Move Smart Contract Dev', company: 'Mysten Labs', role_type: 'Engineering', salary_range: '$160K-$220K', is_remote: true, link: 'https://mystenlabs.com/jobs/1', posted_at: '2026-06-01' },
  { id: 'j5', chain_id: 'c1', chain_name: 'Solana', title: 'DevRel Lead', company: 'Phantom', role_type: 'Marketing', salary_range: '$120K-$160K', is_remote: true, link: 'https://phantom.app/jobs/1', posted_at: '2026-06-02' },
  { id: 'j6', chain_id: 'c4', chain_name: 'Optimism', title: 'Governance Analyst', company: 'Optimism Foundation', role_type: 'Operations', salary_range: '$110K-$150K', is_remote: true, link: 'https://optimism.io/jobs/1', posted_at: '2026-06-01' },
  { id: 'j7', chain_id: 'c8', chain_name: 'Aptos', title: 'Frontend Engineer', company: 'Aptos Labs', role_type: 'Engineering', salary_range: '$140K-$190K', is_remote: true, link: 'https://aptoslabs.com/jobs/1', posted_at: '2026-06-03' },
  { id: 'j8', chain_id: 'c5', chain_name: 'Polygon', title: 'Security Researcher', company: 'Polygon Labs', role_type: 'Engineering', salary_range: '$170K-$230K', is_remote: false, link: 'https://polygon.technology/jobs/1', posted_at: '2026-06-02' },
  { id: 'j9', chain_id: 'c6', chain_name: 'Avalanche', title: 'Growth Marketing Lead', company: 'Ava Labs', role_type: 'Marketing', salary_range: '$130K-$170K', is_remote: true, link: 'https://avalabs.org/jobs/1', posted_at: '2026-06-01' },
  { id: 'j10', chain_id: 'c12', chain_name: 'Injective', title: 'Blockchain Designer', company: 'Injective Labs', role_type: 'Design', salary_range: '$100K-$140K', is_remote: true, link: 'https://injective.com/jobs/1', posted_at: '2026-06-03' },
]

// ── Chain Logo Colors ──

export const CHAIN_COLORS: Record<string, { bg: string; text: string }> = {
  Solana: { bg: '#7c3aed33', text: '#a78bfa' },
  Base: { bg: '#2563eb33', text: '#60a5fa' },
  Arbitrum: { bg: '#2563eb33', text: '#93c5fd' },
  Optimism: { bg: '#dc262633', text: '#f87171' },
  Polygon: { bg: '#7c3aed33', text: '#c084fc' },
  Avalanche: { bg: '#dc262633', text: '#fb7185' },
  Sui: { bg: '#0891b233', text: '#22d3ee' },
  Aptos: { bg: '#0d948833', text: '#2dd4bf' },
  Near: { bg: '#059669 33', text: '#34d399' },
  Starknet: { bg: '#4f46e533', text: '#818cf8' },
  zkSync: { bg: '#4338ca33', text: '#a5b4fc' },
  Injective: { bg: '#0ea5e933', text: '#38bdf8' },
}

export const DEFAULT_CHAIN_COLOR = { bg: '#64748b33', text: '#94a3b8' }
