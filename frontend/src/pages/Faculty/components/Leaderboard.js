import React, { useState, useEffect } from 'react';
import './Leaderboard.css';

const Leaderboard = () => {
  const [batch, setBatch] = useState('');
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');
  const [topperList, setTopperList] = useState({ topper1: [], topper2: [], topper3: [] });
  const [error, setError] = useState('');

  const loadTopperData = () => {
    const key = `topperList_${batch}_${year}_Sem${semester}`;
    const stored = localStorage.getItem(key);

    if (!stored) {
      setTopperList({ topper1: [], topper2: [], topper3: [] });
      setError('No topper data available for the selected filters.');
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      setTopperList({
        topper1: parsed.topper1 || [],
        topper2: parsed.topper2 || [],
        topper3: parsed.topper3 || [],
      });
      setError('');
    } catch (err) {
      console.error('Failed to parse topper data:', err);
      setError('Error parsing topper data.');
    }
  };

  useEffect(() => {
    loadTopperData();
  }, [batch, year, semester]);

  return (
    <div className="leaderboard-container">
      <h2>🏆 Student Leaderboard</h2>

      <div className="filters">
        <select value={batch} onChange={(e) => setBatch(e.target.value)}>
          <option value="">Select Batch</option>
          <option value="2023-2024">2023-2024</option>
          <option value="2024-2025">2024-2025</option>
        </select>

        <select value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="">Select Year</option>
          <option value="SY">SY</option>
          <option value="TY">TY</option>
          <option value="BTech">BTech</option>
        </select>

        <select value={semester} onChange={(e) => setSemester(e.target.value)}>
          <option value="">Select Semester</option>
          <option value="III">III</option>
          <option value="IV">IV</option>
          <option value="V">V</option>
          <option value="VI">VI</option>
          <option value="VII">VII</option>
          <option value="VIII">VIII</option>
        </select>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="toppers-display">
        <h3>Topper 1 🎖️</h3>
        {topperList.topper1.length > 0 ? (
          topperList.topper1.map((s, i) => (
            <p key={i}>{s.studentName} - {s.percentage.toFixed(2)}%</p>
          ))
        ) : (
          <p>No data</p>
        )}

        <h3>Topper 2 🥈</h3>
        {topperList.topper2.length > 0 ? (
          topperList.topper2.map((s, i) => (
            <p key={i}>{s.studentName} - {s.percentage.toFixed(2)}%</p>
          ))
        ) : (
          <p>No data</p>
        )}

        <h3>Topper 3 🥉</h3>
        {topperList.topper3.length > 0 ? (
          topperList.topper3.map((s, i) => (
            <p key={i}>{s.studentName} - {s.percentage.toFixed(2)}%</p>
          ))
        ) : (
          <p>No data</p>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
