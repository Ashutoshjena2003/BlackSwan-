const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function runSentimentAgent(marketData) {
  const { ticker, companyName, sector, quote, assetType } = marketData;

  const prompt = `You are a Sentiment Analysis Agent for an investment platform.

Analyze the market sentiment for ${companyName} (${ticker}).
Asset type: ${assetType}
Current price: ${quote.price} (${quote.change})
Price direction today: ${quote.changeDir}

Based on your knowledge, assess:
1. Current market and media sentiment around ${companyName}
2. Analyst or community mood (upgrades, social buzz, fear/greed)
3. Upcoming catalysts (earnings, halving, Fed decisions, regulations, product launches)
4. How unexpected or shocking recent price/news events have been (for black swan detection — rate 0-10)

Respond ONLY with a valid JSON object (no markdown, no extra text):
{
  "score": <number 0-10, where 10 is extremely positive sentiment>,
  "headline": "<one-line sentiment summary, max 10 words>",
  "detail": "<2-line quick summary of sentiment>",
  "analysis": "<3-4 sentences describing current market sentiment>",
  "sentimentLabel": "Bullish|Neutral|Bearish",
  "shockScore": <number 0-10 for Black Swan detector>,
  "recentHeadlines": ["<headline 1>", "<headline 2>", "<headline 3>"],
  "upcomingCatalysts": ["<catalyst 1>", "<catalyst 2>"],
  "analystConsensus": "<e.g. 18 Buy, 5 Hold, 2 Sell or community sentiment>",
  "socialMood": "Very Positive|Positive|Neutral|Negative|Very Negative"
}`;

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 1000,
    temperature: 0.3,
    messages: [
      { role: 'system', content: 'You are a professional sentiment analysis agent. Always respond with valid JSON only. No markdown, no backticks, no extra text.' },
      { role: 'user', content: prompt }
    ]
  });

  const text = response.choices[0]?.message?.content || '';
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

module.exports = { runSentimentAgent };