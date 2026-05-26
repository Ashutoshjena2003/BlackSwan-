import React from 'react';

function Tag({ text, type }) {
  const styles = {
    risk:    { bg: 'rgba(248,113,113,0.1)', color: '#f87171', border: 'rgba(248,113,113,0.2)' },
    warn:    { bg: 'rgba(251,191,36,0.1)', color: '#fbbf24', border: 'rgba(251,191,36,0.2)' },
    neutral: { bg: 'rgba(96,165,250,0.1)', color: '#60a5fa', border: 'rgba(96,165,250,0.2)' },
    positive:{ bg: 'rgba(74,222,128,0.1)', color: '#4ade80', border: 'rgba(74,222,128,0.2)' },
  };
  const s = styles[type] || styles.neutral;
  return (
    <span style={{
      display: 'inline-block', fontSize: '11px', fontFamily: 'DM Mono, monospace',
      padding: '3px 10px', borderRadius: '20px', margin: '2px',
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
    }}>
      {text}
    </span>
  );
}

function Section({ title, children }) {
  return (
    <div style={{
      background: '#12151c',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '14px',
      padding: '1.25rem',
    }}>
      <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#4a5168', marginBottom: '12px', fontFamily: 'DM Mono, monospace' }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function BulletList({ items, color = '#8a91a8', prefix = '↗' }) {
  if (!items?.length) return null;
  return (
    <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px' }}>
      {items.map((item, i) => (
        <li key={i} style={{ fontSize: '0.8rem', color, display: 'flex', gap: '6px', marginBottom: '4px', lineHeight: 1.5 }}>
          <span style={{ flexShrink: 0, color: '#4a5168' }}>{prefix}</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function AnalysisGrid({ agents, decision }) {
  if (!agents) return null;
  const { fundamental: f, sentiment: s, risk: r } = agents;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }} className="fade-in">

      {/* Fundamental */}
      <Section title="Fundamental Analysis">
        <p style={{ fontSize: '0.84rem', color: '#8a91a8', lineHeight: 1.75 }}>{f?.analysis}</p>
        {f?.revenueGrowth && (
          <div style={{ marginTop: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Tag text={`Revenue ${f.revenueGrowth}`} type="positive" />
            {f.earningsSurprise && <Tag text={f.earningsSurprise} type="neutral" />}
          </div>
        )}
        <BulletList items={f?.bullPoints} color="#4ade80" prefix="+" />
        <BulletList items={f?.bearPoints} color="#f87171" prefix="−" />
      </Section>

      {/* Sentiment */}
      <Section title="Sentiment & Market Mood">
        <p style={{ fontSize: '0.84rem', color: '#8a91a8', lineHeight: 1.75 }}>{s?.analysis}</p>
        {s?.recentHeadlines?.length > 0 && (
          <div style={{ marginTop: '10px' }}>
            <div style={{ fontSize: '11px', color: '#4a5168', fontFamily: 'DM Mono, monospace', marginBottom: '6px' }}>RECENT HEADLINES</div>
            {s.recentHeadlines.map((h, i) => (
              <div key={i} style={{ fontSize: '0.78rem', color: '#8a91a8', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', lineHeight: 1.4 }}>
                {h}
              </div>
            ))}
          </div>
        )}
        {s?.analystConsensus && (
          <div style={{ marginTop: '10px' }}>
            <Tag text={`Analysts: ${s.analystConsensus}`} type="neutral" />
            {s?.socialMood && <Tag text={`Social: ${s.socialMood}`} type={s.score >= 6 ? 'positive' : s.score >= 4 ? 'warn' : 'risk'} />}
          </div>
        )}
        {s?.upcomingCatalysts?.length > 0 && (
          <div style={{ marginTop: '10px' }}>
            <div style={{ fontSize: '11px', color: '#4a5168', fontFamily: 'DM Mono, monospace', marginBottom: '4px' }}>CATALYSTS</div>
            {s.upcomingCatalysts.map((c, i) => <Tag key={i} text={c} type="warn" />)}
          </div>
        )}
      </Section>

      {/* Risk */}
      <Section title="Risk Factors">
        <p style={{ fontSize: '0.84rem', color: '#8a91a8', lineHeight: 1.75 }}>{r?.analysis}</p>
        {r?.topRisks?.map((risk, i) => (
          <div key={i} style={{
            marginTop: '8px', padding: '8px 10px',
            background: 'rgba(248,113,113,0.05)',
            border: '1px solid rgba(248,113,113,0.1)',
            borderRadius: '8px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#f0f2f7' }}>{risk.title}</span>
              <Tag text={risk.severity} type={risk.severity === 'High' ? 'risk' : risk.severity === 'Medium' ? 'warn' : 'neutral'} />
            </div>
            <div style={{ fontSize: '0.75rem', color: '#8a91a8', lineHeight: 1.4 }}>{risk.description}</div>
          </div>
        ))}
        {r?.riskTags && (
          <div style={{ marginTop: '10px' }}>
            {r.riskTags.map((t, i) => <Tag key={i} text={t} type="risk" />)}
          </div>
        )}
      </Section>

      {/* CIO */}
      <Section title="CIO Synthesis">
        <p style={{ fontSize: '0.84rem', color: '#8a91a8', lineHeight: 1.75 }}>{decision?.analysis}</p>
        {decision?.actionTags?.length > 0 && (
          <div style={{ marginTop: '12px' }}>
            {decision.actionTags.map((t, i) => (
              <Tag key={i} text={t} type={i === 0 ? 'positive' : i === 1 ? 'neutral' : 'warn'} />
            ))}
          </div>
        )}
        <div style={{ marginTop: '14px', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
          <div style={{ fontSize: '11px', color: '#4a5168', fontFamily: 'DM Mono, monospace', marginBottom: '6px' }}>WEIGHT BREAKDOWN</div>
          {[
            { label: 'Fundamental', pct: 40 },
            { label: 'Sentiment', pct: 30 },
            { label: 'Risk (penalty)', pct: 30 },
          ].map(({ label, pct }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '11px', color: '#4a5168', fontFamily: 'DM Mono, monospace', width: '110px' }}>{label}</span>
              <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: '#4ade80', borderRadius: '2px' }} />
              </div>
              <span style={{ fontSize: '11px', color: '#8a91a8', fontFamily: 'DM Mono, monospace' }}>{pct}%</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
