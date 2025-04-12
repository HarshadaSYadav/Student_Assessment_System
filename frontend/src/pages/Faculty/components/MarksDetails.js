import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Chart } from 'react-chartjs-2';
import './MarksDetails.css';

function MarksDetails() {
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
  const [sentNotifications, setSentNotifications] = useState([]);
  const [topperList, setTopperList] = useState(null);

  // Fetch uploaded files from localStorage
  const fetchUploadedFiles = () => {
    if (!year || !semester) {
      setMessage('Please select both year and semester to view saved files.');
      return;
    }
    const yearData = JSON.parse(localStorage.getItem(year) || '{}');
    const filesForSemester = yearData[semester] || [];
    setUploadedFiles(filesForSemester);
    setMessage(
      filesForSemester.length === 0
        ? 'No files found for the selected year and semester.'
        : ''
    );
  };

  // Handle file upload
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
  };

  // Save file to localStorage
  const saveFile = () => {
    if (!file || !year || !semester) {
      setMessage('Please select a file, year, and semester before saving.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64File = e.target.result;
      const yearData = JSON.parse(localStorage.getItem(year) || '{}');
      const updatedData = {
        ...yearData,
        [semester]: [
          ...(yearData[semester] || []),
          { name: file.name, data: base64File },
        ],
      };
      localStorage.setItem(year, JSON.stringify(updatedData));
      setMessage(`File "${file.name}" saved successfully.`);
      setFile(null);
      fetchUploadedFiles();
    };
    reader.readAsDataURL(file);
  };

  /**
   * Parses the Excel file with a custom structure.
   */
  const previewSavedFile = (file) => {
    try {
      const workbook = XLSX.read(file.data.split(',')[1], { type: 'base64' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      if (!jsonData || jsonData.length === 0) {
        setMessage('Sheet is empty or invalid.');
        return;
      }

      // Find the "Subjects" row (e.g., first cell contains "Subjects")
      const subjectsRowIndex = jsonData.findIndex(
        (row) =>
          row &&
          row[0] &&
          row[0].toString().toLowerCase().includes('subjects')
      );

      // Extract subject names (starting from column index 1)
      let subjects = [];
      if (subjectsRowIndex !== -1) {
        subjects = jsonData[subjectsRowIndex]
          .slice(1)
          .filter((cell) => cell && cell.toString().trim());
      }

      // Find the header row containing "PRN. NO"
      const headerRowIndex = jsonData.findIndex(
        (row) =>
          row &&
          row[0] &&
          row[0].toString().toLowerCase().includes('prn')
      );
      if (headerRowIndex === -1) {
        setMessage('Could not find a row with "PRN. NO".');
        return;
      }

      // Everything after the header row is student data
      const dataRows = jsonData.slice(headerRowIndex + 1);
      const studentData = dataRows.filter((row) => {
        if (!row || row.length < 4) return false;
        const firstCell = row[0] && row[0].toString().trim();
        return firstCell && !isNaN(parseFloat(firstCell));
      });

      if (studentData.length === 0) {
        setMessage('No valid student data found in file.');
        return;
      }

      // Build custom headers: "PRN. NO", "Roll No.", "Student Name", then subjects
      const customHeaders = ['PRN. NO', 'Roll No.', 'Student Name', ...subjects];

      // Convert each row to an array: first 3 cells plus marks for each subject
      const parsedData = studentData.map((row) => {
        const marks = row.slice(3, 3 + subjects.length).map((m) => parseFloat(m) || 0);
        return [
          row[0], // PRN
          row[1], // Roll No.
          row[2], // Student Name
          ...marks, // Subject marks
        ];
      });

      setExcelHeaders(customHeaders);
      setExcelPreviewData(parsedData);
      setExpandedRow(null);
      setMessage(`Loaded ${parsedData.length} student records.`);
    } catch (error) {
      setMessage('Error parsing file: ' + error.message);
    }
  };
// Upload file to backend server
const uploadFileToBackend = async () => {
  if (!file || !year || !semester || !batch) {
    alert('Please select batch, year, semester and a file before uploading.');
    return;
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('year', year);
  formData.append('semester', semester);
  formData.append('batch', batch);

  try {
    const response = await fetch('http://localhost:5000/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const result = await response.json();
      alert(`File uploaded successfully: ${result.filePath}`);
    } else {
      const err = await response.json();
      alert(`Upload failed: ${err.message}`);
    }
  } catch (error) {
    console.error('Upload error:', error);
    alert('Error uploading file.');
  }
};

  const deleteFile = (fileName) => {
    if (!year || !semester) {
      setMessage('Please select a year and semester to delete files.');
      return;
    }
    const yearData = JSON.parse(localStorage.getItem(year) || '{}');
    const updatedFiles = (yearData[semester] || []).filter((file) => file.name !== fileName);
    yearData[semester] = updatedFiles;
    localStorage.setItem(year, JSON.stringify(yearData));
    setMessage(`File "${fileName}" deleted successfully.`);
    fetchUploadedFiles();
  };

  const toggleChart = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  // Render pie chart for subject-wise marks
  const renderChart = (studentRow) => {
    // studentRow: [PRN, Roll No., Student Name, mark1, mark2, …]
    const studentName = studentRow[2];
    const subjects = excelHeaders.slice(3);
    const marks = studentRow.slice(3).map((m) => (isNaN(m) ? 0 : Number(m)));

    const totalMarks = marks.reduce((acc, curr) => acc + curr, 0);
    const maxMarks = 20 * marks.length;
    const overallPercentage = (totalMarks / maxMarks) * 100;

    // Prepare chart data so that each slice represents raw marks per subject.
    const data = {
      labels: subjects,
      datasets: [
        {
          label: 'Marks Obtained',
          data: marks,
          backgroundColor: subjects.map(
            () => `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`
          ),
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: {
          display: true,
          text: `${studentName}'s Subject-wise Marks`,
          font: { size: 16 },
        },
        tooltip: {
          callbacks: {
            label: (tooltipItem) => {
              const mark = tooltipItem.raw;
              const perc = ((mark / 20) * 100).toFixed(1);
              return `${tooltipItem.label}: ${mark} marks (${perc}%)`;
            },
          },
        },
      },
    };

    return (
      <div className="chart-container">
        <Chart type="pie" data={data} options={options} />
        <p>Overall Percentage: {overallPercentage.toFixed(1)}%</p>
      </div>
    );
  };

  // Calculate overall marks percentage for a student (for topper calculation)
  const calculateStudentMarksPercentage = (row) => {
    const totalSubjects = excelHeaders.length - 3;
    const marks = row.slice(3, 3 + totalSubjects).map((m) => parseFloat(m) || 0);
    const totalObtained = marks.reduce((acc, curr) => acc + curr, 0);
    const maxTotal = totalSubjects * 20;
    return (totalObtained / maxTotal) * 100;
  };

  // Updated getTopperList: Automatically select the top 3 scoring students based solely on achieved marks.
  const getTopperList = () => {
    if (!excelPreviewData.length) return null;
    const toppers = excelPreviewData.map((row) => {
      const percentage = calculateStudentMarksPercentage(row);
      return {
        prnNumber: row[0],
        studentName: row[2],
        percentage,
      };
    });
    const sorted = toppers.sort((a, b) => b.percentage - a.percentage);
    const topper1 = sorted.length >= 1 ? [sorted[0]] : [];
    const topper2 = sorted.length >= 2 ? [sorted[1]] : [];
    const topper3 = sorted.length >= 3 ? [sorted[2]] : [];
    return { topper1, topper2, topper3 };
  };

  // Automatically compute and update topper list when excelPreviewData or selection changes.
  // (This stores the computed toppers in localStorage for retrieval by the Leaderboard component.)
  useEffect(() => {
    if (excelPreviewData.length && batch && year && semester) {
      const computedTopperList = getTopperList();
      setTopperList(computedTopperList);
  
      const topperKey = `topperList_${batch}_${year}_Sem${semester}`;
      localStorage.setItem(topperKey, JSON.stringify(computedTopperList));
    }
  }, [excelPreviewData, batch, year, semester]);
  

  // Save student data to backend and store topper list in localStorage for the Leaderboard page.
  const saveStudentDataToBackend = async () => {
    if (!excelPreviewData.length) {
      alert('No data to save.');
      return;
    }
    try {
      const results = await Promise.all(
        excelPreviewData.map(async (row) => {
          if (!row || row.length < 3) {
            console.warn('Skipping row due to insufficient data:', row);
            return null;
          }
          const prnNumber = row[0] ? String(row[0]).trim() : '';
          const rollNo = row[1] ? String(row[1]).trim() : '';
          const studentName = row[2] ? String(row[2]).trim() : '';
          if (!prnNumber || !rollNo || !studentName) {
            console.warn('Skipping row due to missing fields:', row);
            return null;
          }
          const subjects = excelHeaders.slice(3);
          const marks = row.slice(3, 3 + subjects.length).map(
            (mark) => (isNaN(mark) ? 0 : Number(mark))
          );
          const studentData = {
            prnNumber,
            rollNo,
            studentName,
            subjects,
            marks,
            year,
            semester,
            batch,
          };
          console.log(`Saving data for PRN ${prnNumber}:`, studentData);
          try {
            const response = await fetch('http://localhost:5000/api/marks', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(studentData),
            });
            console.log(`Response for PRN ${prnNumber}:`, response);
            if (!response.ok) {
              const errorData = await response.json();
              console.error(`Server error for PRN ${prnNumber}:`, errorData);
              throw new Error(errorData.message || 'Failed to save student data');
            }
            console.log(`Successfully saved data for PRN ${prnNumber}`);
            return { success: true, prn: prnNumber };
          } catch (error) {
            console.error(`Error saving PRN ${prnNumber}:`, error);
            return { success: false, prn: prnNumber, error: error.message };
          }
        })
      );
      const successfulSaves = results.filter((r) => r && r.success);
      const failedSaves = results.filter((r) => r && !r.success);
      if (failedSaves.length > 0) {
        alert(
          `Saved ${successfulSaves.length} records successfully.\n` +
            `Failed to save ${failedSaves.length} records:\n` +
            failedSaves.map((f) => `PRN ${f.prn}: ${f.error}`).join('\n')
        );
      } else {
        alert(`All ${successfulSaves.length} records saved successfully!`);
      }
    } catch (error) {
      console.error('General error:', error);
      alert('Error saving data: ' + error.message);
    }
  };

  // Send notifications to parents.
  const sendMarksNotificationToAll = () => {
    if (!attendanceMessage.trim()) {
      alert('Please enter a message to send.');
      return;
    }
    const notifications = excelPreviewData.map((row) => ({
      data: excelHeaders.reduce((obj, header, idx) => ({
        ...obj,
        [header]: row[idx],
      }), {}),
      message: attendanceMessage,
      year,
      semester,
      batch,
      sentAt: new Date().toLocaleString(),
    }));
    const existing = JSON.parse(localStorage.getItem('marksNotifications') || '[]');
    const updated = [...existing, ...notifications];
    localStorage.setItem('marksNotifications', JSON.stringify(updated));
    alert('Notifications sent successfully!');
  };

  return (
    <div className="marks-details">
      <h1>Upload Marks</h1>
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
          <option value="VIII">VIII</option>
        </select>

        <label>Upload Excel File:</label>
        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />

        <div className="buttons">
          <button onClick={saveFile} disabled={!file || !year || !semester}>
            Save File
          </button>
          <button onClick={fetchUploadedFiles}>View Saved Files</button>

          <button onClick={uploadFileToBackend} disabled={!file || !year || !semester || !batch}>
             Save to Backend
          </button>

        </div>
      </div>

      {message && <p className="message">{message}</p>}

      {/* Uploaded Files Table */}
      {uploadedFiles.length > 0 && (
        <div className="uploaded-files">
          <h2>Saved Files for Year: {year}, Semester: {semester}</h2>
          <table>
            <thead>
              <tr>
                <th>File Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {uploadedFiles.map((file, index) => (
                <tr key={index}>
                  <td>{file.name}</td>
                  <td>
                    <button onClick={() => previewSavedFile(file)}>Preview</button>
                    <button onClick={() => deleteFile(file.name)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Student Data Table */}
      {excelPreviewData.length > 0 && (
        <div className="excel-preview">
          <h2>Student Data ({excelPreviewData.length} students)</h2>
          <table className="student-table">
            <thead>
              <tr>
                {excelHeaders.map((header, i) => (
                  <th key={i}>{header}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {excelPreviewData.map((row, index) => (
                row[0] ? (
                  <React.Fragment key={`${row[0]}-${index}`}>
                    <tr>
                      {row.map((cell, i) => (
                        <td key={i}>{cell}</td>
                      ))}
                      <td>
                        <button
                          onClick={() => toggleChart(index)}
                          className="performance-btn"
                        >
                          {expandedRow === index ? 'Hide Chart' : 'View Chart'}
                        </button>
                      </td>
                    </tr>
                    {expandedRow === index && (
                      <tr className="chart-row">
                        <td colSpan={excelHeaders.length + 1}>
                          {renderChart(row)}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ) : null
              ))}
            </tbody>
          </table>

          <div className="save-backend-btn">
            <button onClick={saveStudentDataToBackend}>
              Save Student Data to Backend
            </button>
          </div>
        </div>
      )}

      <div className="notification-section">
        <h2>Send Marks Notifications</h2>
        <textarea
          value={attendanceMessage}
          onChange={(e) => setAttendanceMessage(e.target.value)}
          placeholder="Enter notification message..."
          rows="4"
        />
        <button onClick={sendMarksNotificationToAll}>
          Send to All Students
        </button>
      </div>
    </div>
  );
}

export default MarksDetails;
