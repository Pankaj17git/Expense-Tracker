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

const sortByDateDesc = arr => 
  arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

export {sortByDateDesc, filterDateByTimeFrame}