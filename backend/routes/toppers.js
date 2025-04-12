const express = require('express');
const router = express.Router();
const Topper = require('../models/Topper');

// Save topper list (called from MarksDetails.js)
router.post('/', async (req, res) => {
  try {
    const { batch, year, semester, topperList } = req.body;

    if (!batch || !year || !semester || !topperList) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const key = `${batch}_${year}_Sem${semester}`;
    await Topper.findOneAndUpdate(
      { key },
      { key, batch, year, semester, topperList },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: 'Topper data saved successfully' });
  } catch (error) {
    console.error('Error saving topper list:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch topper list (called from Leaderboard.js)
router.get('/', async (req, res) => {
  const { batch, year, semester } = req.query;
  const key = `${batch}_${year}_Sem${semester}`;

  try {
    const record = await Topper.findOne({ key });
    if (record) {
      res.json(record.topperList);
    } else {
      res.status(404).json({ message: 'No data found' });
    }
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
