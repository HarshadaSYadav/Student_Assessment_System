import React, { useState, useEffect } from 'react';
import axios from 'axios';

function HODDashboard() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchAllStudents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/hod/students');
        setStudents(response.data); // All students' data
      } catch (error) {
        console.error('Error fetching students data:', error);
      }
    };

    fetchAllStudents();
  }, []);

  return (
    <div>
      <h2>All Students' Details</h2>
      <table>
        <thead>
          <tr>
            <th>PRN</th>
            <th>Name</th>
            <th>Marks</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.prnNumber}>
              <td>{student.prnNumber}</td>
              <td>{student.name}</td>
              <td>
                {student.marks ? (
                  student.marks.map((subject, index) => (
                    <p key={index}>{subject.name}: {subject.marks}</p>
                  ))
                ) : (
                  <span>No marks uploaded yet</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HODDashboard;
