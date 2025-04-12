import React, { useEffect, useState } from 'react';
import './Notifications.css';

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');
  const [batch, setBatch] = useState('');

  // Load notifications on mount
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('marksNotifications') || '[]');
    setNotifications(stored);
  }, []);

  const handleFilterChange = (e, setter) => {
    setter(e.target.value);
  };

  const fetchFilteredNotifications = () => {
    const stored = JSON.parse(localStorage.getItem('marksNotifications') || '[]');
    const filtered = stored.filter((notification) => {
      return (
        (semester ? notification.semester === semester : true) &&
        (year ? notification.year === year : true) &&
        (batch ? notification.batch === batch : true)
      );
    });
    setNotifications(filtered);
  };

  const deleteOldNotifications = () => {
    const stored = JSON.parse(localStorage.getItem('marksNotifications') || '[]');
    const current = stored.filter(notification =>
      notification.year === year && notification.semester === semester
    );
    localStorage.setItem('marksNotifications', JSON.stringify(current));
    setNotifications(current);
    alert('Old notifications have been deleted, only current ones are kept.');
  };

  return (
    <div className="notification-container">
      <h1>📢 Sent Marks Notifications</h1>

      <div className="filters">
        <label>
          Year:
          <select value={year} onChange={(e) => handleFilterChange(e, setYear)}>
            <option value="">Select Year</option>
            <option value="SY">SY</option>
            <option value="TY">TY</option>
            <option value="BTech">BTech</option>
          </select>
        </label>

        <label>
          Batch:
          <select value={batch} onChange={(e) => handleFilterChange(e, setBatch)}>
            <option value="">Select Batch</option>
            <option value="2023-2024">2023-2024</option>
            <option value="2024-2025">2024-2025</option>
          </select>
        </label>

        <label>
          Semester:
          <select value={semester} onChange={(e) => handleFilterChange(e, setSemester)}>
            <option value="">Select Semester</option>
            <option value="III">III</option>
            <option value="IV">IV</option>
            <option value="V">V</option>
            <option value="VI">VI</option>
            <option value="VII">VII</option>
            <option value="VIII">VIII</option>
          </select>
        </label>

        <button onClick={fetchFilteredNotifications}>🔍 Fetch</button>
        <button onClick={deleteOldNotifications}>🗑️ Delete Old</button>
      </div>

      <div className="notifications-table">
        {notifications.length > 0 ? (
          <table border="1">
            <thead>
              <tr>
                <th>PRN No.</th>
                <th>Name</th>
                <th>Marks</th>
                <th>Message</th>
                <th>Sent At</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((notif, index) => (
                <tr key={index}>
                  <td>{notif.data?.['PRN. NO'] || '-'}</td>
                  <td>{notif.data?.['Student Name'] || '-'}</td>
                  <td>
                    {Object.keys(notif.data || {})
                      .filter((k) => !['PRN. NO', 'Roll No.', 'Student Name'].includes(k))
                      .map((subject, i) => (
                        <span key={i}>
                          {subject}: {notif.data[subject]}{i < Object.keys(notif.data).length - 1 ? ', ' : ''}
                        </span>
                      ))}
                  </td>
                  <td>{notif.message}</td>
                  <td>{notif.sentAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No notifications found for the selected filters.</p>
        )}
      </div>
    </div>
  );
}

export default Notification;
