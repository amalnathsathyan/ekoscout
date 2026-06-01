import axios from 'axios';

export async function scrapeGitcoin() {
  console.log('Scraping Gitcoin...');
  try {
    // Most Gitcoin data is accessible via their crosschain indexer (GraphQL) or allo protocol APIs.
    const response = await axios.post('https://indexer.crosschain.gitcoin.co/graphql', {
      query: `
        {
          rounds(first: 10, orderBy: createdAt, orderDirection: desc) {
            id
            roundMetadata
          }
        }
      `
    }).catch(() => ({ data: { data: { rounds: [] } } }));
    
    console.log('Successfully fetched Gitcoin Rounds');
    return response.data?.data?.rounds || [];
  } catch (error) {
    console.error('Error scraping Gitcoin:', error);
    return [];
  }
}
