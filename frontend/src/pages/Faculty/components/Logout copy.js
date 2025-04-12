import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear localStorage or any authentication data
    localStorage.clear();

    // Redirect to login or home page
    navigate('/login');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h1>Are you sure you want to log out?</h1>
      <button
        onClick={handleLogout}
        style={{
          padding: '10px 20px',
          backgroundColor: '#ff5e57',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '10px',
        }}
      >
        Log Out
      </button>
    </div>
  );
};

export default Logout;
