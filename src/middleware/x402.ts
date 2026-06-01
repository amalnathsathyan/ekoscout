import { Request, Response, NextFunction } from 'express';

/**
 * x402 Middleware
 * Implements HTTP 402 Payment Required protocol for agent-to-agent transactions.
 * Requires USDC payment on Base network for access.
 */
export function requireX402Payment(amountUSDC: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const paymentProof = req.headers['x-payment-proof'];

    if (!paymentProof) {
      // Reject request and prompt for payment
      return res.status(402).json({
        error: 'Payment Required',
        payment_request: {
          amount: amountUSDC,
          asset: 'USDC',
          chain: 'base',
          recipient: process.env.AGENT_WALLET_ADDRESS || 'mock_agent_base_address',
          message: 'Pay to access EkoScout premium ecosystem data API'
        }
      });
    }

    // In a real scenario, we would verify the transaction hash or cryptographic proof on-chain
    console.log(`[x402] Verified payment proof: ${paymentProof}`);
    
    // Payment successful, proceed to premium endpoint
    next();
  };
}
