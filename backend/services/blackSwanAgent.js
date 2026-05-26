// Black Swan Detection Module (N1 — Novelty)
// Uses "fusion gate" logic: BOTH anomaly score AND sentiment shock score
// must exceed thresholds to trigger a black swan alert.

const ANOMALY_THRESHOLD = 6.5;   // price/volume shock
const SHOCK_THRESHOLD = 7.0;     // sentiment shock

function detectBlackSwan(marketData, sentimentResult, riskResult) {
  const { quote, financials } = marketData;

  // --- Anomaly Detector (price + volume signals) ---
  // Using beta and price position as a proxy for price shock
  // In production: compare today's volume vs 30-day average using historical data
  const beta = parseFloat(financials.beta) || 1;
  const priceChangeAbs = Math.abs(parseFloat(quote.change?.split('(')[0]) || 0);

  // Rough anomaly score: large move relative to beta = more anomalous
  let anomalyScore = 0;
  if (priceChangeAbs > 5) anomalyScore += 3;
  if (priceChangeAbs > 10) anomalyScore += 3;
  if (priceChangeAbs > 15) anomalyScore += 2;
  if (riskResult.score >= 8) anomalyScore += 2;
  anomalyScore = Math.min(anomalyScore, 10);

  // --- Sentiment Shock Detector ---
  // Provided by the Sentiment Agent (VADER/BERT equivalent)
  const shockScore = sentimentResult.shockScore || 0;

  // --- Fusion Gate (AND logic — both must exceed threshold) ---
  const triggered = anomalyScore >= ANOMALY_THRESHOLD && shockScore >= SHOCK_THRESHOLD;

  let description = null;
  let override = null;

  if (triggered) {
    description =
      `Anomaly score ${anomalyScore.toFixed(1)}/10 combined with sentiment shock score ` +
      `${shockScore.toFixed(1)}/10 exceeds detection thresholds. ` +
      `This suggests an unusual event is occurring. ` +
      `Recommendation is being overridden to minimize risk exposure.`;

    override = {
      originalVerdict: null, // will be filled by CIO
      forcedVerdict: riskResult.score >= 8 ? 'SELL' : 'HOLD',
      riskFlag: 'BLACK_SWAN_DETECTED',
      minimizeRisk: true
    };
  }

  return {
    detected: triggered,
    anomalyScore: parseFloat(anomalyScore.toFixed(1)),
    shockScore: parseFloat(shockScore.toFixed(1)),
    description,
    override
  };
}

module.exports = { detectBlackSwan };
