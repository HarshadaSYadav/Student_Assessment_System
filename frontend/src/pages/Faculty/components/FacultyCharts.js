// src/pages/Faculty/components/FacultyCharts.js

import React from 'react';
import Chart from '../../../components/common/Chart';  // Update path  // Assuming the reusable Chart component is already built

const sampleData = [
  { name: 'Week 1', grade: 85 },
  { name: 'Week 2', grade: 87 },
  { name: 'Week 3', grade: 90 },
  { name: 'Week 4', grade: 82 },
  { name: 'Week 5', grade: 88 },
];

const FacultyCharts = () => {
  return (
    <div className="faculty-charts">
      <h2>Performance Over Time</h2>
      <Chart data={sampleData} xDataKey="name" yDataKey="grade" title="Weekly Performance" />
    </div>
  );
};

export default FacultyCharts;
