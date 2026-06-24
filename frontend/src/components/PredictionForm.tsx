import React, { useState, useEffect } from 'react';
import MapPickerModal from './MapPickerModal';

export interface PredictionData {
  MedInc: number | '';
  HouseAge: number | '';
  AveRooms: number | '';
  AveBedrms: number | '';
  Population: number | '';
  AveOccup: number | '';
  Latitude: number | '';
  Longitude: number | '';
}

interface PredictionFormProps {
  onSubmit: (data: PredictionData) => void;
  isLoading: boolean;
}

const DEFAULT_DATA: PredictionData = {
  MedInc: 3.87,
  HouseAge: 29,
  AveRooms: 5.43,
  AveBedrms: 1.10,
  Population: 1425,
  AveOccup: 3.07,
  Latitude: 35.63,
  Longitude: -119.57
};

const RANGES = {
  MedInc: { min: 0.5, max: 15.0, step: 0.1, label: 'Neighborhood Income', hint: 'Median income in $10k (e.g. 8.3 = $83,000)' },
  HouseAge: { min: 1, max: 52, step: 1, label: 'Neighborhood Home Age', hint: 'Median age of homes in the block' },
  AveRooms: { min: 1.0, max: 20.0, step: 0.1, label: 'Avg. Rooms per Home', hint: 'Average total rooms per home' },
  AveBedrms: { min: 0.5, max: 10.0, step: 0.1, label: 'Avg. Bedrooms per Home', hint: 'Average bedrooms per home' },
  Population: { min: 10, max: 5000, step: 10, label: 'Block Population', hint: 'Total residents in the block' },
  AveOccup: { min: 1.0, max: 10.0, step: 0.1, label: 'Avg. Household Size', hint: 'Average people living in each home' },
  Latitude: { min: 32.0, max: 42.0, step: 0.01, label: 'Latitude (Location)', hint: 'North-South GPS coordinate' },
  Longitude: { min: -125.0, max: -114.0, step: 0.01, label: 'Longitude (Location)', hint: 'East-West GPS coordinate' }
};

const PredictionForm: React.FC<PredictionFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<PredictionData>(DEFAULT_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isMapOpen, setIsMapOpen] = useState(false);

  const validateField = (name: keyof PredictionData, value: number | '') => {
    if (value === '') return 'Value is required';
    const range = RANGES[name];
    if (value < range.min || value > range.max) {
      return `Must be between ${range.min} and ${range.max}`;
    }
    return '';
  };

  const handleInputChange = (name: keyof PredictionData, valueStr: string) => {
    if (valueStr === '') {
      setFormData(prev => ({ ...prev, [name]: '' }));
      setErrors(prev => ({ ...prev, [name]: 'Value is required' }));
      return;
    }
    const value = parseFloat(valueStr);
    
    // We update the state even if it's NaN temporarily to allow typing
    setFormData(prev => ({ ...prev, [name]: isNaN(value) ? '' : value }));
    
    if (!isNaN(value)) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleReset = () => {
    setFormData(DEFAULT_DATA);
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    let isValid = true;
    (Object.keys(formData) as Array<keyof PredictionData>).forEach(key => {
      const err = validateField(key, formData[key]);
      if (err) {
        newErrors[key] = err;
        isValid = false;
      }
    });
    setErrors(newErrors);
    
    if (isValid) {
      // Cast the form data as strict numbers since we validated it
      onSubmit(formData as Record<keyof PredictionData, number>);
    }
  };

  const hasErrors = Object.values(errors).some(err => err !== '');

  const renderField = (key: keyof PredictionData) => {
    const range = RANGES[key];
    const value = formData[key];
    const error = errors[key];

    return (
      <div key={key} style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label htmlFor={`input-${key}`} style={{ fontWeight: 600, color: 'var(--text-heading)' }}>{range.label}</label>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input 
            type="range" 
            min={range.min} 
            max={range.max} 
            step={range.step} 
            value={value} 
            onChange={(e) => handleInputChange(key, e.target.value)}
            style={{ flex: 1, accentColor: 'var(--primary)' }}
          />
          <input 
            id={`input-${key}`}
            type="number"
            min={range.min} 
            max={range.max} 
            step="any"
            value={value}
            onChange={(e) => handleInputChange(key, e.target.value)}
            style={{
              width: '90px',
              padding: '0.5rem',
              borderRadius: '6px',
              border: `1px solid ${error ? 'var(--error)' : 'var(--border)'}`,
              fontSize: '1rem'
            }}
          />
        </div>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-hint)' }}>{range.hint}</span>
        {error && <span style={{ fontSize: '0.85rem', color: 'var(--error)' }}>{error}</span>}
      </div>
    );
  };

  return (
    <div className="card" style={{ 
      maxWidth: '900px', 
      margin: '0 auto', 
      position: 'relative', 
      zIndex: 10, 
      marginTop: '-80px',
      padding: '2rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, color: 'var(--text-heading)', fontSize: '1.5rem' }}>Property & Neighborhood Data</h2>
        <button 
          type="button" 
          onClick={handleReset}
          style={{
            background: 'transparent',
            color: 'var(--text-hint)',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            padding: '6px 12px',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          Reset to Defaults
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '1rem 2rem' 
        }}>
          {renderField('MedInc')}
          {renderField('HouseAge')}
          {renderField('AveRooms')}
          {renderField('AveBedrms')}
          {renderField('Population')}
          {renderField('AveOccup')}
          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', marginTop: '1rem', marginBottom: '-1rem' }}>
             <button 
                type="button"
                onClick={() => setIsMapOpen(true)}
                style={{
                  background: 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 20px',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow)'
                }}
             >
               📍 Pick Location on Map
             </button>
          </div>
          {renderField('Latitude')}
          {renderField('Longitude')}
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button 
            type="submit" 
            disabled={isLoading || hasErrors}
            style={{
              background: 'var(--accent)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '1rem 3rem',
              fontSize: '1.1rem',
              fontWeight: 600,
              cursor: (isLoading || hasErrors) ? 'not-allowed' : 'pointer',
              opacity: (isLoading || hasErrors) ? 0.7 : 1,
              transition: 'background 0.2s',
              boxShadow: '0 4px 6px -1px rgba(245, 158, 11, 0.4)'
            }}
          >
            {isLoading ? <span className="loader"></span> : 'Calculate Estimate'}
          </button>
        </div>
      </form>

      {isMapOpen && (
        <MapPickerModal 
          initialLat={Number(formData.Latitude) || 35.63} 
          initialLng={Number(formData.Longitude) || -119.57}
          onClose={() => setIsMapOpen(false)}
          onConfirm={(lat, lng) => {
            handleInputChange('Latitude', lat.toFixed(2));
            handleInputChange('Longitude', lng.toFixed(2));
            setIsMapOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default PredictionForm;
