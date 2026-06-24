import React from 'react';
import FeatureImportanceChart from './FeatureImportanceChart';

interface ResultCardProps {
  prediction: number;
}

const ResultCard: React.FC<ResultCardProps> = ({ prediction }) => {
  // prediction is already in full dollars from the backend
  const baseValue = prediction;
  const lowerBound = baseValue * 0.85;
  const upperBound = baseValue * 1.15;

  const formatMoney = (val: number) => {
    return '$' + val.toLocaleString(undefined, { maximumFractionDigits: 0 });
  };

  return (
    <div className="card" style={{
      maxWidth: '900px',
      margin: '2rem auto',
      padding: '2rem',
      textAlign: 'center',
      animation: 'slideUp 0.5s ease forwards'
    }}>
      <h3 style={{ color: 'var(--text-heading)', margin: '0 0 1rem 0', fontSize: '1.5rem' }}>Estimated Market Value</h3>
      
      <p style={{ 
        fontSize: '3.5rem', 
        fontWeight: 800, 
        color: 'var(--primary)', 
        margin: '0 0 0.5rem 0' 
      }}>
        {formatMoney(baseValue)}
      </p>
      
      <p style={{ 
        fontSize: '1.1rem', 
        color: 'var(--text-body)', 
        margin: '0 0 2rem 0',
        fontWeight: 500
      }}>
        Estimated Range: <span style={{ color: 'var(--accent)' }}>{formatMoney(lowerBound)} to {formatMoney(upperBound)}</span>
      </p>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
        <FeatureImportanceChart />
      </div>

      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        background: '#fef3c7',
        border: '1px solid #fde68a',
        borderRadius: '8px',
        color: '#92400e',
        fontSize: '0.85rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem'
      }}>
        <span>⚠️</span>
        <span>Prediction based on 1990 California census data. Use for educational purposes only.</span>
      </div>
    </div>
  );
};

export default ResultCard;
