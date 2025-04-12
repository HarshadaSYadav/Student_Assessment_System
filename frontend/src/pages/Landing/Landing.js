import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

const LandingPage = () => {
  // State to control visibility of the signup options
  const [showOptions, setShowOptions] = useState(false);

  const handleGetStartedClick = () => {
    setShowOptions(!showOptions); // Toggle the visibility
  };

  return (
    <div className="landing-page">
      <header className="header">
        <h1 className="header-title">Student Assessment Report System</h1>
        <p className="header-subtitle">Empowering students and educators with AI-driven performance insights</p>

        {/* Get Started Button */}
        <Link to="#" className="cta-button" onClick={handleGetStartedClick}>
          Get Started
        </Link>
      </header>

      {/* Conditionally render the signup buttons */}
      {showOptions && (
        <section className="cta-buttons">
          <Link to="/student-welcome" className="cta-button">Student</Link> {/* Fixed path here */}
          <Link to="/signup/faculty" className="cta-button">Faculty</Link>
          <Link to="/signup/hod" className="cta-button">HOD</Link>
        </section>
      )}

      <section className="features">
        <h2 className="features-title">Key Features</h2>
        <div className="feature-cards">
          <div className="card">
            <h3>AI-Driven Analysis</h3>
            <p>Our advanced algorithms analyze grades, attendance, and participation to provide detailed performance insights.</p>
          </div>
          <div className="card">
            <h3>Automated Reports</h3>
            <p>Generate individual and class performance reports, complete with trends, comparisons, and study recommendations.</p>
          </div>
          <div className="card">
            <h3>Real-Time Visualizations</h3>
            <p>View student performance trends with interactive, easy-to-understand charts and graphs.</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2024 Student Assessment Report System. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
