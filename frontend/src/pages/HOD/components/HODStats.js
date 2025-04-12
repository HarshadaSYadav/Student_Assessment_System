// src/pages/HOD/components/HODStats.js

import React from 'react';
import './HODStats.css';

const HODStats = () => {
  return (
    <div className="hod-stats">
      <div className="stat-card">
        <h2>500</h2>
        <p>Total Students</p>
      </div>
      <div className="stat-card">
        <h2>50</h2>
        <p>Total Classes</p>
      </div>
      <div className="stat-card">
        <h2>82%</h2>
        <p>Overall Average Grade</p>
      </div>
    </div>
  );
};

export default HODStats;
