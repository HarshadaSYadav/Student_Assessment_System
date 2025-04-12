const mongoose = require('mongoose');

const TopperSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  batch: String,
  year: String,
  semester: String,
  topperList: Object, // Contains {topper1, topper2, topper3}
});

module.exports = mongoose.model('Topper', TopperSchema);
