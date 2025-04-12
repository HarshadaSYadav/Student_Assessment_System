import React from 'react';
import { useLocation } from 'react-router-dom';
import { Table, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function PreviewMarks() {
  const location = useLocation();
  const { marksData } = location.state || {}; // Retrieve the marksData passed via state

  if (!marksData || marksData.length === 0) {
    return <div>No data to display</div>;
  }

  return (
    <div className="preview-marks">
      <h1>Preview Marks Data</h1>

      <Table striped bordered hover>
        <thead>
          <tr>
            {marksData[0] && marksData[0].map((header, idx) => (
              <th key={idx}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {marksData.slice(1).map((row, idx) => (
            <tr key={idx}>
              {row.map((cell, cellIdx) => (
                <td key={cellIdx}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default PreviewMarks;
