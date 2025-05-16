import { Telegraf } from 'telegraf';
import { generateText } from 'ai';
import { openrouter } from '@openrouter/ai-sdk-provider';

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.on('message', async (ctx) => {
  const prompt = ctx.message.text;
  try {
    const response = await generateText({
      model: openrouter('meta-llama/llama-4-maverick:free'),
      apiKey: process.env.OPENROUTER_API_KEY,
      prompt: prompt,
    });
    await ctx.reply(response);
  } catch (error) {
    console.error('Error generating text:', error);
    await ctx.reply('Sorry, I couldn\'t process that request.');
  }
});

export default async (req, res) => {
  if (req.method === 'POST') {
    bot.handleUpdate(req.body);
    res.status(200).send('OK');
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
