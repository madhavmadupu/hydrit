const calculateStats = (logs) => {
  const totalIntake = logs.reduce((sum, log) => sum + log.amount, 0);
  const breakdown = logs.reduce((acc, log) => {
    acc[log.type] = (acc[log.type] || 0) + log.amount;
    return acc;
  }, {});

  return { totalIntake, breakdown };
};

const calculateDailyStats = (logs) => {
  const dailyStats = {};
  logs.forEach(log => {
    const day = log.timestamp.toISOString().split('T')[0];
    if (!dailyStats[day]) {
      dailyStats[day] = {
        total: 0,
        breakdown: {}
      };
    }
    dailyStats[day].total += log.amount;
    dailyStats[day].breakdown[log.type] = 
      (dailyStats[day].breakdown[log.type] || 0) + log.amount;
  });

  return dailyStats;
};

module.exports = { calculateStats, calculateDailyStats };