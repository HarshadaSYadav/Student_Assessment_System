const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const xlsx = require('xlsx');
const bodyParser = require('body-parser');
const fs = require('fs');
const topperRoutes = require('./routes/toppers');
const uploadRoute = require('./routes/upload');
dotenv.config();

// App and Middleware Setup
const app = express();
app.use(cors({
  origin: 'http://localhost:3000',  // Corrected the typo
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(bodyParser.json());

// Secret Key for JWT
const secretKey = process.env.JWT_SECRET || 'default_secret_key';

// MongoDB Connection
const mongoURI = 'mongodb://127.0.0.1:27017/facultyDashboard';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// Models
const Faculty = mongoose.model('Faculty', new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  files: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UploadedFile' }],
}));

const Student = mongoose.model('Students', new mongoose.Schema({
  prnNumber: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  studentContact: { type: String, required: true },
  parentContact: { type: String, required: false },
  branchName: { type: String, required: true },
  studyingYear: { type: String, required: true },
  semester: { type: String, required: true },
  password: { type: String, required: true },
  marksData: [{ subject: String, marks: Number }], // <-- updated field as an array
  attendanceData: [
    {
      subject: { type: String, required: true },
      totalLectures: { type: Number, required: true },
      attendedLectures: { type: Number, required: true },
      averagePercentage: { type: Number, required: false }, //
    }
  ]
}));




// Authentication Middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid Token' });
    }
    req.user = decoded;
    next();
  });
};

// Routes
// Faculty Registration
app.post('/api/register/faculty', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingFaculty = await Faculty.findOne({ email });
    if (existingFaculty) {
      return res.status(400).json({ message: 'Faculty already exists' });
    }

    const newFaculty = new Faculty({ name, email, password });
    await newFaculty.save();
    res.status(201).json({ message: 'Faculty registered successfully', faculty: newFaculty });
  } catch (error) {
    console.error('Faculty Registration Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Faculty Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const faculty = await Faculty.findOne({ email });
    if (!faculty || faculty.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: faculty._id }, secretKey, { expiresIn: '1h' });
    res.json({ token, name: faculty.name, files: faculty.files || [] });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// Fetch all students (GET endpoint)

// Student Sign-up (Updated)
app.post('/api/signup/student', async (req, res) => {
  const {
    firstName,
    middleName,
    lastName,
    prnNumber,
    email,
    password,
    studentContact,
    parentContact,
    selectedClass,
    selectedSemester,
    selectedYear
  } = req.body;

  try {
    // Check if the student already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ error: 'Student already exists' });
    }

    // Create a new student with all the fields
    const fullName = `${firstName} ${middleName ? middleName + ' ' : ''}${lastName}`;
    const newStudent = new Student({
      fullName,
      prnNumber,
      email,
      password,
      studentContact,
      parentContact,
      studyingYear: selectedYear,
      semester: selectedSemester,
      branchName: selectedClass,
    });

    // Save the student to the database
    await newStudent.save();

    res.status(201).json({ message: 'Signup successful', student: newStudent });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Fetch all students (GET endpoint)
app.get('/api/signup/student', async (req, res) => {
  try {
    const students = await Student.find();  // Retrieve all students
    res.json(students);  // Send the students data as a JSON response
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch a student by PRN (GET endpoint)
app.get('/api/signup/student/:prnNumber', async (req, res) => {
  const { prnNumber } = req.params;
  try {
    const student = await Student.findOne({ prnNumber });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);  // Send the student data as a JSON response
  } catch (error) {
    console.error('Error fetching student by PRN:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.post('/api/signin/student', async (req, res) => {
  const { prnNumber, password } = req.body;

  try {
    // Check if the student exists by their PRN number
    const student = await Student.findOne({ prnNumber });

    if (!student || student.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token for authentication if needed
    const token = jwt.sign({ id: student._id }, secretKey, { expiresIn: '1h' });

    // Respond with the student data and token
    res.status(200).json({
      message: 'Sign-in successful',
      token,
      student: {
        prnNumber: student.prnNumber,
        fullName: student.fullName,
        marksData: student.marksData, // Sending marksData directly to the frontend
      },
    });
  } catch (error) {
    console.error('Sign-in Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

const upload = multer({ dest: 'uploads/' });
// Endpoint to upload and process marks
// Save Marks Data
app.post('/api/marks', async (req, res) => {
  // Destructure subjects along with other fields from req.body
  const { prnNumber, rollNo, studentName, year, semester, batch, marks, subjects } = req.body;

  try {
    // Validate the request data
    if (!prnNumber || !marks || !marks.length) {
      return res.status(400).json({ message: 'Missing or invalid marks data' });
    }

    // Find the student by prnNumber
    const student = await Student.findOne({ prnNumber });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Create an array of marks objects using the provided subject names
    const marksData = marks.map((mark, index) => ({
      subject: subjects && subjects[index] ? subjects[index] : `Subject ${index + 1}`,
      marks: mark
    }));

    // Update the student's marksData field
    student.marksData = marksData;
    await student.save();

    res.status(201).json({ message: 'Marks data saved successfully', student });
  } catch (error) {
    console.error('Error saving marks data:', error);
    res.status(500).json({ message: 'Failed to save marks data' });
  }
});



// Fetch Marks Data by PRN
app.get('/api/marks/:prnNumber', async (req, res) => {
  const { prnNumber } = req.params;
  
  try {
    // Find the student by PRN number
    const student = await Student.findOne({ prnNumber });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Return the marks data
    res.status(200).json({
      prnNumber: student.prnNumber,
      fullName: student.fullName,
      marksData: student.marksData,
    });
  } catch (error) {
    console.error('Error fetching marks data:', error);
    res.status(500).json({ message: 'Failed to fetch marks data' });
  }
});
// Route to Add or Update Attendance Data
// API endpoint to save attendance data

app.post('/api/attendance', async (req, res) => {
  const { prnNumber, semester, attendance, averagePercentage } = req.body;

  try {
    if (
      !prnNumber ||
      !attendance ||
      !Array.isArray(attendance) ||
      attendance.length === 0
    ) {
      return res.status(400).json({ message: 'Invalid attendance data' });
    }

    const student = await Student.findOne({ prnNumber });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (!student.attendanceData) {
      student.attendanceData = [];
    }

    

    // ✅ Create new records
    const newRecords = attendance.map((record) => ({
      subject: record.subjectName,
      totalLectures: record.totalLectures,
      attendedLectures: record.attendedLectures,
      semester,
    }));

    // ✅ Add overall percentage
    newRecords.push({
      subject: 'Overall',
      semester,
      totalLectures: 0,
      attendedLectures: 0,
      averagePercentage,
    });

    // ✅ Push new data and save
    student.attendanceData.push(...newRecords);
    await student.save();

    res.status(201).json({
      message: 'Attendance overwritten successfully',
      student,
    });
  } catch (error) {
    console.error('Error saving attendance data:', error);
    res.status(500).json({ message: 'Failed to save attendance data' });
  }
});

// Route to Fetch Attendance Data
app.get('/api/attendance/:prnNumber', async (req, res) => {
  const { prnNumber } = req.params;

  try {
    const student = await Student.findOne({ prnNumber }, 'fullName attendanceData');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ attendanceData: student.attendanceData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching attendance data' });
  }
});

// Route to Fetch All Student Data
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching students' });
  }
});
app.use('/api/upload', uploadRoute);


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
