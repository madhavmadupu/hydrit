const express = require('express');
const router = express.Router();
const WaterLog = require('../models/WaterLog');
const auth = require('../middleware/auth');
const { getDateRange } = require('../utils/dateUtils');
const { calculateStats, calculateDailyStats } = require('../utils/statsUtils');

// Get daily statistics
// GET /api/stats/daily/:date
router.get('/daily/:date', auth, async (req, res) => {
  try {
    const { startDate, endDate } = getDateRange(req.params.date, 'daily');
    const logs = await WaterLog.find({
      user: req.userId,
      timestamp: { $gte: startDate, $lt: endDate }
    });

    const { totalIntake, breakdown } = calculateStats(logs);

    res.json({
      date: startDate,
      totalIntake,
      breakdown,
      logs
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get weekly statistics
// GET /api/stats/weekly/:date
router.get('/weekly/:date', auth, async (req, res) => {
  try {
    const { startDate, endDate } = getDateRange(req.params.date, 'weekly');
    const logs = await WaterLog.find({
      user: req.userId,
      timestamp: { $gte: startDate, $lte: endDate }
    });

    const dailyStats = calculateDailyStats(logs);

    res.json({
      weekStart: startDate,
      weekEnd: endDate,
      dailyStats
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get monthly statistics
// GET /api/stats/monthly/:year/:month
router.get('/monthly/:year/:month', auth, async (req, res) => {
  try {
    const startDate = new Date(req.params.year, req.params.month - 1, 1);
    const endDate = new Date(req.params.year, req.params.month, 0);

    const logs = await WaterLog.find({
      user: req.userId,
      timestamp: { $gte: startDate, $lte: endDate }
    });

    const dailyStats = calculateDailyStats(logs);
    const { totalIntake } = calculateStats(logs);
    const averageDaily = totalIntake / Object.keys(dailyStats).length || 0;

    res.json({
      month: req.params.month,
      year: req.params.year,
      monthlyTotal: totalIntake,
      averageDaily,
      dailyStats
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;