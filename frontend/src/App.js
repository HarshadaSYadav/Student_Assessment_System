import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/Landing/Landing';
import StudentWelcomepage from './pages/Student/StudentWelcomepage';
import StudentSignup from './pages/Student/StudentSignup';
import FacultySignup from './pages/Faculty/FacultySignup';
import HODSignup from './pages/HOD/HODSignup';
import StudentDashboard from './pages/Student/StudentDashboard';
import FacultyDashboard from './pages/Faculty/FacultyDashboard';
import HODDashboard from './pages/HOD/HODDashboard';
import StudentLogin from './pages/Student/StudentLogin';
import './pages/Landing/Landing.css';
import './pages/Student/Studentwelcome.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/student-welcome" element={<StudentWelcomepage />} />
        <Route path="/StudentSignup" element={<StudentSignup />} />
        <Route path="/signup/faculty" element={<FacultySignup />} />
        <Route path="/signup/hod" element={<HODSignup />} />
        <Route path="/student" element={<StudentDashboard />} />
        {/* Fixed the route to just /Faculty */}
        <Route path="/Faculty/*" element={<FacultyDashboard />} /> 
        <Route path="/StudentLogin" element={<StudentLogin />} />
        <Route path="/hod" element={<HODDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
