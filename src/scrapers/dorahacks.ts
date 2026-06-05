import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeDoraHacks() {
  console.log('Scraping DoraHacks...');
  try {
    const response = await axios.get('https://dorahacks.io/hackathon', {
      headers: { 'User-Agent': 'EkoScout/1.0' },
      timeout: 15000,
    });
    const $ = cheerio.load(response.data);
    const hackathons: any[] = [];

    // DoraHacks renders client-side (React/Next.js). Cheerio sees an empty shell.
    // To scrape this properly, we need either:
    //   1. Puppeteer/Playwright for full browser rendering
    //   2. Reverse-engineer their internal API (check Network tab for XHR calls)
    // For now, this scraper is a placeholder.
    const staticText = $('body').text().trim();
    if (staticText.length < 100) {
      console.log('DoraHacks page is client-rendered — no static content to parse. Skipping.');
    } else {
      console.log('DoraHacks returned static content — attempting basic parse.');
      // Future: add selectors if DoraHacks enables SSR
    }

    return hackathons;
  } catch (error) {
    console.error('Error scraping DoraHacks:', error);
    return [];
  }
}
