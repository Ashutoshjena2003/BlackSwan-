import React from 'react';
import { getVerdictColor, getConfidenceClass, getPanelClass } from '../utils/formatters';

function Tag({ text, type }) {
  const styles = {
    positive: { bg: 'rgba(74,222,128,0.1)', color: '#4ade80', border: 'rgba(74,222,128,0.2)' },
    neutral:  { bg: 'rgba(96,165,250,0.1)', color: '#60a5fa', border: 'rgba(96,165,250,0.2)' },
    warn:     { bg: 'rgba(251,191,36,0.1)', color: '#fbbf24', border: 'rgba(251,191,36,0.2)' },
    risk:     { bg: 'rgba(248,113,113,0.1)', color: '#f87171', border: 'rgba(248,113,113,0.2)' },
  };
  const s = styles[type] || styles.neutral;
  return (
    <span style={{
      display: 'inline-block',
      fontSize: '11px',
      fontFamily: 'DM Mono, monospace',
      padding: '3px 10px',
      borderRadius: '20px',
      margin: '2px',
      background: s.bg,
      color: s.color,
      border: `1px solid ${s.border}`,
    }}>
      {text}
    </span>
  );
}

export default function DecisionPanel({ decision, blackSwan, isLoading }) {
  const panelStyle = () => {
    if (isLoading) return {};
    if (!decision) return {};
    if (blackSwan?.detected) return {
      borderColor: 'rgba(248,113,113,0.5)',
      background: 'rgba(248,113,113,0.03)',
    };
    if (decision.verdict === 'BUY') return {
      borderColor: 'rgba(74,222,128,0.3)',
      background: 'rgba(74,222,128,0.03)',
    };
    if (decision.verdict === 'SELL') return {
      borderColor: 'rgba(248,113,113,0.3)',
      background: 'rgba(248,113,113,0.03)',
    };
    return {
      borderColor: 'rgba(251,191,36,0.3)',
      background: 'rgba(251,191,36,0.03)',
    };
  };

  const confClass = getConfidenceClass(decision?.confidence || 0);
  const confColor = confClass === 'high' ? '#4ade80' : confClass === 'mid' ? '#fbbf24' : '#f87171';

  return (
    <div style={{
      background: '#12151c',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '16px',
      padding: '1.75rem',
      marginBottom: '20px',
      transition: 'border-color 0.3s, background 0.3s',
      ...panelStyle(),
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        {/* Verdict */}
        <div>
          <div style={{ fontSize: '11px', color: '#4a5168', fontFamily: 'DM Mono, monospace', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
            CIO Ensemble · Final Decision
          </div>
          <div style={{
            fontFamily: 'DM Serif Display, serif',
            fontSize: '3.5rem',
            lineHeight: 1,
            color: decision ? getVerdictColor(decision.verdict) : '#1a1f2a',
          }}>
            {isLoading ? '...' : decision?.verdict || '—'}
          </div>
          {decision?.targetPrice1W && (
            <div style={{ fontSize: '0.85rem', color: '#8a91a8', marginTop: '8px', fontFamily: 'DM Mono, monospace' }}>
              1-week target: {decision.targetPrice1W}
            </div>
          )}
          {decision?.rationale && (
            <div style={{ fontSize: '0.8rem', color: '#4a5168', marginTop: '4px', fontFamily: 'DM Mono, monospace', maxWidth: '360px' }}>
              {decision.rationale}
            </div>
          )}
        </div>

        {/* Confidence */}
        <div style={{ flex: 1, minWidth: '180px', marginTop: '8px' }}>
          <div style={{ fontSize: '11px', color: '#4a5168', fontFamily: 'DM Mono, monospace', marginBottom: '6px' }}>
            CONFIDENCE
          </div>
          <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${decision?.confidence || 0}%`,
              background: confColor,
              borderRadius: '3px',
              transition: 'width 1s ease',
            }} />
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f0f2f7', marginTop: '4px' }}>
            {decision ? `${decision.confidence}%` : '—'}
          </div>
        </div>
      </div>

      {/* Analysis */}
      <div style={{ marginTop: '1.25rem', fontSize: '0.87rem', color: '#8a91a8', lineHeight: 1.75 }}>
        {isLoading
          ? <span style={{ color: '#4a5168' }}>Synthesizing all agent outputs...</span>
          : decision?.analysis || '—'}
      </div>

      {/* Action tags */}
      {decision?.actionTags && (
        <div style={{ marginTop: '12px' }}>
          {decision.actionTags.map((tag, i) => (
            <Tag key={i} text={tag} type={i === 0 ? 'positive' : i === 1 ? 'neutral' : 'warn'} />
          ))}
        </div>
      )}
    </div>
  );
}
