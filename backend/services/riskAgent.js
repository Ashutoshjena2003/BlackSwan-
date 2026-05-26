const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function runRiskAgent(marketData) {
  const { ticker, companyName, sector, financials, assetType } = marketData;

  const prompt = `You are a Risk Identification Agent for an investment platform.

Assess the risk profile of ${companyName} (${ticker}).
Asset type: ${assetType}
Beta: ${financials.beta}
Market Cap: ${financials.marketCap}
52-Week Range: ${marketData.range52w.display}

Identify key risks specific to this asset type (${assetType}):
- For stocks: regulatory, competitive, debt, insider selling
- For crypto: regulatory crackdowns, hacks, whale dumps, network risk
- For commodities: supply chain, geopolitical, demand destruction
- For forex: central bank policy, political risk, inflation

Rate overall risk 0-10 (10 = extremely risky).

Respond ONLY with a valid JSON object (no markdown, no extra text):
{
  "score": <number 0-10, where 10 is maximum risk>,
  "headline": "<one-line risk summary, max 10 words>",
  "detail": "<top 2 risk factors in 1-2 lines>",
  "analysis": "<3-4 sentences of risk analysis>",
  "riskLevel": "Low|Moderate|High|Very High|Extreme",
  "riskTags": ["<tag 1>", "<tag 2>", "<tag 3>", "<tag 4>"],
  "topRisks": [
    { "title": "<risk>", "description": "<1 sentence>", "severity": "Low|Medium|High" },
    { "title": "<risk>", "description": "<1 sentence>", "severity": "Low|Medium|High" },
    { "title": "<risk>", "description": "<1 sentence>", "severity": "Low|Medium|High" }
  ],
  "betaInterpretation": "<volatility explanation>",
  "regulatoryRisk": "Low|Medium|High"
}`;

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 1000,
    temperature: 0.3,
    messages: [
      { role: 'system', content: 'You are a professional risk analysis agent. Always respond with valid JSON only. No markdown, no backticks, no extra text.' },
      { role: 'user', content: prompt }
    ]
  });

  const text = response.choices[0]?.message?.content || '';
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

module.exports = { runRiskAgent };