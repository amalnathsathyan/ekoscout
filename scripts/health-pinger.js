const axios = require('axios');

// Backend URL from environment variables
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';
const PING_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

console.log(`Starting health pinger for: ${BACKEND_URL}`);

setInterval(async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/health`);
    console.log(`[${new Date().toISOString()}] Ping successful. Status: ${response.status}`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Ping failed:`, error.message);
  }
}, PING_INTERVAL_MS);

// Initial ping
axios.get(`${BACKEND_URL}/health`)
  .then(() => console.log('Initial ping successful.'))
  .catch(err => console.error('Initial ping failed:', err.message));
