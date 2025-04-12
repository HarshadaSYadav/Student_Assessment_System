// src/pages/HOD/components/HODCharts.js

import React from 'react';
import Chart from '../../../components/common/Chart';  // Assuming the reusable Chart component is already built

const sampleData = [
  { name: 'Semester 1', average: 80 },
  { name: 'Semester 2', average: 85 },
  { name: 'Semester 3', average: 78 },
  { name: 'Semester 4', average: 82 },
  { name: 'Semester 5', average: 88 },
];

const HODCharts = () => {
  return (
    <div className="hod-charts">
      <h2>Department Performance Trends</h2>
      <Chart data={sampleData} xDataKey="name" yDataKey="average" title="Average Grade by Semester" />
    </div>
  );
};

export default HODCharts;
