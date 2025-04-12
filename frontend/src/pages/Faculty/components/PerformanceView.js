import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { useLocation } from 'react-router-dom';
import { Chart as ChartJS } from 'chart.js/auto';
import './PerformanceView.css'; // Ensure styles are applied

function PerformanceView() {
  const location = useLocation();
  const studentData = location.state ? location.state.excelData : null; // Safely handle missing data

  const [chartData, setChartData] = useState(null);
  const [totalPercentage, setTotalPercentage] = useState(null);

  // Added check for empty or null studentData
  useEffect(() => {
    if (studentData && studentData.length > 0) {
      // Filter out invalid rows (header or undefined entries)
      const validStudentData = studentData.filter(student => 
        student.studentName && student.studentName !== ' Student Name' && student.marks && student.marks.length > 0
      );

      console.log('Filtered Student Data:', validStudentData); // Log filtered data

      if (validStudentData.length === 0) {
        console.log('No valid student data available');
        return;
      }

      const marks = validStudentData.map(student => student.marks); // Get marks for all students
      const subjects = validStudentData[0]?.marks ? Object.keys(validStudentData[0].marks) : []; // Get subjects dynamically
      console.log('Subjects:', subjects); // Log to ensure subjects are being identified

      // Calculating percentage for each student
      let totalMarks = 0;
      let maxMarks = 0;

      // Collect marks for pie chart
      const subjectMarks = new Array(subjects.length).fill(0); // Array to store total marks per subject
      validStudentData.forEach(student => {
        if (student.marks) {
          student.marks.forEach((mark, index) => {
            subjectMarks[index] += mark;
            totalMarks += mark;
            maxMarks += 20; // Assuming max marks per subject is 20
          });
        }
      });

      // Calculating the overall percentage for all students
      const overallPercentage = (totalMarks / maxMarks) * 100;
      setTotalPercentage(overallPercentage.toFixed(2));

      // Pie chart data setup (marks per subject)
      const colors = subjects.map(() => `#${Math.floor(Math.random() * 16777215).toString(16)}`); // Random colors for pie chart segments

      // Set chart data
      setChartData({
        labels: subjects, // Subject names as labels for Pie chart
        datasets: [{
          data: subjectMarks,
          backgroundColor: colors, // Random colors for chart segments
        }],
      });
    } else {
      console.log('No valid student data or marks available');
    }
  }, [studentData]);

  return (
    <div className="performance-view">
      <h3>Performance of Students</h3>

      {/* Show Pie chart if chartData is available */}
      {chartData ? (
        <div className="performance-chart">
          <Pie data={chartData} options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              tooltip: {
                enabled: true,
              },
            },
          }} height={200} width={200} />
          <p>Overall Performance: {totalPercentage}%</p>
        </div>
      ) : (
        <p>No data available to display performance.</p>
      )}

      {/* Table to display student marks */}
      <div>
        <h4>Marks Details</h4>
        <table className="performance-table">
          <thead>
            <tr>
              <th>Student Name</th>
              {studentData && studentData[0]?.marks && studentData[0].marks.map((_, index) => (
                <th key={index}>Subject {index + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {studentData && studentData.length > 0 ? (
              studentData.filter(student => student.studentName && student.studentName !== ' Student Name' && student.marks && student.marks.length > 0).map((student, studentIndex) => (
                <tr key={studentIndex}>
                  <td>{student.studentName}</td>
                  {student.marks ? (
                    student.marks.map((mark, index) => (
                      <td key={index}>{mark}</td>
                    ))
                  ) : (
                    <td>No marks available</td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No valid student data available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PerformanceView;
