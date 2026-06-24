import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface FeatureImportance {
  name: string;
  importance: number;
}

const FeatureImportanceChart: React.FC = () => {
  const [data, setData] = useState<FeatureImportance[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImportances = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/feature-importance`);
        if (!response.ok) {
          throw new Error('Failed to fetch feature importances');
        }
        const json = await response.json();
        
        // Convert dict to array, sort descending, take top 5
        const importances: FeatureImportance[] = Object.keys(json).map(key => ({
          name: key,
          importance: json[key]
        }));
        importances.sort((a, b) => b.importance - a.importance);
        
        setData(importances.slice(0, 5));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    fetchImportances();
  }, []);

  if (error) {
    return null; // Gracefully degrade by hiding the chart if data cannot be loaded
  }

  if (data.length === 0) {
    return <div style={{ fontSize: '0.9rem', color: 'var(--text-hint)' }}>Loading chart...</div>;
  }

  return (
    <div style={{ width: '100%', height: 250, marginTop: '2rem' }}>
      <h4 style={{ color: 'var(--text-heading)', marginBottom: '1rem', textAlign: 'left', fontSize: '1.1rem' }}>Top 5 Driving Factors</h4>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
          <XAxis type="number" hide />
          <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-hint)', fontSize: 12 }} width={80} />
          <Tooltip 
            formatter={(value: number) => value.toFixed(4)}
            contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}
          />
          <Bar dataKey="importance" fill="var(--primary)" radius={[0, 4, 4, 0]} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FeatureImportanceChart;
