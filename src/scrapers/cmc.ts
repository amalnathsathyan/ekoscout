import axios from 'axios';

export async function scrapeCMC() {
  console.log('Scraping CoinMarketCap...');
  const apiKey = process.env.CMC_API_KEY;
  if (!apiKey) {
    console.warn('CMC_API_KEY is not set. Skipping CMC scrape.');
    return [];
  }
  
  try {
    const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/map', {
      headers: { 'X-CMC_PRO_API_KEY': apiKey }
    });
    console.log(`Fetched data from CoinMarketCap`);
    return response.data.data;
  } catch (error) {
    console.error('Error scraping CoinMarketCap:', error);
    return [];
  }
}
