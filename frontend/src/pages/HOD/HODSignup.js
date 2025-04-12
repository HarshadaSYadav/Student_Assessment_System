// src/pages/Signup/HODSignup.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HODSignup.css';

const HODSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleAuth = (e) => {
    e.preventDefault();
    const action = isLogin ? 'Logging in' : 'Signing up';
    console.log(`${action} HOD with Name: ${name}, Email: ${email}`);
    
    if (isLogin) {
      navigate('/hod');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="signup-container">
      <h2>{isLogin ? 'HOD Login' : 'HOD Signup'}</h2>
      <form onSubmit={handleAuth}>
        {!isLogin && (
          <div className="signup-field">
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}
        <div className="signup-field">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="signup-field">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
      </form>
      <p onClick={() => setIsLogin(!isLogin)} className="toggle-auth">
        {isLogin ? 'New here? Sign up' : 'Already have an account? Login'}
      </p>
    </div>
  );
};

export default HODSignup;
