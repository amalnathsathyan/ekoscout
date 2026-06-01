import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeWeb3Career() {
  console.log('Scraping Web3.Career...');
  try {
    const response = await axios.get('https://web3.career/');
    const $ = cheerio.load(response.data);
    const jobs: any[] = [];
    
    // Example: extracting basic job table rows
    $('tr').each((index, element) => {
      const title = $(element).find('h2').text().trim();
      const company = $(element).find('h3').text().trim();
      
      if (title && company) {
        jobs.push({ title, company });
      }
    });

    console.log(`Successfully scraped ${jobs.length} jobs from Web3.Career`);
    return jobs;
  } catch (error) {
    console.error('Error scraping Web3.Career:', error);
    return [];
  }
}
