import React from 'react';

const styles = {
  header: {
    padding: '1.25rem 2rem',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'rgba(10,12,16,0.97)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    backdropFilter: 'blur(12px)',
  },
  logo: {
    fontFamily: 'Syne, sans-serif',
    fontWeight: 800,
    fontSize: '1.1rem',
    letterSpacing: '-0.5px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#f0f2f7',
  },
  dot: {
    width: '8px',
    height: '8px',
    background: '#4ade80',
    borderRadius: '50%',
  },
  badge: {
    fontSize: '11px',
    fontFamily: 'DM Mono, monospace',
    color: '#4ade80',
    background: 'rgba(74,222,128,0.1)',
    border: '1px solid rgba(74,222,128,0.25)',
    padding: '3px 10px',
    borderRadius: '20px',
  },
};

export default function Header() {
  return (
    <header style={styles.header}>
      <div style={styles.logo}>
        <div style={styles.dot} />
        AlphaSignal
      </div>
      <div style={styles.badge}>Multi-Agent AI · Live Market Data</div>
    </header>
  );
}
