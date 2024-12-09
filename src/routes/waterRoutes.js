const express = require('express');
const router = express.Router();
const WaterLog = require('../models/WaterLog');
const auth = require('../middleware/auth');

// Log water intake
// POST /api/water/log
router.post('/log', auth, async (req, res) => {
  try {
    const waterLog = new WaterLog({
      ...req.body,
      user: req.userId
    });
    await waterLog.save();
    res.status(201).json(waterLog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get water logs for a specific day
// GET /api/water/logs/daily/:date
router.get('/logs/daily/:date', auth, async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);

    const logs = await WaterLog.find({
      user: req.userId,
      timestamp: {
        $gte: date,
        $lt: nextDay
      }
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get water logs for a specific week
// GET /api/water/logs/weekly/:date
router.get('/logs/weekly/:date', auth, async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
    const weekEnd = new Date(date.setDate(date.getDate() + 6));

    const logs = await WaterLog.find({
      user: req.userId,
      timestamp: {
        $gte: weekStart,
        $lte: weekEnd
      }
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update water log
// PATCH /api/water/log/:id
router.patch('/log/:id', auth, async (req, res) => {
  try {
    const waterLog = await WaterLog.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    );
    if (!waterLog) {
      return res.status(404).json({ error: 'Water log not found' });
    }
    res.json(waterLog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete water log
// DELETE /api/water/log/:id
router.delete('/log/:id', auth, async (req, res) => {
  try {
    const waterLog = await WaterLog.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });
    if (!waterLog) {
      return res.status(404).json({ error: 'Water log not found' });
    }
    res.json({ message: 'Water log deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;