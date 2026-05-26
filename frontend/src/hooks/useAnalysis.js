import { useState, useCallback } from 'react';
import { analyzeCompany } from '../services/api';

// Stages for visual progress feedback
const STAGES = [
  'Fetching live market data...',
  'Running Fundamental Agent (P/E, revenue, cash flow)...',
  'Running Sentiment Agent (news, social media)...',
  'Running Risk Agent (risk identification)...',
  'Running Black Swan Detection Module...',
  'CIO Ensemble synthesizing final decision...',
];

export function useAnalysis() {
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [stage, setStage] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const analyze = useCallback(async (company) => {
    setStatus('loading');
    setError(null);
    setResult(null);

    // Simulate progressive stage display while API runs
    let stageIdx = 0;
    setStage(STAGES[stageIdx]);

    const stageInterval = setInterval(() => {
      stageIdx = Math.min(stageIdx + 1, STAGES.length - 1);
      setStage(STAGES[stageIdx]);
    }, 3500);

    try {
      const data = await analyzeCompany(company);
      clearInterval(stageInterval);
      setStage('Analysis complete!');
      setResult(data);
      setStatus('success');
    } catch (err) {
      clearInterval(stageInterval);
      setError(err.message);
      setStatus('error');
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setStage('');
    setResult(null);
    setError(null);
  }, []);

  return { status, stage, result, error, analyze, reset };
}
