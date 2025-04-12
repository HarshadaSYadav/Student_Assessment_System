// models/AttendanceFile.js
const mongoose = require('mongoose');

const attendanceFileSchema = new mongoose.Schema({
  year: { type: String, required: true },
  semester: { type: String, required: true },
  batch: { type: String, required: true },
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
});

const AttendanceFile = mongoose.model('AttendanceFile', attendanceFileSchema);
module.exports = AttendanceFile;
