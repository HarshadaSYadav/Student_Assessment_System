import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FacultySignup.css';

const FacultySignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();

    const url = isLogin
      ? 'http://127.0.0.1:5000/api/login'
      : 'http://127.0.0.1:5000/api/register/faculty';
    const data = isLogin ? { email, password } : { name, email, password };

    try {
      const response = await axios.post(url, data);

      if (isLogin) {
        // Handle login response
        const { token, name } = response.data;
        console.log(`Logged in as ${name}`);
        localStorage.setItem('token', token); // Store token for authentication
        alert('Login successful');
        navigate('/faculty'); // Navigate to the faculty dashboard
      } else {
        // Handle signup response
        alert('Signup successful! Please log in.');
        setIsLogin(true); // Switch to login after successful signup
      }
    } catch (error) {
      // Display error message
      const message =
        error.response?.data?.message || 'An error occurred. Please try again.';
      console.error(message);
      alert(message);
    }
  };

  return (
    <div className="signup-container">
      <h2>{isLogin ? 'Faculty Login' : 'Faculty Signup'}</h2>
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

export default FacultySignup;
