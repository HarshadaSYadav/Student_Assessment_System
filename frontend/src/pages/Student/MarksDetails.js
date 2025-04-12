import React, { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import './marks.css';


ChartJS.register(ArcElement, Tooltip, Legend, Title, CategoryScale, LinearScale);

function Dashboard({ onSave, onBack }) {
  const [prnNumber, setPrnNumber] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('marks');

  const handleFetchData = async () => {
    if (!prnNumber.trim()) {
      setError('Please enter a valid PRN.');
      return;
    }

    setError(null);
    setStudentData(null);

    try {
      const [marksResponse, attendanceResponse] = await Promise.all([
        fetch(`http://localhost:5000/api/marks/${prnNumber}`),
        fetch(`http://localhost:5000/api/attendance/${prnNumber}`),
      ]);

      if (!marksResponse.ok) throw new Error('Failed to fetch marks data.');
      if (!attendanceResponse.ok) throw new Error('Failed to fetch attendance data.');

      const marksData = await marksResponse.json();
      const attendanceData = await attendanceResponse.json();

      setStudentData({ marksData, attendanceData });
    } catch (err) {
      setError(err.message);
    }
  };

  const getMarksChartData = () => {
    if (!studentData) return null;
    const labels = studentData.marksData.marksData.map((m) => m.subject);
    const data = studentData.marksData.marksData.map((m) => m.marks);

    return {
      labels,
      datasets: [
        {
          label: 'Marks Obtained',
          data,
          backgroundColor: [
            '#4CAF50', '#F44336', '#FFC107', '#2196F3', '#9C27B0',
          ],
          borderColor: '#ffffff',
          borderWidth: 2,
        },
      ],
    };
  };

  const getAttendanceChartData = () => {
    if (
      !studentData?.attendanceData?.attendanceData?.length
    ) return null;

    const attendanceRows = studentData.attendanceData.attendanceData.filter(
      (entry) => entry.subject !== 'Overall'
    );

    const labels = attendanceRows.map((e) => e.subject);
    const data = attendanceRows.map((e) => e.attendedLectures);

    return {
      labels,
      datasets: [
        {
          label: 'Attended Lectures',
          data,
          backgroundColor: ['#4CAF50', '#F44336', '#FFC107', '#2196F3', '#9C27B0'],
          borderColor: '#ffffff',
          borderWidth: 2,
        },
      ],
    };
  };

  const getOverallAttendanceData = () => {
    const overall = studentData?.attendanceData?.attendanceData?.find(
      (entry) => entry.subject === 'Overall'
    );
    const percentage = overall?.averagePercentage || 0;

    return {
      labels: ['Present', 'Absent'],
      datasets: [
        {
          label: 'Overall Attendance',
          data: [percentage, 100 - percentage],
          backgroundColor: ['#4CAF50', '#F44336'],
          borderColor: '#ffffff',
          borderWidth: 2,
        },
      ],
    };
  };

  const calculateMarksPercentage = () => {
    if (!studentData) return null;
    const totalMarks = studentData.marksData.marksData.reduce((acc, m) => acc + m.marks, 0);
    const maxMarks = studentData.marksData.marksData.length * 20;
    return ((totalMarks / maxMarks) * 100).toFixed(2);
  };

  const calculateAttendancePercentage = () => {
    const overall = studentData?.attendanceData?.attendanceData?.find(
      (entry) => entry.subject === 'Overall'
    );
    return overall?.averagePercentage?.toFixed(2) || '0.00';
  };

  return (
    <div className="dashboard">
      <h2>Student Dashboard</h2>

      <div className="input-section">
        <label>
          Enter PRN:
          <input
            type="text"
            value={prnNumber}
            onChange={(e) => setPrnNumber(e.target.value)}
            placeholder="Enter your PRN"
          />
        </label>
        <button onClick={handleFetchData}>Fetch Data</button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {studentData && (
        <div className="tabs">
          <button
            className={`tab-button ${activeTab === 'marks' ? 'active' : ''}`}
            onClick={() => setActiveTab('marks')}
          >
            Marks
          </button>
          <button
            className={`tab-button ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => setActiveTab('attendance')}
          >
            Attendance
          </button>
        </div>
      )}

      {studentData && activeTab === 'marks' && (
        <div className="details-section">
          <div className="details-card">
            <h3>Marks:</h3>
            <table>
              <thead>
                <tr><th>Subject</th><th>Marks</th></tr>
              </thead>
              <tbody>
                {studentData.marksData.marksData.map((mark, i) => (
                  <tr key={i}><td>{mark.subject}</td><td>{mark.marks}</td></tr>
                ))}
              </tbody>
            </table>

            <div className="chart-container">
              <h4>Performance Chart</h4>
              <Pie data={getMarksChartData()} />
            </div>

            <h4>Total Marks Percentage: {calculateMarksPercentage()}%</h4>
          </div>
        </div>
      )}

      {studentData && activeTab === 'attendance' && (
        <div className="details-section">
          <div className="details-card">
            <h3>Attendance:</h3>
            <table>
              <thead>
                <tr><th>Subject</th><th>Total Lectures</th><th>Attended Lectures</th></tr>
              </thead>
              <tbody>
                {studentData.attendanceData.attendanceData
                  .filter((entry) => entry.subject !== 'Overall')
                  .map((entry, i) => (
                    <tr key={i}>
                      <td>{entry.subject}</td>
                      <td>{entry.totalLectures}</td>
                      <td>{entry.attendedLectures}</td>
                    </tr>
                ))}
              </tbody>
            </table>

            <div className="chart-container">
              <h4>Subject-wise Attendance Chart:</h4>
              <Pie data={getAttendanceChartData()} />
            </div>

            <div className="chart-container">
              <h4>Overall Attendance:</h4>
              <Pie data={getOverallAttendanceData()} />
              <h4>Average Attendance: {calculateAttendancePercentage()}%</h4>
            </div>
          </div>
        </div>
      )}

      <div className="action-buttons">
        <button className="back-button" onClick={onBack}>Back to Dashboard</button>
      </div>
    </div>
  );
}

export default Dashboard;
