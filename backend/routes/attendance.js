// routes/attendance.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const AttendanceFile = require('../models/AttendanceFile');
const router = express.Router();

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files to 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  },
});

const upload = multer({ storage });

// Route to upload the file
router.post('/upload', upload.single('attendanceFile'), async (req, res) => {
  const { year, semester, batch } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const newFile = new AttendanceFile({
      year,
      semester,
      batch,
      fileName: req.file.originalname,
      filePath: req.file.path,
    });
    await newFile.save();
    res.status(200).json({ message: 'File uploaded successfully', file: newFile });
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload file', error });
  }
});

// Route to fetch uploaded files based on year, semester, and batch
router.get('/files', async (req, res) => {
  const { year, semester, batch } = req.query;

  try {
    const files = await AttendanceFile.find({ year, semester, batch });
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch files', error });
  }
});

module.exports = router;
