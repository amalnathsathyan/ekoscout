import axios from 'axios';

export async function scrapeCryptoRank() {
  console.log('Scraping CryptoRank...');
  const apiKey = process.env.CRYPTORANK_API_KEY;
  if (!apiKey) {
    console.warn('Missing CRYPTORANK_API_KEY');
    return [];
  }

  try {
    const response = await axios.get(`https://api.cryptorank.io/v1/currencies?api_key=${apiKey}&limit=50`);
    const data = response.data.data || [];
    console.log(`Fetched ${data.length} items from CryptoRank`);
    
    return data.map((c: any) => ({
      name: c.name,
      symbol: c.symbol,
      rank: c.rank,
    }));
  } catch (error: any) {
    console.error('Error scraping CryptoRank:', error?.message);
    return [];
  }
}
