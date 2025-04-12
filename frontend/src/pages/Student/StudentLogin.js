import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentLogin.css';

const StudentLogin = () => {
  const [prnNumber, setPrnNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:5000/api/signin/student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prnNumber, password }),
      });
  
      if (!response.ok) {
        throw new Error('Invalid login credentials');
      }
  
      const data = await response.json();
      const student = data.student;
  
      // ✅ Store in localStorage for use in dashboard
      localStorage.setItem('studentPRN', student.prnNumber);
      localStorage.setItem('studentFullName', student.fullName);
  
      setError('');
      navigate('/Student');
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please check your PRN number and password.');
    }
  };
  
  return (
    <div className="login-container">
      <h2>Student Login</h2>
      {error && <p className="login-error">{error}</p>}
      <form onSubmit={handleLogin}>
        <div className="login-field">
          <label>PRN Number:</label>
          <input
            type="text"
            value={prnNumber}
            onChange={(e) => setPrnNumber(e.target.value)}
            required
          />
        </div>

        <div className="login-field">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Sign In</button>
      </form>
      <p>
        Don't have an account?{' '}
        <span
          className="signup-link"
          onClick={() => navigate('/signup/StudentSignup')}
          style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
        >
          Sign Up
        </span>
      </p>
    </div>
  );
};

export default StudentLogin;
