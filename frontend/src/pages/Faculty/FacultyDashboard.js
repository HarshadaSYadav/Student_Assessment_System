import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import StudentsDetails from '../Faculty/components/StudentsDetails';
import MarksDetails from '../Faculty/components/MarksDetails';
import AttendanceDetails from '../Faculty/components/AttendanceDetails';
import Attendancenotification from '../Faculty/components/Attendancenotification';
import Notifications from '../Faculty/components/Notifications';
import Leaderboard from '../Faculty/components/Leaderboard';
import Logout from '../Faculty/components/Logout'; // ✅ Import Logout
import '../Faculty/components/FacultyDashboard.css';

const FacultyDashboard = () => {
  const [studentData, setStudentData] = useState([]);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 768) {
        setIsSidebarVisible(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const closeSidebar = (e) => {
    if (windowWidth <= 768 && !e.target.closest('.sidebar')) {
      setIsSidebarVisible(false);
    }
  };

  return (
    <div className="dashboard-container" onClick={closeSidebar}>
      {/* Sidebar */}
      <nav className={`sidebar ${isSidebarVisible ? 'visible' : ''}`}>
        <h3>Faculty Dashboard</h3>
        <ul>
          <li><Link to="/Faculty/StudentDetails">Student Details</Link></li>
          <li><Link to="/Faculty/MarksDetails">Marks Details</Link></li>
          <li><Link to="/Faculty/Notifications">Notifications</Link></li>
          <li><Link to="/Faculty/AttendanceDetails">Attendance Details</Link></li>
          <li><Link to="/Faculty/Attendancenotification">Attendance Notification</Link></li>
          <li><Link to="/Faculty/Leaderboard">Leaderboard</Link></li>
          <li><Link to="/Faculty/Logout">Logout</Link></li> {/* ✅ Add Logout link */}
        </ul>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        <button
          className="sidebar-toggle"
          onClick={toggleSidebar}
          aria-label="Toggle navigation"
        >
          ☰ Menu
        </button>

        <Routes>
          <Route path="/StudentDetails" element={<StudentsDetails />} />
          <Route
            path="/MarksDetails"
            element={<MarksDetails onUploadComplete={setStudentData} />}
          />
          <Route
            path="/Notifications"
            element={<Notifications data={studentData} />}
          />
          <Route
            path="/AttendanceDetails"
            element={<AttendanceDetails onUploadComplete={setStudentData} />}
          />
          <Route
            path="/Attendancenotification"
            element={<Attendancenotification data={studentData} />}
          />
          <Route
            path="/Leaderboard"
            element={<Leaderboard data={studentData} />}
          />
          <Route path="/Logout" element={<Logout />} /> {/* ✅ Add route for Logout */}
          <Route
            path="*"
            element={<div className="default-message">Select an option from the sidebar.</div>}
          />
        </Routes>
      </div>
    </div>
  );
};

export default FacultyDashboard;
