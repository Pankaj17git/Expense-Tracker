const filterDateByTimeFrame = (data, timeframe) => {
  const now = new Date();

  return data.filter(item => {
    const itemDate = new Date(item.createdAt);

    if (timeframe === 'weekly') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);
      return itemDate >= oneWeekAgo         
    }

    if (timeframe === 'monthly') {
      return (
        itemDate.getFullYear() === now.getFullYear() &&
        itemDate.getMonth() === now.getMonth()
      );
    }

    if (timeframe === 'yearly') {
      return itemDate.getFullYear() === now.getFullYear();
    }

    return false;
  });
};

// Filters transactions for a specific year
const filterByYear = (transactions, year) => {
  return transactions.filter(txn => new Date(txn.date).getFullYear() === year);
};

// Filters transactions for a specific month 
const filterByMonth = (transactions, year, month) => {
  return transactions.filter(txn => {
    const date = new Date(txn.date);
    return date.getFullYear() === year && date.getMonth() === month
  })
}


const sortByDateDesc = arr => 
  arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

export {sortByDateDesc, filterDateByTimeFrame ,filterByYear, filterByMonth}