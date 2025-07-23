
import { PieChart } from '@mui/x-charts/PieChart';
import axios from 'axios';
import { useEffect, useState } from 'react';

const data = [
  { label: 'Group A', value: 400, color: '#0088FE' },
  { label: 'Group B', value: 300, color: '#00C49F' },
];

const settings = {
  margin: { right: 5 },
  width: 200,
  height: 200,
  hideLegend: true,
};

const DonutChart = () => {
  const [userData, setUserData] = useState()
  const TURL = import.meta.env.VITE_USER_TRANSACTIONS

  useEffect(() =>{
    getBalance();
  },[])

    const getBalance = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      const res = await axios.get(TURL, {
        params: { userId: user.id }
      });

      const balance = res.data.reduce((acc, txn) => {
        return txn.type.toLowerCase() === 'income'
        ? acc + txn.amount
        : acc - txn.amount;
      }, 0);

      console.log("Current Balance:", balance);
    };


    return (
      <PieChart sx={{ marginBottom: 4 }}
        series={[{ innerRadius: 50, outerRadius: 100, data, arcLabel: 'value' }]}
        {...settings}
      />
    );
  }

export default DonutChart;
