import axios from 'axios';

export async function sendDiscordNotification(message: string) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn('DISCORD_WEBHOOK_URL is not set. Skipping Discord notification.');
    return;
  }

  try {
    await axios.post(webhookUrl, { content: message });
    console.log('Successfully sent Discord notification.');
  } catch (error) {
    console.error('Failed to send Discord notification:', error);
  }
}

export async function sendTelegramNotification(message: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn('TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not set. Skipping Telegram notification.');
    return;
  }

  try {
    const url = \`https://api.telegram.org/bot\${botToken}/sendMessage\`;
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

  const message = \`🚨 **New Builder Opportunities Detected!** 🚨\\n\\n\` +
    opportunities.slice(0, 3).map(opp => 
      \`- **\${opp.chain || 'Chain'}**: \${opp.title} (\${opp.type}) - \${opp.amount}\\n\`
    ).join('') +
    \`\\nCheck the dashboard for more details: https://ekoscout.vercel.app\`;

  await Promise.allSettled([
    sendDiscordNotification(message),
    sendTelegramNotification(message)
  ]);
}
