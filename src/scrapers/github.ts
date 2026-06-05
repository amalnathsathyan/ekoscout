import axios from 'axios';

export async function scrapeGitHub() {
  console.log('Scraping GitHub...');
  const token = process.env.GITHUB_PAT;
  if (!token) {
    console.warn('Missing GITHUB_PAT');
    return [];
  }

  try {
    const response = await axios.get(`https://api.github.com/search/repositories?q=topic:web3&sort=stars&order=desc`, {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      }
    });
    const items = response.data.items || [];
    console.log(`Fetched ${items.length} trending web3 repos from GitHub`);
    
    return items.slice(0, 10).map((repo: any) => ({
      name: repo.full_name,
      stars: repo.stargazers_count,
      description: repo.description,
      language: repo.language,
    }));
  } catch (error: any) {
    console.error('Error scraping GitHub:', error?.message);
    return [];
  }
}
