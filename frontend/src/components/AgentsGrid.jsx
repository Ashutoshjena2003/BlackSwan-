import React from 'react';
import AgentCard from './AgentCard';

export default function AgentsGrid({ agents, isLoading }) {
  const f = agents?.fundamental;
  const s = agents?.sentiment;
  const r = agents?.risk;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '12px',
      marginBottom: '20px',
    }}>
      <AgentCard
        name="Fundamental Agent"
        type="fundamental"
        score={f?.score}
        headline={f?.headline}
        detail={f?.detail}
        isLoading={isLoading && !f}
      />
      <AgentCard
        name="Sentiment Agent"
        type="sentiment"
        score={s?.score}
        headline={s?.sentimentLabel ? `${s.sentimentLabel} — ${s.headline}` : s?.headline}
        detail={s?.detail}
        isLoading={isLoading && !s}
      />
      <AgentCard
        name="Risk Agent"
        type="risk"
        score={r?.score}
        headline={r?.riskLevel ? `${r.riskLevel} Risk — ${r.headline}` : r?.headline}
        detail={r?.detail}
        isLoading={isLoading && !r}
      />
    </div>
  );
}
