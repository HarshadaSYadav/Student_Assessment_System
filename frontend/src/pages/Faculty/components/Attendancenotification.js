import React, { useState, useEffect } from 'react';
import './AttendanceNotification.css';
function AttendanceNotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');
  const [batch, setBatch] = useState('');

  // Fetch notifications from localStorage
  useEffect(() => {
    const storedNotifications = JSON.parse(localStorage.getItem('attendanceNotifications') || '[]');
    console.log('Fetched notifications:', storedNotifications);
    setNotifications(storedNotifications);
  }, []);

  // Filter notifications based on selected criteria
  const filteredNotifications = notifications.filter((notification) => {
    return (
      (year ? notification.year === year : true) &&
      (semester ? notification.semester === semester : true) &&
      (batch ? notification.batch === batch : true)
    );
  });

  // Delete all notifications and update localStorage
  const deleteNotifications = () => {
    // Clear notifications from localStorage
    localStorage.removeItem('attendanceNotifications');

    // Update the notifications state to empty array
    setNotifications([]);

    // Optionally, you can give feedback to the user
    alert('All notifications have been deleted.');
  };

  return (
    <div className="notification-page">
      <h2>Attendance Notifications</h2>

      {/* Filter Controls */}
      <div className="filters">
        <label>
          Year:
          <select value={year} onChange={(e) => setYear(e.target.value)}>
            
            <option value="FY">FY</option>
            <option value="SY">SY</option>
            <option value="TY">TY</option>
          </select>
        </label>
        <label>
          Semester:
          <select value={semester} onChange={(e) => setSemester(e.target.value)}>
            
            <option value="I">I</option>
            <option value="II">II</option>
            <option value="III">III</option>
            <option value="IV">IV</option>
            <option value="V">V</option>
            <option value="VI">VI</option>
          </select>
        </label>
        <label>
          Batch:
          <select value={batch} onChange={(e) => setBatch(e.target.value)}>
            <option value="">Select Batch</option>
            <option value="2023-2024">2023-2024</option>
            <option value="2024-2025">2024-2025</option>
          </select>
        </label>
      </div>

      {/* Delete Notifications Button */}
      <button onClick={deleteNotifications} className="delete-notification-button">
        Delete Notification
      </button>

      {/* Notifications Table */}
      <table className="notification-table">
        <thead>
          <tr>
            <th>PRN No</th>
            <th>Student Name</th>
            <th>Attended Lectures</th>
            <th>Message</th>
            <th>Sent At</th>
          </tr>
        </thead>
        <tbody>
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification, index) => (
              <tr key={index}>
                <td>{notification.prnNo}</td>
                <td>{notification.studentName}</td>
                <td>{notification.attendedLectures} Lectures</td>
                <td>{notification.message}</td>
                <td>{notification.sentAt}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No notifications found for the selected filters.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AttendanceNotificationPage;
