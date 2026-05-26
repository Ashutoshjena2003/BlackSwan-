const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function runCIOAgent(marketData, fundamentalResult, sentimentResult, riskResult, blackSwanResult) {
  const { ticker, companyName, quote, financials, range52w } = marketData;

  // If black swan detected — override without LLM call
  if (blackSwanResult.detected && blackSwanResult.override) {
    return {
      verdict: blackSwanResult.override.forcedVerdict,
      confidence: 40,
      targetPrice1W: quote.price,
      analysis:
        `Black Swan override triggered. Both the anomaly detector (score: ${blackSwanResult.anomalyScore}/10) ` +
        `and sentiment shock detector (score: ${blackSwanResult.shockScore}/10) exceeded their thresholds simultaneously. ` +
        `The fusion gate has activated a risk minimization protocol. ` +
        `Normal recommendation logic is suspended — capital preservation is the priority.`,
      actionTags: ['Risk Minimization', 'Reduce Exposure', 'Monitor Closely'],
      rationale: 'Black Swan event detected — overriding to protect capital.',
      weightBreakdown: { fundamental: 0.2, sentiment: 0.2, risk: 0.6 }
    };
  }

  const prompt = `You are a Chief Investment Officer (CIO) Ensemble Agent.

You have received outputs from three specialist agents analyzing ${companyName} (${ticker}):

FUNDAMENTAL AGENT:
- Score: ${fundamentalResult.score}/10
- Analysis: ${fundamentalResult.analysis}
- Bull points: ${fundamentalResult.bullPoints?.join(', ')}
- Bear points: ${fundamentalResult.bearPoints?.join(', ')}

SENTIMENT AGENT:
- Score: ${sentimentResult.score}/10
- Sentiment: ${sentimentResult.sentimentLabel}
- Analysis: ${sentimentResult.analysis}
- Analyst consensus: ${sentimentResult.analystConsensus}

RISK AGENT:
- Score: ${riskResult.score}/10 (lower = safer)
- Risk level: ${riskResult.riskLevel}
- Analysis: ${riskResult.analysis}

LIVE MARKET DATA:
- Current price: ${quote.price} (${quote.change})
- Analyst target: ${financials.analystTarget}
- 52-week range: ${range52w.display} — ${range52w.label}
- Beta: ${financials.beta}

Synthesize all agent outputs into a final investment recommendation.
Weighting: Fundamental 40%, Sentiment 30%, Risk 30% (high risk REDUCES the overall score).

Calculate a weighted score:
- Fundamental contributes: fundamentalScore * 0.4
- Sentiment contributes: sentimentScore * 0.3  
- Risk penalty: (10 - riskScore) * 0.3
- Total out of 10 → map to BUY (>6.5), HOLD (5-6.5), SELL (<5)

Respond ONLY with a valid JSON object (no markdown, no extra text):
{
  "verdict": "BUY|HOLD|SELL",
  "confidence": <integer 0-100>,
  "targetPrice1W": "<e.g. $185.50 — realistic 1 week target based on current price and signals>",
  "analysis": "<4-5 sentence CIO synthesis — reference all three agents, be specific with numbers>",
  "actionTags": ["<tag 1>", "<tag 2>", "<tag 3>"],
  "rationale": "<1 sentence core reason for the verdict>",
  "weightBreakdown": {
    "fundamental": 0.4,
    "sentiment": 0.3,
    "risk": 0.3
  }
}`;

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 1000,
    temperature: 0.2,
    messages: [
      {
        role: 'system',
        content: 'You are a Chief Investment Officer making final investment decisions. Always respond with valid JSON only. No markdown, no backticks, no extra text before or after the JSON.'
      },
      { role: 'user', content: prompt }
    ]
  });

  const text = response.choices[0]?.message?.content || '';
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

module.exports = { runCIOAgent };