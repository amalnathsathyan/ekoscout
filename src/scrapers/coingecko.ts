import axios from 'axios';

export async function scrapeCoinGecko() {
  console.log('Scraping CoinGecko...');
  const apiKey = process.env.COINGECKO_API_KEY;
  if (!apiKey) {
    console.warn('Missing COINGECKO_API_KEY');
    return [];
  }

  try {
    const response = await axios.get(`https://api.coingecko.com/api/v3/coins/categories/list?x_cg_demo_api_key=${apiKey}`);
    const categories = response.data || [];
    console.log(`Fetched ${categories.length} categories from CoinGecko`);
    
    return categories.slice(0, 10).map((c: any) => ({
      categoryId: c.category_id,
      name: c.name,
    }));
  } catch (error: any) {
    console.error('Error scraping CoinGecko:', error?.message);
    return [];
  }
}
