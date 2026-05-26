import React, { useRef } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import MarketDataRow from './components/MarketDataRow';
import AgentsGrid from './components/AgentsGrid';
import DecisionPanel from './components/DecisionPanel';
import BlackSwanBanner from './components/BlackSwanBanner';
import AnalysisGrid from './components/AnalysisGrid';
import LoadingSkeleton from './components/LoadingSkeleton';
import { useAnalysis } from './hooks/useAnalysis';

export default function App() {
  const { status, stage, result, error, analyze } = useAnalysis();
  const resultsRef = useRef(null);

  const handleAnalyze = async (company) => {
    // Scroll to results area
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
    await analyze(company);
  };

  const isLoading = status === 'loading';
  const hasResult = status === 'success' && result;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0a0c10' }}>
      <Header />

      {/* Hero / Search */}
      <div style={{
        padding: '5rem 2rem 3rem',
        textAlign: 'center',
        background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(74,222,128,0.05) 0%, transparent 70%)',
      }}>
        <SearchBar onAnalyze={handleAnalyze} isLoading={isLoading} />
      </div>

      {/* Results */}
      {(isLoading || hasResult || error) && (
        <div
          ref={resultsRef}
          style={{ flex: 1, padding: '2rem', maxWidth: '1100px', margin: '0 auto', width: '100%' }}
        >
          {/* Error state */}
          {error && (
            <div style={{
              background: 'rgba(248,113,113,0.08)',
              border: '1px solid rgba(248,113,113,0.3)',
              borderRadius: '12px',
              padding: '1.25rem',
              color: '#f87171',
              fontFamily: 'DM Mono, monospace',
              fontSize: '0.85rem',
            }}>
              ⚠ Error: {error}
              <div style={{ marginTop: '6px', fontSize: '0.78rem', color: '#8a91a8' }}>
                Make sure the backend is running on port 3001 and your API keys are set in backend/.env
              </div>
            </div>
          )}

          {/* Loading state */}
          {isLoading && <LoadingSkeleton stage={stage} />}

          {/* Results */}
          {hasResult && (
            <div className="fade-in">
              {/* Status banner */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                background: '#12151c', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '10px', padding: '0.75rem 1.25rem', marginBottom: '20px',
              }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80' }} />
                <span style={{ fontSize: '0.82rem', color: '#8a91a8', fontFamily: 'DM Mono, monospace' }}>
                  Analysis complete — {result.companyName} ({result.ticker}) · {result.sector} · {result.industry}
                </span>
                <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#4a5168', fontFamily: 'DM Mono, monospace' }}>
                  {new Date(result.analyzedAt).toLocaleTimeString()}
                </span>
              </div>

              <MarketDataRow data={result.marketData} />
              <AgentsGrid agents={result.agents} isLoading={false} />
              <BlackSwanBanner blackSwan={result.blackSwan} />
              <DecisionPanel decision={result.decision} blackSwan={result.blackSwan} isLoading={false} />
              <AnalysisGrid agents={result.agents} decision={result.decision} />

              {/* Disclaimer */}
              <div style={{
                textAlign: 'center',
                fontSize: '11px',
                color: '#4a5168',
                fontFamily: 'DM Mono, monospace',
                padding: '2rem 0 1rem',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                marginTop: '1rem',
              }}>
                ⚠ For informational and educational purposes only. Not financial advice. Always conduct your own research before making investment decisions.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
