import React from 'react';

export default function BlackSwanBanner({ blackSwan }) {
  if (!blackSwan?.detected) return null;

  return (
    <div style={{
      background: 'rgba(248,113,113,0.08)',
      border: '1px solid rgba(248,113,113,0.35)',
      borderRadius: '12px',
      padding: '1rem 1.25rem',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      animation: 'fadeIn 0.4s ease',
    }}>
      <span style={{ fontSize: '1.2rem', marginTop: '2px', flexShrink: 0 }}>⚠</span>
      <div>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f87171', marginBottom: '4px' }}>
          Black Swan Alert — Risk Minimization Active
        </div>
        <div style={{ fontSize: '0.8rem', color: '#8a91a8', lineHeight: 1.6 }}>
          {blackSwan.description}
        </div>
        <div style={{
          display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap',
        }}>
          <span style={{
            fontSize: '11px', fontFamily: 'DM Mono, monospace',
            background: 'rgba(248,113,113,0.1)', color: '#f87171',
            border: '1px solid rgba(248,113,113,0.2)',
            padding: '2px 8px', borderRadius: '20px',
          }}>
            Anomaly Score: {blackSwan.anomalyScore}/10
          </span>
          <span style={{
            fontSize: '11px', fontFamily: 'DM Mono, monospace',
            background: 'rgba(248,113,113,0.1)', color: '#f87171',
            border: '1px solid rgba(248,113,113,0.2)',
            padding: '2px 8px', borderRadius: '20px',
          }}>
            Shock Score: {blackSwan.shockScore}/10
          </span>
        </div>
      </div>
    </div>
  );
}
