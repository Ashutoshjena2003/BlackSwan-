import React from 'react';
import { getScoreColor } from '../utils/formatters';

export default function AgentCard({ name, score, headline, detail, type, isLoading }) {
  const isRisk = type === 'risk';
  const scoreColor = score != null ? getScoreColor(score, isRisk) : 'var(--text3)';

  const getBorderColor = () => {
    if (!score) return 'rgba(255,255,255,0.07)';
    if (isRisk) {
      if (score >= 7) return 'rgba(248,113,113,0.4)';
      if (score >= 5) return 'rgba(251,191,36,0.3)';
      return 'rgba(74,222,128,0.3)';
    }
    if (score >= 7) return 'rgba(74,222,128,0.3)';
    if (score >= 4) return 'rgba(255,255,255,0.1)';
    return 'rgba(248,113,113,0.3)';
  };

  const getTopBarColor = () => {
    if (!score) return 'transparent';
    if (isRisk) {
      if (score >= 7) return '#f87171';
      if (score >= 5) return '#fbbf24';
      return '#4ade80';
    }
    if (score >= 7) return '#4ade80';
    if (score >= 4) return '#fbbf24';
    return '#f87171';
  };

  return (
    <div style={{
      background: '#12151c',
      border: `1px solid ${getBorderColor()}`,
      borderRadius: '14px',
      padding: '1.25rem',
      position: 'relative',
      overflow: 'hidden',
      transition: 'border-color 0.3s',
    }}>
      {/* Top accent bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
        background: getTopBarColor(),
        transition: 'background 0.3s',
      }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#8a91a8' }}>
          {name}
        </span>
        <span style={{
          fontSize: '10px',
          fontFamily: 'DM Mono, monospace',
          padding: '2px 8px',
          borderRadius: '20px',
          background: isLoading ? 'rgba(251,191,36,0.15)' : score != null ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.05)',
          color: isLoading ? '#fbbf24' : score != null ? '#4ade80' : '#4a5168',
        }}>
          {isLoading ? 'running' : score != null ? 'done' : 'idle'}
        </span>
      </div>

      {/* Score */}
      <div style={{
        fontFamily: 'DM Serif Display, serif',
        fontSize: '2.5rem',
        lineHeight: 1,
        color: isLoading ? '#4a5168' : scoreColor,
        margin: '8px 0 4px',
        transition: 'color 0.3s',
      }}>
        {isLoading ? '...' : score != null ? score.toFixed(1) : '—'}
      </div>

      <div style={{ fontSize: '0.72rem', color: '#4a5168', fontFamily: 'DM Mono, monospace' }}>
        {isRisk ? 'Risk Score (lower = safer)' : 'Agent Score / 10'}
      </div>

      {/* Detail */}
      <div style={{
        fontSize: '0.75rem',
        color: '#8a91a8',
        marginTop: '10px',
        fontFamily: 'DM Mono, monospace',
        lineHeight: 1.5,
      }}>
        {isLoading ? 'Analyzing...' : headline || detail || '—'}
      </div>
    </div>
  );
}
