import React from 'react';

const ProgressBar = ({ current, total }) => {
  const percentage = (current / total) * 100;

  return (
    <div style={{ 
      width: '100%', 
      height: '8px', 
      background: 'rgba(255, 255, 255, 0.05)', 
      border: '1px solid var(--border)',
      borderRadius: '6px', 
      overflow: 'hidden',
      boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.2)'
    }}>
      <div 
        style={{ 
          width: `${percentage}%`, 
          height: '100%', 
          background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-tertiary))',
          transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 0 18px rgba(125, 211, 252, 0.35)'
        }} 
      />
    </div>
  );
};

export default ProgressBar;
