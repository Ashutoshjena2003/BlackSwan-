import React from 'react';

function MetricCard({ label, value, sub, subColor }) {
  return (
    <div style={{
      background: '#1a1f2a',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '12px',
      padding: '1rem 1.25rem',
    }}>
      <div style={{ fontSize: '11px', color: '#4a5168', fontFamily: 'DM Mono, monospace', letterSpacing: '0.5px', marginBottom: '4px' }}>
        {label}
      </div>
      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f0f2f7' }}>{value}</div>
      {sub && (
        <div style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', marginTop: '2px', color: subColor || '#4a5168' }}>
          {sub}
        </div>
      )}
    </div>
  );
}

export default function MarketDataRow({ data }) {
  if (!data) return null;

  const changeColor = data.changeDir === 'up' ? '#4ade80' : '#f87171';

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '12px',
      marginBottom: '20px',
    }}>
      <MetricCard
        label="CURRENT PRICE"
        value={data.price}
        sub={data.change}
        subColor={changeColor}
      />
      <MetricCard
        label="MARKET CAP"
        value={data.marketCap}
        sub={data.marketCapLabel}
      />
      <MetricCard
        label="P/E RATIO"
        value={data.peRatio}
        sub={data.peLabel}
      />
      <MetricCard
        label="52W RANGE"
        value={data.range52w}
        sub={data.rangeLabel}
      />
    </div>
  );
}
