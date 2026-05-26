const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function runFundamentalAgent(marketData) {
  const { ticker, companyName, sector, financials, range52w, assetType } = marketData;

  const isAlternative = ['crypto', 'commodity', 'forex'].includes(assetType);

  const prompt = isAlternative
    ? `You are a Fundamental Analysis Agent for an investment platform.

Analyze the fundamentals of ${companyName} (${ticker}) — Asset type: ${assetType}.

Current data:
- Price: ${marketData.quote.price}
- 52-Week Range: ${range52w.display}
- Sector: ${sector}

For this ${assetType} asset, analyze:
1. Supply and demand fundamentals
2. Macro factors driving price (inflation, interest rates, adoption, etc.)
3. Historical price behavior and cycles
4. Key drivers that move this asset's price

Respond ONLY with a valid JSON object (no markdown, no extra text):
{
  "score": <number 0-10>,
  "headline": "<one-line summary, max 10 words>",
  "detail": "<2-line quick summary>",
  "analysis": "<3-4 sentences of analysis>",
  "bullPoints": ["<bull 1>", "<bull 2>", "<bull 3>"],
  "bearPoints": ["<bear 1>", "<bear 2>"],
  "revenueGrowth": "<key growth metric for this asset>",
  "earningsSurprise": "<recent notable price move or event>"
}`
    : `You are a Fundamental Analysis Agent for an investment platform.

Analyze the fundamentals of ${companyName} (${ticker}) in the ${sector} sector.

Known financial data:
- Market Cap: ${financials.marketCap} (${financials.marketCapLabel})
- P/E Ratio: ${financials.peRatio}
- Forward P/E: ${financials.forwardPE}
- EPS: ${financials.eps}
- Profit Margin: ${financials.profitMargin}
- Operating Margin: ${financials.operatingMargin}
- Return on Equity: ${financials.returnOnEquity}
- Dividend Yield: ${financials.dividendYield}
- Beta: ${financials.beta}
- 52-Week Range: ${range52w.display}
- Analyst Target: ${financials.analystTarget}

Analyze revenue growth, earnings, cash flow, balance sheet health, and valuation vs sector peers.

Respond ONLY with a valid JSON object (no markdown, no extra text):
{
  "score": <number 0-10, where 10 is extremely strong fundamentals>,
  "headline": "<one-line summary, max 10 words>",
  "detail": "<2-line quick summary of key metrics>",
  "analysis": "<3-4 sentences of deep fundamental analysis>",
  "bullPoints": ["<bull 1>", "<bull 2>", "<bull 3>"],
  "bearPoints": ["<bear 1>", "<bear 2>"],
  "revenueGrowth": "<e.g. +12% YoY>",
  "earningsSurprise": "<e.g. Beat by 8% last quarter>"
}`;

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 1000,
    temperature: 0.3,
    messages: [
      { role: 'system', content: 'You are a professional fundamental analysis agent. Always respond with valid JSON only. No markdown, no backticks, no extra text.' },
      { role: 'user', content: prompt }
    ]
  });

  const text = response.choices[0]?.message?.content || '';
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

module.exports = { runFundamentalAgent };