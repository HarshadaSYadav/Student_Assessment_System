// src/pages/RoleSelection/RoleSelection.js

import React from 'react';
import { Link } from 'react-router-dom';
import './RoleSelection.css';

const RoleSelection = () => {
  return (
    <div className="role-selection">
      <h2>Select Your Role</h2>
      <div className="role-buttons">
        <Link to="/signup/student" className="role-button">Student Sign In</Link>
        <Link to="/signup/faculty" className="role-button">Faculty Sign In</Link>
        <Link to="/signup/hod" className="role-button">HOD Sign In</Link>
      </div>
    </div>
  );
};

export default RoleSelection;
