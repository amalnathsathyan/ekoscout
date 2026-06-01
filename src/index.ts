import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { runAllScrapers } from './scrapers';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'EcosystemRadar Agent is running' });
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
