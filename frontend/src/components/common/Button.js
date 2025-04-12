// src/components/common/Button.js
import React from 'react';
import './Button.css';

const Button = ({ label, onClick, type = 'primary', disabled = false }) => {
  return (
    <button 
      className={`btn btn-${type}`} 
      onClick={onClick} 
      disabled={disabled}>
      {label}
    </button>
  );
};

export default Button;
