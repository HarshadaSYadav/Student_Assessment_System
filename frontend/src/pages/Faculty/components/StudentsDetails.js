import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './StudentDetails.css';

function StudentDetails({ goBack }) {
  const [students, setStudents] = useState([]);
  const [searchPRN, setSearchPRN] = useState('');
   const [prnNumber, setPrnNumber] = useState('');
  const [filteredStudent, setFilteredStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeStudent, setActiveStudent] = useState(null);
 

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/signup/student');
        setStudents(response.data);
        setError('');
      } catch (err) {
        console.error('Error fetching students:', err);
        setError('Failed to fetch students');
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const handleSearch = async () => {
    if (!searchPRN) {
      setFilteredStudent(null);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/signup/student/${searchPRN}`);
      setFilteredStudent(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching student by PRN:', err);
      setFilteredStudent(null);
      setError('Student not found');
    } finally {
      setLoading(false);
    }
  };

  const handleShowAll = () => {
    setFilteredStudent(null);
    setSearchPRN('');
    setError('');
  };

  

  const handleCloseDetails = () => {
    
    setActiveStudent(null);
    
  };

  return (
    <div className="student-details">
      <h1>Student Details</h1>

      <div className="search-container">
        <input
          type="text"
          placeholder="Enter PRN to search"
          value={searchPRN}
          onChange={(e) => setSearchPRN(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {filteredStudent ? (
        <div>
          <h2>Search Result</h2>
          <table className="student-table">
            <thead>
              <tr>
                <th>PRN</th>
                <th>Name</th>
                <th>Email</th>
                <th>Branch</th>
                <th>Year</th>
                <th>Semester</th>
                <th>Student Contact</th>
                <th>Parent Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr key={filteredStudent.prnNumber}>
                <td>{filteredStudent.prnNumber}</td>
                <td>{filteredStudent.fullName}</td>
                <td>{filteredStudent.email}</td>
                <td>{filteredStudent.branchName}</td>
                <td>{filteredStudent.studyingYear}</td>
                <td>{filteredStudent.semester}</td>
                <td>{filteredStudent.studentContact}</td>
                <td>{filteredStudent.parentContact || 'N/A'}</td>
                <td>
                  
                  
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          <h2>All Students</h2>
          <table className="student-table">
            <thead>
              <tr>
                <th>PRN</th>
                <th>Name</th>
                <th>Email</th>
                <th>Branch</th>
                <th>Year</th>
                <th>Semester</th>
                <th>Student Contact</th>
                <th>Parent Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.prnNumber}>
                  <td>{student.prnNumber}</td>
                  <td>{student.fullName}</td>
                  <td>{student.email}</td>
                  <td>{student.branchName}</td>
                  <td>{student.studyingYear}</td>
                  <td>{student.semester}</td>
                  <td>{student.studentContact}</td>
                  <td>{student.parentContact || 'N/A'}</td>
                  <td>
                   
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      

      <div className="footer-buttons">
        {filteredStudent && (
          <button className="show-all-button" onClick={handleShowAll}>
            Show All Students
          </button>
        )}
        <button className="back-button" onClick={goBack}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default StudentDetails;
