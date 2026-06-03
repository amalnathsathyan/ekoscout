import axios from 'axios';


export async function sendTelegramNotification(message: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn('TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not set. Skipping Telegram notification.');
    return;
  }

  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    await axios.post(url, {
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown'
    });
    console.log('Successfully sent Telegram notification.');
  } catch (error) {
    console.error('Failed to send Telegram notification:', error);
  }
}

export async function notifyTopOpportunities(opportunities: any[]) {
  if (!opportunities || opportunities.length === 0) return;

  const message = `🚨 **New Builder Opportunities Detected!** 🚨\n\n` +
    opportunities.slice(0, 3).map(opp => 
      `- **${opp.chain || 'Chain'}**: ${opp.title} (${opp.type}) - ${opp.amount}\n`
    ).join('') +
    `\nCheck the dashboard for more details: https://ekoscout.vercel.app`;

  await sendTelegramNotification(message);
}
