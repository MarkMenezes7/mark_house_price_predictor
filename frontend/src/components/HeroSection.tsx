import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '50vh',
      minHeight: '400px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      background: 'linear-gradient(to bottom, #f8f6f2 0%, #e8f0fe 100%)'
    }}>
      {/* Background Images Layer */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        opacity: 0.15, // Subtle blending into the sky blue / warm white gradient
        zIndex: 1
      }}>
        <div style={{
          width: '50%',
          height: '100%',
          backgroundImage: "url('/home1.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }} />
        <div style={{
          width: '50%',
          height: '100%',
          backgroundImage: "url('/home2.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }} />
      </div>

      {/* Subtle white-to-transparent gradient from bottom up */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(to top, var(--bg-page) 0%, transparent 40%)',
        zIndex: 2
      }} />

      {/* Content Layer */}
      <div style={{
        position: 'relative',
        zIndex: 3,
        padding: '0 2rem',
        marginTop: '-50px' // Shift up to balance the overlap of the form card
      }}>
        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: 800,
          color: 'var(--text-heading)',
          marginBottom: '1rem',
          letterSpacing: '-1px'
        }}>
          California House Predictor
        </h1>
        <p style={{
          fontSize: '1.25rem',
          fontWeight: 400,
          color: 'var(--text-hint)',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          AI-Powered Real Estate Valuation Model
        </p>
      </div>
    </div>
  );
};

export default HeroSection;
