const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');
const auth = require('../middleware/auth');

// Create reminder
// POST /api/reminders
router.post('/', auth, async (req, res) => {
  try {
    const reminder = new Reminder({
      ...req.body,
      user: req.userId
    });
    await reminder.save();
    res.status(201).json(reminder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all reminders
// GET /api/reminders
router.get('/', auth, async (req, res) => {
  try {
    const reminders = await Reminder.find({ user: req.userId });
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update reminder
// PATCH /api/reminders/:id
router.patch('/:id', auth, async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    );
    if (!reminder) {
      return res.status(404).json({ error: 'Reminder not found' });
    }
    res.json(reminder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete reminder
// DELETE /api/reminders/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });
    if (!reminder) {
      return res.status(404).json({ error: 'Reminder not found' });
    }
    res.json({ message: 'Reminder deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;