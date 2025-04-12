// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-logo">
        <h1>Student Assessment System</h1>
      </div>
      <nav className="header-nav">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/hod-dashboard">HOD Dashboard</Link></li>
          <li><Link to="/faculty-dashboard">Faculty Dashboard</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
