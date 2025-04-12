import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // React Router for navigation
import './Studentwelcome.css';
import './StudentLogin'; // Ensure you are importing the correct login component if needed

function StudentWelcomepage() {
  const navigate = useNavigate(); // Hook for navigation

  const handleSignUp = () => {
    navigate('/StudentSignup'); // Correct path to the Sign Up page
  };

  const handleSignIn = () => {
    navigate('/StudentLogin'); // Fixed path to the Sign In page (corrected "sigin" to "signin")
  };

  return (
    <div className="StudentWelcomepage" style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Welcome to Student Portal</h1>
      <p>Please select an option to proceed:</p>
      <div className="buttons">
        <Button variant="primary" onClick={handleSignUp} style={{ marginRight: '10px' }}>
          Sign Up
        </Button>
        <Button variant="secondary" onClick={handleSignIn}>
          Sign In
        </Button>
      </div>
    </div>
  );
}

export default StudentWelcomepage;
