import React, { useState } from 'react';
import HeroSection from './components/HeroSection';
import PredictionForm, { type PredictionData } from './components/PredictionForm';
import ResultCard from './components/ResultCard';

const App: React.FC = () => {
  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const handlePredict = async (data: PredictionData) => {
    setLoading(true);
    setGlobalError(null);
    setPrediction(null);

    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        let msg = 'Failed to get prediction from server';
        try {
          const errData = await response.json();
          msg = errData.detail || msg;
        } catch {
          // ignore parsing error
        }
        throw new Error(msg);
      }

      const result = await response.json();
      setPrediction(result.prediction);
    } catch (err) {
      setGlobalError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HeroSection />
      
      <main style={{ padding: '0 1rem', paddingBottom: '4rem' }}>
        <PredictionForm onSubmit={handlePredict} isLoading={loading} />

        {globalError && (
          <div style={{
            maxWidth: '900px',
            margin: '2rem auto',
            padding: '1rem',
            borderRadius: '8px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: 'var(--error)',
            textAlign: 'center'
          }}>
            {globalError}
          </div>
        )}

        {prediction !== null && !globalError && (
          <ResultCard prediction={prediction} />
        )}
      </main>
    </>
  );
};

export default App;
