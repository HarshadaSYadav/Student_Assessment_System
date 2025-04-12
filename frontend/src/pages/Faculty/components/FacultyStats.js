// src/pages/Faculty/components/FacultyStats.js

import React from 'react';
import './FacultyStats.css';

const FacultyStats = () => {
  return (
    <div className="faculty-stats">
      <div className="stat-card">
        <h2>120</h2>
        <p>Students</p>
      </div>
      <div className="stat-card">
        <h2>10</h2>
        <p>Classes</p>
      </div>
      <div className="stat-card">
        <h2>85%</h2>
        <p>Average Grade</p>
      </div>
    </div>
  );
};

export default FacultyStats;
