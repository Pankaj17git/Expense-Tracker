
import { PieChart } from '@mui/x-charts/PieChart';
import { useEffect, useState } from 'react';
import { useUserContext } from '../context/UserContext';


const settings = {
  margin: { right: 5 },
  width: 200,
  height: 200,
  hideLegend: true,
};

const DonutChart = () => {
  const [chartData, setChartData] = useState([])
  const { totalBalance, totalExpense } = useUserContext();

  useEffect(() => {
    setChartData([
      {
        label: 'Spent',
        value: totalExpense,
        color: '#ff6384',
      },
      {
        label: 'Remaining',
        value: totalBalance,
        color: '#36a2eb',
      },
    ]);
  }, [totalBalance, totalExpense]);

  return (
    <PieChart sx={{ marginBottom: 4 }}
      series={[{ innerRadius: 50, outerRadius: 100, data: chartData, }]}
      {...settings}
    />
  );
}

export default DonutChart;
