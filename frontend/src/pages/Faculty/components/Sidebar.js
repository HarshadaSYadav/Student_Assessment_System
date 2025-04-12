import React from 'react';
import { NavLink } from 'react-router-dom';
import '../Faculty/components/Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Faculty Dashboard</h2>
      <nav>
        <NavLink to="/Faculty/StudentDetails" className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>
          StudentsDetails
        </NavLink>
        <NavLink to="/Faculty/MarksDetails" className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>
          MarksDetails
        </NavLink>
        <NavLink to="/Faculty/PerformanceView" className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>
          PerformanceView
        </NavLink>
        <NavLink to="/Faculty/AttendanceDetails" className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>
          AttendanceDetails
        </NavLink>
        <NavLink to="/Faculty/Notifications" className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>
          Notifications
        </NavLink>
        <NavLink to="/Faculty/Leaderboard" className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>
          Leaderboard
        </NavLink>
        <NavLink to="/Faculty/Logout" className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>
          Logout
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
