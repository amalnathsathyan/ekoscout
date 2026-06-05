import axios from 'axios';

const CLAWPUMP_BASE = 'https://clawpump.tech/api';

const TOKEN_METADATA = {
  name: 'Ekoscout',
  symbol: 'EKO',
  description:
    'Blockchain opportunity research agent. Scans top ecosystems for grants, hackathons, accelerator programs, and ecosystem jobs — ranked by builder opportunity and competition density. Holding $EKO unlocks premium real-time alpha via the EkoScout dashboard.',
  agentId: 'ekoscout-v1',
};

export interface LaunchResult {
  mintAddress: string;
  txHash: string;
  pumpUrl: string;
}

export interface EarningsResult {
  totalEarned: number;
  totalPending: number;
  totalSent: number;
}

export async function launchToken(imageUrl?: string): Promise<LaunchResult> {
  const walletAddress = process.env.AGENT_WALLET_ADDRESS;
  if (!walletAddress) {
    throw new Error('AGENT_WALLET_ADDRESS not set. Cannot launch token without a fee recipient wallet.');
  }

  console.log('Launching $EKO token via ClawPump...');

  const payload = {
    ...TOKEN_METADATA,
    imageUrl: imageUrl || 'https://ekoscout.vercel.app/logo.png',
    walletAddress,
  };

  try {
    const response = await axios.post(`${CLAWPUMP_BASE}/launch`, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000,
    });

    const result: LaunchResult = {
      mintAddress: response.data.mintAddress,
      txHash: response.data.txHash,
      pumpUrl: response.data.pumpUrl || `https://pump.fun/coin/${response.data.mintAddress}`,
    };

    console.log('Token launched successfully:', result);
    return result;
  } catch (error: any) {
    const status = error.response?.status;
    const body = error.response?.data;

    console.error('ClawPump launch failed:', { status, body, message: error.message });

    if (status === 404) {
      throw new Error(
        'ClawPump /api/launch endpoint returned 404. The API may have moved or changed. ' +
        'Verify the endpoint at https://clawpump.tech/docs'
      );
    }

    throw new Error(
      `Token launch failed: ${body?.error || error.message}`
    );
  }
}

export async function getEarnings(): Promise<EarningsResult> {
  try {
    const response = await axios.get(`${CLAWPUMP_BASE}/earnings`, {
      params: { agentId: TOKEN_METADATA.agentId },
      timeout: 10000,
    });

    return {
      totalEarned: response.data.totalEarned || 0,
      totalPending: response.data.totalPending || 0,
      totalSent: response.data.totalSent || 0,
    };
  } catch (error: any) {
    console.error('Failed to fetch ClawPump earnings:', error.message);
    return { totalEarned: 0, totalPending: 0, totalSent: 0 };
  }
}

// Image upload requires the `form-data` npm package for Node.js multipart support.
// Install with: npm install form-data
// Then POST to CLAWPUMP_BASE/upload with multipart body field "image".
//
// For now, pass a pre-hosted imageUrl directly to launchToken().
export async function uploadTokenImage(imagePath: string): Promise<string> {
  const fs = await import('fs');
  const FormData = (await import('form-data')).default;

  try {
    const form = new FormData();
    form.append('image', fs.createReadStream(imagePath));

    const response = await axios.post(`${CLAWPUMP_BASE}/upload`, form, {
      headers: form.getHeaders(),
      timeout: 15000,
    });

    return response.data.imageUrl;
  } catch (error: any) {
    console.error('Image upload failed:', error.message);
    throw new Error(`Image upload failed: ${error.message}`);
  }
}
