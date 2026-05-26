import React, { useState } from 'react';

const QUICK_PICKS = ['Apple', 'Tesla', 'NVIDIA', 'Microsoft', 'Amazon', 'Google', 'Meta', 'Netflix'];

export default function SearchBar({ onAnalyze, isLoading }) {
  const [input, setInput] = useState('');

  const handleSubmit = (company) => {
    const value = company || input.trim();
    if (!value || isLoading) return;
    setInput(value);
    onAnalyze(value);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      {/* Hero heading */}
      <h1 style={{
        fontFamily: 'DM Serif Display, serif',
        fontSize: 'clamp(2.4rem, 6vw, 4.5rem)',
        lineHeight: 1.05,
        letterSpacing: '-1px',
        marginBottom: '1rem',
        color: '#f0f2f7',
      }}>
        Investment analysis,<br />
        <em style={{ fontStyle: 'italic', color: '#4ade80' }}>intelligently automated</em>
      </h1>

      <p style={{
        fontSize: '1rem',
        color: '#8a91a8',
        maxWidth: '520px',
        margin: '0 auto 2.5rem',
        lineHeight: 1.7,
      }}>
        Multi-agent AI combining fundamentals, sentiment, risk, and black swan detection to generate actionable investment decisions.
      </p>

      {/* Search row */}
      <div style={{ display: 'flex', gap: '10px', maxWidth: '520px', margin: '0 auto' }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="Company name or ticker (e.g. Apple, TSLA)"
          disabled={isLoading}
          style={{
            flex: 1,
            background: '#12151c',
            border: '1px solid rgba(255,255,255,0.14)',
            color: '#f0f2f7',
            fontFamily: 'Syne, sans-serif',
            fontSize: '1rem',
            padding: '0.875rem 1.25rem',
            borderRadius: '12px',
            outline: 'none',
          }}
        />
        <button
          onClick={() => handleSubmit()}
          disabled={isLoading || !input.trim()}
          style={{
            background: isLoading ? '#4a5168' : '#4ade80',
            color: '#050a0a',
            border: 'none',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontFamily: 'Syne, sans-serif',
            fontWeight: 700,
            fontSize: '0.9rem',
            padding: '0.875rem 1.5rem',
            borderRadius: '12px',
            whiteSpace: 'nowrap',
            transition: 'background 0.15s',
          }}
        >
          {isLoading ? 'Analyzing...' : 'Analyze →'}
        </button>
      </div>

      {/* Quick picks */}
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '1rem', flexWrap: 'wrap' }}>
        {QUICK_PICKS.map(company => (
          <button
            key={company}
            onClick={() => handleSubmit(company)}
            disabled={isLoading}
            style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '12px',
              color: '#8a91a8',
              background: '#12151c',
              border: '1px solid rgba(255,255,255,0.07)',
              padding: '4px 12px',
              borderRadius: '20px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {company}
          </button>
        ))}
      </div>
    </div>
  );
}
