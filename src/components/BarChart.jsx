import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { dataset, valueFormatter } from '../database/weather';

const chartSetting = {
  yAxis: [
    {
      label: 'Amount',
      width: 60,
    },
  ],
  height: 300,
};

const BarsDataset= () => {
  return (
    <BarChart
      dataset={dataset}
      xAxis={[{ dataKey: 'month' }]}
      series={[
        { dataKey: 'generalExpense', label: 'General Expense', valueFormatter },
        { dataKey: 'shopping', label: 'Shopping', valueFormatter },
        { dataKey: 'travel', label: 'Travel', valueFormatter },
        { dataKey: 'mis', label: 'Mis', valueFormatter },
      ]}
      {...chartSetting}
    />
  );
}

export default BarsDataset;