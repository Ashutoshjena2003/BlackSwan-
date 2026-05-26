const express = require('express');
const router = express.Router();

const { getMarketData } = require('../services/marketData');
const { runFundamentalAgent } = require('../services/fundamentalAgent');
const { runSentimentAgent } = require('../services/sentimentAgent');
const { runRiskAgent } = require('../services/riskAgent');
const { detectBlackSwan } = require('../services/blackSwanAgent');
const { runCIOAgent } = require('../services/cioAgent');

// POST /api/analyze
// Body: { company: "Apple" }
router.post('/analyze', async (req, res, next) => {
  try {
    const { company } = req.body;
    if (!company || typeof company !== 'string') {
      return res.status(400).json({ error: 'company field is required' });
    }

    console.log(`\n[analyze] Starting analysis for: ${company}`);
    const startTime = Date.now();

    // Step 1: Market Data
    console.log('[1/6] Fetching market data...');
    const marketData = await getMarketData(company.trim());
    console.log(`      → ${marketData.companyName} (${marketData.ticker})`);

    // Step 2-4: Run the three specialist agents in parallel for speed
    console.log('[2/6] Running Fundamental, Sentiment, Risk agents in parallel...');
    const [fundamentalResult, sentimentResult, riskResult] = await Promise.all([
      runFundamentalAgent(marketData),
      runSentimentAgent(marketData),
      runRiskAgent(marketData)
    ]);
    console.log(`      → Fundamental: ${fundamentalResult.score}/10`);
    console.log(`      → Sentiment:   ${sentimentResult.score}/10`);
    console.log(`      → Risk:        ${riskResult.score}/10`);

    // Step 5: Black Swan Detection (uses outputs of sentiment + risk agents)
    console.log('[5/6] Running Black Swan Detection...');
    const blackSwanResult = detectBlackSwan(marketData, sentimentResult, riskResult);
    console.log(`      → Black Swan detected: ${blackSwanResult.detected}`);

    // Step 6: CIO Ensemble
    console.log('[6/6] Running CIO Ensemble Agent...');
    const cioResult = await runCIOAgent(
      marketData,
      fundamentalResult,
      sentimentResult,
      riskResult,
      blackSwanResult
    );
    console.log(`      → Verdict: ${cioResult.verdict} (${cioResult.confidence}% confidence)`);
    console.log(`      → Total time: ${((Date.now() - startTime) / 1000).toFixed(1)}s`);

    // Return full response
    res.json({
      ticker: marketData.ticker,
      companyName: marketData.companyName,
      sector: marketData.sector,
      industry: marketData.industry,
      analyzedAt: new Date().toISOString(),
      marketData: {
        price: marketData.quote.price,
        change: marketData.quote.change,
        changeDir: marketData.quote.changeDir,
        marketCap: marketData.financials.marketCap,
        marketCapLabel: marketData.financials.marketCapLabel,
        peRatio: marketData.financials.peRatio,
        peLabel: `Forward P/E: ${marketData.financials.forwardPE}`,
        range52w: marketData.range52w.display,
        rangeLabel: marketData.range52w.label,
        analystTarget: marketData.financials.analystTarget,
        beta: marketData.financials.beta,
        eps: marketData.financials.eps,
        dividendYield: marketData.financials.dividendYield
      },
      agents: {
        fundamental: fundamentalResult,
        sentiment: sentimentResult,
        risk: riskResult
      },
      blackSwan: blackSwanResult,
      decision: cioResult
    });

  } catch (err) {
    console.error('[analyze] Error:', err.message);
    next(err);
  }
});

// GET /api/market/:ticker — raw market data only (no AI)
router.get('/market/:ticker', async (req, res, next) => {
  try {
    const marketData = await getMarketData(req.params.ticker);
    res.json(marketData);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
