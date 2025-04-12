// src/pages/Login/Login.js

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Login.css';


const Login = ({ onLogin }) => {
  const [role, setRole] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role');
    if (roleParam) {
      setRole(roleParam);
    }
  }, [location]);

  const handleLoginClick = () => {
    if (role) {
      onLogin(role);
      navigate(`/${role}`);
    } else {
      alert('Please select a role.');
    }
  };

  return (
    <div className="login-page">
      <h2>Login as {role.charAt(0).toUpperCase() + role.slice(1)}</h2>
      <button onClick={handleLoginClick}>Login</button>
    </div>
  );
};

export default Login;
