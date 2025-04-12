import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentLogin';
import './StudentSignup.css';

const StudentSignup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    prnNumber: '',
    email: '',
    password: '',
    studentContact: '',
    parentContact: '',
    selectedClass: '',
    selectedSemester: '',
    selectedYear: '',
  });
  const [message, setMessage] = useState(''); // For success/error messages
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/signup/student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to sign up');
      }

      setMessage('Signup successful! Redirecting to login...');
      
      // Navigate immediately after successful signup
      navigate('/StudentLogin');
    } catch (error) {
      console.error('Signup error:', error);
      setMessage(error.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="signup-container">
      <h2>Student Signup</h2>
      {message && <p className="signup-message">{message}</p>} {/* Display message */}
      <form onSubmit={handleSignup}>
        {/* Form Fields */}
        <div className="signup-field">
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="signup-field">
          <label>Middle Name:</label>
          <input
            type="text"
            name="middleName"
            value={formData.middleName}
            onChange={handleChange}
          />
        </div>
        <div className="signup-field">
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="signup-field">
          <label>PRN Number:</label>
          <input
            type="text"
            name="prnNumber"
            value={formData.prnNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="signup-field">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="signup-field">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="signup-field">
          <label>Class:</label>
          <select
            name="selectedClass"
            value={formData.selectedClass}
            onChange={handleChange}
            required
          >
            <option value="">--Select Class--</option>
            <option value="SY">SY</option>
            <option value="TY">TY</option>
            <option value="BTech">BTech</option>
          </select>
        </div>
        <div className="signup-field">
          <label>Semester:</label>
          <select
            name="selectedSemester"
            value={formData.selectedSemester}
            onChange={handleChange}
            required
          >
            <option value="">--Select Semester--</option>
            <option value="III">III</option>
            <option value="IV">IV</option>
            <option value="VI">VI</option>
            <option value="VII">VII</option>
            <option value="VIII">VIII</option>
          </select>
        </div>
        <div className="signup-field">
          <label>Year:</label>
          <select
            name="selectedYear"
            value={formData.selectedYear}
            onChange={handleChange}
            required
          >
            <option value="">--Select Year--</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>
        </div>
        <div className="signup-field">
          <label>Student Contact Number:</label>
          <input
            type="text"
            name="studentContact"
            value={formData.studentContact}
            onChange={handleChange}
            required
          />
        </div>
        <div className="signup-field">
          <label>Parent Contact Number:</label>
          <input
            type="text"
            name="parentContact"
            value={formData.parentContact}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account?{' '}
        <a href="/StudentLogin" onClick={() => navigate('/StudentLogin')}>
          Login
        </a>
      </p>
    </div>
  );
};

export default StudentSignup;
