import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { runAllScrapers } from './scrapers';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

import { requireX402Payment } from './middleware/x402';

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'EcosystemRadar Agent is running' });
});

// Premium Agent-to-Agent API Route
// Costs 0.50 USDC per query
app.get('/api/v1/opportunities', requireX402Payment(0.50), (req: Request, res: Response) => {
  const chain = req.query.chain || 'all';
  
  // Return premium scraped and enriched data
  res.status(200).json({
    status: 'success',
    chain: chain,
    data: {
      opportunities: [
        { id: 1, type: 'Grant', amount: '$50k', title: 'DeFi Builder Fund' },
        { id: 2, type: 'Hackathon', amount: '$100k', title: 'Global Spring Hack' }
      ]
    }
  });
});

// Endpoint triggered by GitHub Actions Cron
app.post('/run-scrapers', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    console.log('Starting scheduled scrapers...');
    await runAllScrapers();
    
    console.log('Scraping completed successfully.');
    res.status(200).json({ status: 'success', message: 'Scraping job completed' });
  } catch (error) {
    console.error('Error during scraping:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error during scraping' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
