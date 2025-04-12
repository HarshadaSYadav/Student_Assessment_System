import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Pie } from 'react-chartjs-2';
import './AttendanceDetails.css';

ChartJS.register(ArcElement, Tooltip, Legend, Title, ChartDataLabels);

function AttendanceDetails() {
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');
  const [batch, setBatch] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [excelPreviewData, setExcelPreviewData] = useState([]);
  const [excelHeaders, setExcelHeaders] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [attendanceMessage, setAttendanceMessage] = useState('');

  const ATTENDANCE_DETAILS_KEY_PREFIX = 'AttendanceDetails';

  const fetchUploadedFiles = () => {
    if (!year || !semester) {
      setMessage('Please select both year and semester to view saved files.');
      return;
    }
    const key = `${ATTENDANCE_DETAILS_KEY_PREFIX}-${year}`;
    const yearData = JSON.parse(localStorage.getItem(key) || '{}');
    const filesForSemester = yearData[semester] || [];
    setUploadedFiles(filesForSemester);
    setMessage(filesForSemester.length === 0 ? 'No files found for the selected year and semester.' : '');
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
  };

  const saveFile = () => {
    if (!file || !year || !semester) {
      setMessage('Please select a file, year, and semester before saving.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64File = e.target.result;
      const key = `${ATTENDANCE_DETAILS_KEY_PREFIX}-${year}`;
      const yearData = JSON.parse(localStorage.getItem(key) || '{}');
      const updatedData = {
        ...yearData,
        [semester]: [...(yearData[semester] || []), { name: file.name, data: base64File }],
      };
      localStorage.setItem(key, JSON.stringify(updatedData));
      setMessage(`File "${file.name}" saved successfully.`);
      setFile(null);
      fetchUploadedFiles();
    };
    reader.readAsDataURL(file);
  };

  const previewSavedFile = (file) => {
    const workbook = XLSX.read(file.data.split(',')[1], { type: 'base64' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    if (jsonData.length > 0) {
      setExcelHeaders(jsonData[0]);
      setExcelPreviewData(jsonData.slice(1));
      setExpandedRow(null); // Reset any expanded chart view on new preview
    }
  };

  const toggleChart = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  // Updated renderChart: uses the AVG column value (assumed index 11) as the present value
  const renderChart = (rowData, rowIndex) => {
    const avgRaw = rowData[12] || "0";
const presentValue = parseFloat(avgRaw.toString().replace('%', '')) || 0;
const absentValue = 100 - presentValue;


// Debug log to verify values
console.log(`Row ${rowIndex} - PRN: ${rowData[0]}, Present: ${presentValue}, Absent: ${absentValue}`);

    return (
      <div className="chart-view-container">
        <button onClick={() => setExpandedRow(null)} className="back-button">
          ← Back
        </button>
        <div className="simple-chart">
          <Pie
            data={{
              labels: ['Present', 'Absent'],
              datasets: [{
                data: [presentValue, absentValue],
                backgroundColor: ['#4CAF50', '#F44336'],
              }]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    font: {
                      size: 14
                    }
                  }
                },
                title: {
                  display: true,
                  text: `Attendance Summary - ${rowData[2]}`,
                  font: {
                    size: 18,
                    weight: 'bold'
                  }
                },
                datalabels: {
                  formatter: (value) => `${value.toFixed(1)}%`,
                  color: '#fff',
                  font: {
                    weight: 'bold',
                    size: 14
                  }
                }
              }
            }}
          />
        </div>
      </div>
    );
  };

  const saveStudentDataToBackend = async () => {
    if (!excelPreviewData.length) {
      alert('No data to save.');
      return;
    }
  
    const validRows = excelPreviewData.filter(row => row[0]);
    const subjects = ['AI', 'CC', 'CNS', 'DS', 'DT'];
    const totalLecturesPerSubject = { AI: 8, CC: 11, CNS: 10, DS: 10, DT: 16 };
  
    const promises = validRows.map(async (row) => {
      const attendance = subjects.map((subject, index) => ({
        subjectName: subject,
        totalLectures: totalLecturesPerSubject[subject],
        attendedLectures: Number(row[index + 3]) || 0,
      }));
  
      // ✅ Extract average percentage from the AVG column (e.g., column 12)
      const avgRaw = row[12] || "0";
      const averagePercentage = parseFloat(avgRaw.toString().replace('%', '')) || 0;
  
      const studentData = {
        prnNumber: row[0],
        semester,
        attendance,
        averagePercentage,
      };
  
      try {
        const response = await fetch('http://localhost:5000/api/attendance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(studentData),
        });
  
        if (!response.ok) {
          throw new Error(`Failed to save data for PRN ${studentData.prnNumber}`);
        }
  
        console.log(`Data saved for PRN: ${studentData.prnNumber}`);
      } catch (error) {
        console.error(error);
      }
    });
  
    await Promise.all(promises);
    alert('All valid data has been saved successfully!');
  };
  
  
  const sendAttendanceNotificationToAll = () => {
    if (!attendanceMessage.trim()) {
      alert('Please enter a message to send.');
      return;
    }

    const notifications = excelPreviewData.map((row) => ({
      data: excelHeaders.reduce((obj, header, idx) => ({
        ...obj,
        [header]: row[idx]
      }), {}),
      message: attendanceMessage,
      year,
      semester,
      batch,
      sentAt: new Date().toLocaleString(),
    }));

    const existing = JSON.parse(localStorage.getItem('attendanceNotifications') || '[]');
    const updated = [...existing, ...notifications];
    localStorage.setItem('attendanceNotifications', JSON.stringify(updated));
    alert('Notifications sent successfully!');
  };

  return (
    <div className="attendance-details">
      <h1>Upload Attendance</h1>
      <div className="form-container">
        <label>Year:</label>
        <select value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="">Select Year</option>
          <option value="SY">SY</option>
          <option value="TY">TY</option>
          <option value="BTech">BTech</option>
        </select>

        <label>Batch:</label>
        <select value={batch} onChange={(e) => setBatch(e.target.value)}>
          <option value="">Select Batch</option>
          <option value="2023-2024">2023-2024</option>
          <option value="2024-2025">2024-2025</option>
        </select>

        <label>Semester:</label>
        <select value={semester} onChange={(e) => setSemester(e.target.value)}>
          <option value="">Select Semester</option>
          <option value="III">III</option>
          <option value="IV">IV</option>
          <option value="V">V</option>
          <option value="VI">VI</option>
          <option value="VII">VII</option>
        </select>

        <label>Upload Excel File:</label>
        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />

        <div className="buttons">
          <button onClick={saveFile}>Save File</button>
          <button onClick={fetchUploadedFiles}>View Saved Files</button>
        </div>
      </div>

      {message && <p className="message">{message}</p>}

      {uploadedFiles.length > 0 && (
        <div className="uploaded-files">
          <h2>Saved Files</h2>
          <ul>
            {uploadedFiles.map((file, index) => (
              <li key={index}>
                {file.name}
                <button onClick={() => previewSavedFile(file)}>Preview</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {excelPreviewData.length > 0 && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                {excelHeaders.map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {excelPreviewData.map((row, index) => (
                row[0] ? (
                  <React.Fragment key={index}>
                    <tr>
                      {row.map((cell, idx) => <td key={idx}>{cell}</td>)}
                      <td>
                        <button onClick={() => toggleChart(index)}>
                          {expandedRow === index ? 'Hide Chart' : 'Show Chart'}
                        </button>
                      </td>
                    </tr>
                    {expandedRow === index && (
                      <tr>
                        <td colSpan={excelHeaders.length + 1}>
                          {renderChart(row, index)}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ) : null
              ))}
            </tbody>
          </table>

          <div className="save-backend-btn">
            <button onClick={saveStudentDataToBackend}>Save Student Data to Backend</button>
          </div>
        </div>
      )}

      <div className="notification-section">
        <h2>Send Attendance Notifications</h2>
        <textarea
          value={attendanceMessage}
          onChange={(e) => setAttendanceMessage(e.target.value)}
          placeholder="Enter notification message..."
          rows="4"
        />
        <button onClick={sendAttendanceNotificationToAll}>
          Send to All Students
        </button>
      </div>
    </div>
  );
}

export default AttendanceDetails;
