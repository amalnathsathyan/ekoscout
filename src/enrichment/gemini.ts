import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini Flash
const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function enrichEcosystemData(rawData: any) {
  console.log('Starting Gemini Flash enrichment pipeline...');
  
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not set. Skipping enrichment.');
    return rawData; // Pass through raw data if API is not configured
  }

  try {
    const prompt = `
      You are an expert blockchain ecosystem analyst. Analyze the following raw ecosystem data gathered from various scrapers.
      Your goal is to evaluate the Builder Health Index and Competition Density.
      
      Extract insights, classify the hackathons/grants, and provide a JSON response summarizing the "low-hanging fruit" ecosystems 
      where builder competition is low but funding/jobs are high.
      
      Raw Data:
      ${JSON.stringify(rawData).substring(0, 10000)} // Truncated to prevent context overflow
      
      Respond STRICTLY in JSON format with keys like "topOpportunities", "builderHealthInsights", and "competitionScores".
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    console.log('Gemini Flash enrichment successful');
    
    // Attempt to parse the JSON returned by Gemini
    let enrichmentJSON = null;
    try {
      const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
      enrichmentJSON = JSON.parse(jsonStr);
    } catch (parseError) {
      console.warn('Failed to parse Gemini response as JSON. Storing as raw text.');
      enrichmentJSON = { rawText: text };
    }
    
    return {
      originalData: rawData,
      enrichment: enrichmentJSON
    };
  } catch (error) {
    console.error('Error during Gemini Flash enrichment:', error);
    return rawData;
  }
}
