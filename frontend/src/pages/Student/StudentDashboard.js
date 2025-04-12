import React, { useState, useEffect } from 'react';
import MarksDetails from './MarksDetails';
import Leaderboard from '../Faculty/components/Leaderboard';
import './marks.css';
import welcomeImage from './icon.webp';
import marksIcon from './img1.png';

function StudentDashboard() {
  const [studentPRN, setStudentPRN] = useState(() => localStorage.getItem('studentPRN') || '0000000000');
  const [studentName, setStudentName] = useState(() => localStorage.getItem('studentFullName') || 'Student');
  const [step, setStep] = useState(1); // 1: Dashboard, 2: MarksDetails, 3: Leaderboard
  const [marksData, setMarksData] = useState(null);

  const handleSaveMarks = (marks) => {
    setMarksData(marks);
    alert('Marks saved successfully!');
  };

  const handleBackToDashboard = () => setStep(1);

  const handleLogout = () => {
    localStorage.removeItem('studentPRN');
    localStorage.removeItem('studentFullName');
    window.location.href = '/logout';
  };

  return (
    <div className="student-dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Student Dashboard</h2>
        </div>
        <div className="sidebar-menu">
          <button
            className={`sidebar-button ${step === 1 ? 'active' : ''}`}
            onClick={() => setStep(1)}
          >
            <img src={marksIcon} alt="Dashboard Icon" className="button-icon" />
            Dashboard
          </button>

          <button
            className={`sidebar-button ${step === 3 ? 'active' : ''}`}
            onClick={() => setStep(3)}
          >
            🏆 Leaderboard
          </button>

          <button
            className="sidebar-button logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Right: Student Info */}
        <div
          className="student-info-banner"
          style={{ textAlign: 'right', padding: '10px 20px', fontWeight: 'bold' }}
        >
          👋 Welcome, {studentName} (PRN: {studentPRN})
        </div>

        {/* Step: Dashboard */}
        {step === 1 && (
          <div className="dashboard-welcome">
            <img src={welcomeImage} alt="Welcome" className="welcome-image" />
            <h1>Welcome to Your Academic Dashboard</h1>
            <p>
              Track your academic performance, view your marks, and see your progress over time.
            </p>
            <button className="view-marks-button" onClick={() => setStep(2)}>
              View Marks Details
            </button>
          </div>
        )}

        {/* Step: Marks Details */}
        {step === 2 && (
          <MarksDetails
            onSave={handleSaveMarks}
            onBack={handleBackToDashboard}
          />
        )}

        {/* Step: Leaderboard */}
        {step === 3 && (
          <div className="leaderboard-section">
            <Leaderboard />
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;
