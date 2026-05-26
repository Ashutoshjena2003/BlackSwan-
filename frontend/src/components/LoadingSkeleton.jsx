import React from 'react';

function Skel({ width = '100%', height = '14px', style = {} }) {
  return (
    <div style={{
      width, height,
      background: '#1a1f2a',
      borderRadius: '6px',
      animation: 'shimmer 1.5s infinite',
      ...style,
    }} />
  );
}

export default function LoadingSkeleton({ stage }) {
  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      {/* Status strip */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        background: '#12151c', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '10px', padding: '0.75rem 1.25rem', marginBottom: '20px',
      }}>
        <div style={{
          width: '7px', height: '7px', borderRadius: '50%',
          background: '#fbbf24', boxShadow: '0 0 8px #fbbf24',
          animation: 'pulse 1.5s infinite',
        }} />
        <span style={{ fontSize: '0.82rem', color: '#8a91a8', fontFamily: 'DM Mono, monospace' }}>
          {stage}
        </span>
      </div>

      {/* Metric cards skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ background: '#1a1f2a', borderRadius: '12px', padding: '1rem 1.25rem' }}>
            <Skel width="60%" height="11px" style={{ marginBottom: '8px' }} />
            <Skel width="80%" height="22px" style={{ marginBottom: '6px' }} />
            <Skel width="50%" height="11px" />
          </div>
        ))}
      </div>

      {/* Agent cards skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ background: '#12151c', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <Skel width="120px" height="12px" />
              <Skel width="40px" height="12px" />
            </div>
            <Skel width="60px" height="40px" style={{ marginBottom: '8px' }} />
            <Skel width="100%" height="12px" style={{ marginBottom: '4px' }} />
            <Skel width="80%" height="12px" />
          </div>
        ))}
      </div>

      {/* Decision panel skeleton */}
      <div style={{ background: '#12151c', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '1.75rem', marginBottom: '20px' }}>
        <Skel width="180px" height="12px" style={{ marginBottom: '12px' }} />
        <Skel width="140px" height="56px" style={{ marginBottom: '16px' }} />
        <Skel width="100%" height="14px" style={{ marginBottom: '8px' }} />
        <Skel width="85%" height="14px" style={{ marginBottom: '8px' }} />
        <Skel width="70%" height="14px" />
      </div>
    </div>
  );
}
