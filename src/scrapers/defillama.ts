import axios from 'axios';

export async function scrapeDefiLlama() {
  console.log('Scraping DefiLlama...');
  try {
    const response = await axios.get('https://api.llama.fi/chains');
    const chains = response.data;
    console.log(`Fetched ${chains.length} chains from DefiLlama`);
    
    // Return essential data
    return chains.map((c: any) => ({
      name: c.name,
      tvl: c.tvl,
      tokenSymbol: c.tokenSymbol,
    }));
  } catch (error) {
    console.error('Error scraping DefiLlama:', error);
    return [];
  }
}
