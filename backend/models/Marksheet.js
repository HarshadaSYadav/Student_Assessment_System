const mongoose = require('mongoose');

const marksheetSchema = new mongoose.Schema({
  year: { type: String, required: true },
  semester: { type: String, required: true },
  batch: { type: String, required: true },

  students: [
    {
      prn: { type: String, required: true },
      regNo: { type: String, required: true },
      name: { type: String, required: true },
      contact: { type: String, required: true },
      marks: [
        {
          subject: { type: String, required: true },
          marks: { type: Number, required: true },
        },
      ],
    },
  ],

  filename: { type: String, required: true },
  filedata: { type: Buffer, required: true },
  filetype: { type: String, default: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
  uploadedBy: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

const Marksheet = mongoose.model('Marksheet', marksheetSchema);

module.exports = Marksheet;
