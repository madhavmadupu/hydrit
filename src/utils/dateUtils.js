const getDateRange = (date, type) => {
  const startDate = new Date(date);
  let endDate = new Date(date);

  switch (type) {
    case 'daily':
      endDate.setDate(startDate.getDate() + 1);
      break;
    case 'weekly':
      startDate.setDate(startDate.getDate() - startDate.getDay());
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      break;
    case 'monthly':
      startDate.setDate(1);
      endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
      break;
  }

  return { startDate, endDate };
};

module.exports = { getDateRange };