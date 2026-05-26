export function getVerdictColor(verdict) {
  if (!verdict) return 'var(--text)';
  if (verdict === 'BUY') return 'var(--accent)';
  if (verdict === 'SELL') return 'var(--danger)';
  return 'var(--warn)';
}

export function getScoreColor(score, inverted = false) {
  // inverted = true for risk score (lower is better)
  const s = inverted ? 10 - score : score;
  if (s >= 7) return 'var(--accent)';
  if (s >= 4) return 'var(--warn)';
  return 'var(--danger)';
}

export function getConfidenceClass(confidence) {
  if (confidence >= 70) return 'high';
  if (confidence >= 50) return 'mid';
  return 'low';
}

export function getPanelClass(verdict, blackSwan) {
  if (blackSwan) return 'black-swan';
  if (verdict === 'BUY') return 'buy-signal';
  if (verdict === 'SELL') return 'sell-signal';
  return 'hold-signal';
}

export function getRiskTagClass(severity) {
  if (severity === 'High') return 'tag-risk';
  if (severity === 'Medium') return 'tag-warn';
  return 'tag-neutral';
}
