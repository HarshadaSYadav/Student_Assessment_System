import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './marks.css';

const MarksDetails = () => {
  const navigate = useNavigate();

  const [marks, setMarks] = useState([]);
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [subjects, setSubjects] = useState([]);

  // Define the subjects for each year and semester
  const subjectData = {
    '2nd Year': {
      'Semester III': [
        { code: 'MATH3', name: 'Engineering Mathematics –III', maxMarks: 100 },
        { code: 'DS', name: 'Data Structures', maxMarks: 100 },
        { code: 'CAO', name: 'Computer Architecture & Organization', maxMarks: 100 },
        { code: 'OOP', name: 'Object Oriented Programming in Java', maxMarks: 100 },
        { code: 'DSLab', name: 'Data Structures Lab', maxMarks: 50 },
        { code: 'OOPLab', name: 'Object Oriented Programming Lab', maxMarks: 50 },
        { code: 'SemI', name: 'Seminar – I', maxMarks: 50 },
      ],
      'Semester IV': [
        { code: 'DAA', name: 'Design & Analysis of Algorithms', maxMarks: 100 },
        { code: 'OS', name: 'Operating Systems', maxMarks: 100 },
        { code: 'BHR', name: 'Basic Human Rights', maxMarks: 100 },
        { code: 'PTRP', name: 'Probability Theory and Random Processes', maxMarks: 100 },
        { code: 'DLDMP', name: 'Digital Logic Design & Microprocessors', maxMarks: 100 },
        { code: 'OSLab', name: 'Operating Systems & Python Programming Lab', maxMarks: 50 },
        { code: 'SemII', name: 'Seminar – II', maxMarks: 50 },
      ],
    },
    '3rd Year': {
      'Semester V': [
        { code: 'DBMS', name: 'Database Systems', maxMarks: 100 },
        { code: 'TOC', name: 'Theory of Computation', maxMarks: 100 },
        { code: 'SE', name: 'Software Engineering', maxMarks: 100 },
        { code: 'NM', name: 'Numerical Methods', maxMarks: 100 },
        { code: 'BC', name: 'Business Communication', maxMarks: 100 },
        { code: 'DBMSSEL', name: 'Database Systems & Software Engineering Lab', maxMarks: 50 },
        { code: 'MiniI', name: 'Mini-project – I', maxMarks: 50 },
      ],
      'Semester VI': [
        { code: 'CD', name: 'Compiler Design', maxMarks: 100 },
        { code: 'CN', name: 'Computer Networks', maxMarks: 100 },
        { code: 'ML', name: 'Machine Learning', maxMarks: 100 },
        { code: 'IoT', name: 'Internet of Things', maxMarks: 100 },
        { code: 'CB', name: 'Consumer Behaviour', maxMarks: 100 },
        { code: 'CPMLLab', name: 'Competitive Programming & Machine Learning Lab', maxMarks: 50 },
        { code: 'MiniII', name: 'Mini-project – II', maxMarks: 50 },
      ],
    },
    '4th Year': {
      'Semester VII': [
        { code: 'AI', name: 'Artificial Intelligence', maxMarks: 100 },
      ],
      'Semester VIII': [
        { code: 'ProjectInHouse', name: 'Project phase – II (In-house) /Internship and Project in Industry', maxMarks: 100 },
        { code: 'CC', name: 'Cloud Computing', maxMarks: 100 },
        { code: 'DS', name: 'Distributed System', maxMarks: 100 },
        { code: 'CNS', name: 'Cryptography and Network Security', maxMarks: 100 },
        { code: 'DT', name: 'Design Thinking', maxMarks: 100 },
        { code: 'AICCLab', name: 'Artificial Intelligence & Cloud Computing Lab', maxMarks: 50 },
        { code: 'ProjectI', name: 'Project Phase – I', maxMarks: 50 },
      ],
    },
  };

  // Handle input change for marks
  const handleMarksChange = (index, value) => {
    const updatedMarks = [...marks];
    updatedMarks[index] = { ...updatedMarks[index], marks: value };
    setMarks(updatedMarks);
  };

  // Handle file upload change
  const handleFileChange = (e) => {
    setUploadedFile(e.target.files[0]);
  };

  useEffect(() => {
    if (year && semester) {
      const selectedSubjects = subjectData[year][semester];
      setSubjects(selectedSubjects);
      setMarks(new Array(selectedSubjects.length).fill({ subject: '', marks: '' }));
    }
  }, [year, semester]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('file', uploadedFile);
    formData.append('marks', JSON.stringify(marks));
    formData.append('year', year);
    formData.append('semester', semester);

    try {
      // Posting data to the backend
      const response = await axios.post('http://localhost:5000/api/student/MarksheetModel', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      // Navigate to performance chart page with marks data
      navigate('/student/performance-chart', { state: { marksData: marks } });
    } catch (err) {
      console.error('Error submitting marks details:', err);
      alert('Error uploading marks details.');
    }
  };

  return (
    <div className="marks-details-container">
      <h2>Enter Your Marks Details</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Academic Year:</label>
          <select value={year} onChange={(e) => setYear(e.target.value)} required>
            <option value="">Select Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>
        </div>

        <div className="form-group">
          <label>Semester:</label>
          <select value={semester} onChange={(e) => setSemester(e.target.value)} required>
            <option value="">Select Semester</option>
            {year === '2nd Year' && (
              <>
                <option value="Semester III">Semester III</option>
                <option value="Semester IV">Semester IV</option>
              </>
            )}
            {year === '3rd Year' && (
              <>
                <option value="Semester V">Semester V</option>
                <option value="Semester VI">Semester VI</option>
              </>
            )}
            {year === '4th Year' && (
              <>
                <option value="Semester VII">Semester VII</option>
                <option value="Semester VIII">Semester VIII</option>
              </>
            )}
          </select>
        </div>

        <div className="marks-table">
          <table>
            <thead>
              <tr>
                <th>Subject Code</th>
                <th>Subject Name</th>
                <th>Enter Marks</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject, index) => (
                <tr key={index}>
                  <td>{subject.code}</td>
                  <td>{subject.name}</td>
                  <td>
                    <input
                      type="number"
                      value={marks[index]?.marks || ''}
                      onChange={(e) => handleMarksChange(index, e.target.value)}
                      max={subject.maxMarks}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="form-group">
          <label>Upload Marksheet PDF:</label>
          <input type="file" onChange={handleFileChange} accept="application/pdf" required />
        </div>

        <button type="submit">Submit Marks Details</button>
      </form>
    </div>
  );
};

export default MarksDetails;
