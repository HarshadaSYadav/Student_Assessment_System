const express = require('express');
const router = express.Router();
const marksheetController = require('../controllers/marksheetController');
const multer = require('multer');

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Create marksheet (POST)
router.post('/upload', upload.single('filedata'), marksheetController.createMarksheet);

// Get all marksheets (GET)
router.get('/', marksheetController.getAllMarksheets);

// Get marksheet by ID (GET)
router.get('/:id', marksheetController.getMarksheetById);

// Update marksheet by ID (PUT)
router.put('/:id', marksheetController.updateMarksheetById);

// Delete marksheet by ID (DELETE)
router.delete('/:id', marksheetController.deleteMarksheetById);

module.exports = router;
