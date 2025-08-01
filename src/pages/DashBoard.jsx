import React, { useEffect, useMemo } from 'react';
import { Box, Paper, Grid, Typography } from '@mui/material';
import ExpenseForm from '../components/ExpenseForm';
import DonutChart from '../components/PieChart';
import { BarChart } from '@mui/x-charts';
import { useUserContext } from '../context/UserContext';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';
import { monthNames,chartSetting } from '../data/chart-data';


const DashBoard = () => {
  const {
    filteredData,
    remainingBalance,
    monthlyIncomeAmount,
    totalTransactions,
    monthlyExpenseAmount,
    totalExpTansactions,
    getTotalByCategory,
    getTotalTransactions
  } = useUserContext();

  const categories = ["Food", "Travel", "Shopping", "Miscellaneous", "Utilities"];

  // Prepare data for balance donut chart (Spent vs Remaining)
  const balanceChartData = useMemo(() => ([
    { label: 'Spent', value: monthlyExpenseAmount, color: '#ff6384' },
    { label: 'Remaining', value: remainingBalance, color: '#36a2eb' },
  ]), [filteredData]);


  const Year = dayjs().year();

  const yearFilter = useMemo(() => {
    return totalExpTansactions.filter((txn) => {
      const date = new Date(txn.date);
      const yearMatches = Year ? date.getFullYear() === Year : true;
      return yearMatches
    });
  }, [totalExpTansactions]);


  const YearlyData = useMemo(() => {
    const grouped = {};

    yearFilter.forEach(tx => {
      if (tx.type !== 'Expense') return;

      const date = new Date(tx.date);
      const month = monthNames[date.getMonth()];

      if (!grouped[month]) {
        grouped[month] = { month };
      }

      if (!grouped[month][tx.category]) {
        grouped[month][tx.category] = 0;
      }

      grouped[month][tx.category] += tx.amount;
    });

    return Object.values(grouped);
  }, [yearFilter]);


  // Calculate total amount spent in each category
  const totalByCategory = useMemo(() => {
    const result = {};
    categories.forEach((cat) => {
      result[cat] = getTotalByCategory(filteredData, 'Expense', cat);
    });
    return result;
  }, [filteredData]);

  const totalYearlyCategoryExp = useMemo(() => {
    const result = {};
    categories.forEach((cat) => {
      result[cat] = getTotalByCategory(totalTransactions, 'Expense', cat);
    });
    return result;
  }, [totalTransactions])



  // Color mapping for each category in pie charts
  const categoryColorMap = {
    Food: '#ff6384',
    Travel: '#bacf66ff',
    Shopping: '#ffcd56',
    Miscellaneous: '#4bc0c0',
    Utilities: '#9966ff',
  };

  // Fetch all transactions when the component mounts
  useEffect(() => {
    getTotalTransactions();
  }, []);


  // Get color for a category or return fallback
  const getColorForCategory = (category) => categoryColorMap[category] || '#888';

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    series: [
      {
        name: 'Expenses',
        type: 'pie',
        radius: ['10%', '70%'],
        center: ['50%', '50%'],
        roseType: 'radius',
        label: {
          color: 'black',
          fontSize: 14,
          formatter: '{b}'
        },
        labelLine: {
          lineStyle: {
            color: 'black'
          },
          length: 10,
          length2: 20
        },
        data: categories.map((cat) => ({
          name: cat,
          value: totalYearlyCategoryExp[cat],
          itemStyle: {
            color: getColorForCategory(cat),
          },
        })),
      },
    ],
  };

  return (
    <>
      {/* Root container */}
      <Box sx={{ flexGrow: 1, padding: 1, background: '#e3e3e3' }}>
        <Grid container spacing={1}>

          {/* Left side - Expense Form */}
          <Grid size={6} sx={{ margin: 0 }}>
            <ExpenseForm onClose={() => alert('Transaction successful!')} />
          </Grid>

          {/* Right side - Budget summary (Donut Chart) */}
          <Grid size={6}>
            <Paper elevation={3} sx={{ p: 3, maxWidth: 750, borderRadius: 1, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <Typography variant="h6" sx={{ color: '#007bff', mb: 5, borderBottom: '1px solid gray' }}>
                Budget (Current Month)
              </Typography>
              <DonutChart data={balanceChartData} title="Monthly Expenses" />
              {/* Total / Remaining / Spent Summary */}
              <Grid container sx={{ justifyContent: 'space-evenly' }}>
                <Box>
                  <Typography variant='h5'>Total</Typography>
                  <Typography>&#8377;{monthlyIncomeAmount}</Typography>
                </Box>
                <Box>
                  <Typography variant='h5'>Remaining</Typography>
                  <Typography>&#8377;{remainingBalance}</Typography>
                </Box>
                <Box>
                  <Typography variant='h5'>Spent</Typography>
                  <Typography>&#8377;{monthlyExpenseAmount}</Typography>
                </Box>
              </Grid>
            </Paper>
          </Grid>

          {/* Category-wise breakdown (multiple donut charts) */}
          <Grid size={12}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 1, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <Typography variant="h6" sx={{ color: '#007bff', mb: 5, borderBottom: '1px solid gray' }}>
                Category-wise Expense Distribution
              </Typography>

              <Grid container spacing={2} display={'flex'}>
                {/* Pie Chart */}
                <Grid flex={1}>
                  <DonutChart
                    title="Expense by Category"
                    data={categories.map((cat) => ({
                      label: cat,
                      value: totalByCategory[cat],
                      color: getColorForCategory(cat),
                    }))}
                  />
                </Grid>

                {/* Mini Statement */}
                <Grid flex={1}>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: '#333' }}>
                    Recent Transactions
                  </Typography>
                  <Box sx={{ maxHeight: 280, overflowY: 'auto', pr: 1 }}>
                    {filteredData
                      .slice()
                      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                      .slice(0, 5)
                      .map((tx, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 2,
                            mb: 1.5,
                            p: 1.5,
                            borderRadius: 2,
                            boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.05)',
                            backgroundColor: tx.type === 'Income' ? '#f0fff0' : '#fff0f0',
                            transition: 'transform 0.2s ease-in-out',
                            '&:hover': {
                              transform: 'scale(1.01)',
                              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                              cursor: 'pointer',
                            },
                          }}
                        >
                          {/* Avatar or Icon Placeholder */}
                          <Box
                            sx={{
                              width: 36,
                              height: 36,
                              borderRadius: '50%',
                              backgroundColor: tx.type === 'Income' ? '#b6f2b6' : '#f7baba',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: 16,
                              color: '#444',
                            }}
                          >
                            {tx.category[0]}
                          </Box>

                          {/* Category and Date */}
                          <Box sx={{ flex: 1 }}>
                            <Typography sx={{ fontWeight: 600, color: '#333' }}>{tx.category}</Typography>
                            <Typography sx={{ fontSize: 13, color: '#666' }}>{tx.date}</Typography>
                          </Box>

                          {/* Amount */}
                          <Box>
                            <Typography
                              title={tx.type}
                              sx={{
                                color: tx.type === 'Income' ? 'green' : 'red',
                                fontWeight: 600,
                                fontSize: 15,
                              }}
                            >
                              {tx.type === 'Income' ? '+' : '-'}₹{tx.amount}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                  </Box>
                </Grid>

              </Grid>
            </Paper>
          </Grid>


          {/* Yearly breakdown with bar chart and pie chart */}
          <Grid size={12} sx={{ mt: 1 }}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 1, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <Typography variant="h6" sx={{ color: '#007bff', mb: 5, borderBottom: '1px solid gray' }}>
                Breakdown (Current Year)
              </Typography>
              <Grid container sx={{ justifyContent: 'space-evenly' }} display={'flex'}>

                {/* Bar Chart - Monthly Expense Trend */}
                <Box sx={{ width: '50%' }}>
                  <Typography variant="h6" sx={{ textAlign: 'center' }}>
                    Expenses
                  </Typography>
                  <BarChart
                    dataset={YearlyData}
                    xAxis={[{ dataKey: 'month' }]}
                    series={[
                      { dataKey: 'Food', label: 'Food' },
                      { dataKey: 'Shopping', label: 'Shopping' },
                      { dataKey: 'Travel', label: 'Travel' },
                      { dataKey: 'Miscellaneous', label: 'Miscellaneous' },
                      { dataKey: 'Utilities', label: 'Utilities' },
                    ]}
                      {...chartSetting}
                  />
                </Box>

                {/* Pie Chart - Category Distribution */}
                <Grid display={'flex'} sx={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }} flex={1}>
                  <Typography variant="h6" sx={{ textAlign: 'center', mb: 5}}>
                    Categories
                  </Typography>
                  <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default DashBoard;
