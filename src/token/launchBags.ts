import axios from 'axios';

const BAGS_API = 'https://bagsworld.app/api/agent-economy/external';

const TOKEN_METADATA = {
  name: 'Ekoscout',
  symbol: 'EKO',
  description:
    'Perpetual blockchain opportunity research agent. Scans 200+ chains for grants, hackathons, accelerator programs, and ecosystem jobs. Holding $EKO unlocks premium real-time alpha via the EkoScout dashboard.',
};

interface LaunchResult {
  mint: string;
  name: string;
  symbol: string;
  bagsUrl: string;
}

interface EarningsResult {
  total: number;
  pending: number;
}

/**
 * Launch $EKO on Bags.fm — gas-free via Pokécenter API.
 * BagsWorld pays the ~0.03 SOL deployment cost.
 * Creator earns 1% of all trading volume forever.
 *
 * Two auth options:
 *   1. moltbookUsername — if agent has Moltbook identity set up
 *   2. wallet — direct Solana wallet address for fee collection
 *
 * @param moltbookUsername - Optional Moltbook username (from onboarding)
 */
export async function launchToken(moltbookUsername?: string): Promise<LaunchResult> {
  const walletAddress = process.env.AGENT_WALLET_ADDRESS;
  if (!walletAddress && !moltbookUsername) {
    throw new Error(
      'AGENT_WALLET_ADDRESS not set and no moltbookUsername provided. ' +
      'Cannot launch token without a fee recipient.'
    );
  }

  console.log('Launching $EKO token via Bags.fm Pokécenter (gas-free)...');

  const payload: any = {
    action: 'launch',
    ...TOKEN_METADATA,
    telegram: 'https://t.me/ecoskout',
    website: 'https://ekoscout-dashboard.onrender.com',
  };

  // Prefer Moltbook identity if onboarded, fall back to wallet
  if (moltbookUsername) {
    payload.moltbookUsername = moltbookUsername;
  } else {
    payload.wallet = walletAddress;
  }

  try {
    const response = await axios.post(BAGS_API, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000,
    });

    const result: LaunchResult = {
      mint: response.data.token.mint,
      name: response.data.token.name,
      symbol: response.data.token.symbol,
      bagsUrl: response.data.token.bagsUrl,
    };

    console.log('Token launched successfully via Bags.fm:', result);
    return result;
  } catch (error: any) {
    const status = error.response?.status;
    const body = error.response?.data;
    console.error('Bags.fm launch failed:', { status, body, message: error.message });

    if (status === 429) {
      throw new Error('Rate limited by Bags.fm. Max 10 launches/day per wallet.');
    }
    throw new Error(`Token launch failed: ${body?.error || error.message}`);
  }
}

/**
 * Check claimable earnings for the agent wallet.
 */
export async function getEarnings(): Promise<EarningsResult> {
  const walletAddress = process.env.AGENT_WALLET_ADDRESS;
  if (!walletAddress) {
    return { total: 0, pending: 0 };
  }

  try {
    const response = await axios.post(BAGS_API, {
      action: 'claimable',
      wallet: walletAddress,
    }, { timeout: 10000 });

    return {
      total: response.data.total || 0,
      pending: response.data.pending || 0,
    };
  } catch (error: any) {
    console.error('Failed to fetch Bags.fm earnings:', error.message);
    return { total: 0, pending: 0 };
  }
}

/**
 * Check launcher status — is the Pokécenter online and funded?
 */
export async function checkLauncherStatus(): Promise<{ online: boolean; funded: boolean }> {
  try {
    const response = await axios.post(BAGS_API, {
      action: 'launcher-status',
    }, { timeout: 10000 });

    return {
      online: response.data.online ?? false,
      funded: response.data.funded ?? false,
    };
  } catch (error: any) {
    console.error('Failed to check Bags.fm launcher status:', error.message);
    return { online: false, funded: false };
  }
}
