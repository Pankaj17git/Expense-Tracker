import React, { useEffect, useMemo } from 'react';
import { Box, Paper, Grid, Typography } from '@mui/material';
import ExpenseForm from '../components/ExpenseForm';
import DonutChart from '../components/PieChart';
import BarsDataset from '../components/BarChart';
import { useUserContext } from '../context/UserContext';
import ExpensePieChart from '../components/RechartPie';

const DashBoard = () => {
  const {
    totalExpense,
    totalBalance,
    totalIncome,
    getTotalByCategory,
    totalTransactions,
    getTotalTransactions
  } = useUserContext();

  const categories = ["Food", "Travel", "Shopping", "Miscellaneous", "Utilities"];

  // Prepare data for balance donut chart (Spent vs Remaining)
  const balanceChartData = useMemo(() => ([
    { label: 'Spent', value: totalExpense, color: '#ff6384' },
    { label: 'Remaining', value: totalBalance, color: '#36a2eb' },
  ]), [totalBalance, totalExpense]);

  // Calculate total amount spent in each category
  const totalByCategory = useMemo(() => {
    const result = {};
    categories.forEach((cat) => {
      result[cat] = getTotalByCategory(totalTransactions, 'Expense', cat);
    });
    return result;
  }, [totalTransactions]);

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

  return (
    <>
      {/* Root container */}
      <Box sx={{ flexGrow: 1, padding: 1, background: '#e3e3e3' }}>
        <Grid container spacing={1}>
          
          {/* Left side - Expense Form */}
          <Grid size={6} sx={{ margin: 0 }}>
            <ExpenseForm />
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
                  <Typography>&#8377;{totalIncome}</Typography>
                </Box>
                <Box>
                  <Typography variant='h5'>Remaining</Typography>
                  <Typography>&#8377;{totalBalance}</Typography>
                </Box>
                <Box>
                  <Typography variant='h5'>Spent</Typography>
                  <Typography>&#8377;{totalExpense}</Typography>
                </Box>
              </Grid>
            </Paper>
          </Grid>

          {/* Category-wise breakdown (multiple donut charts) */}
          <Grid size={12}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 1, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <Typography variant="h6" sx={{ color: '#007bff', mb: 5, borderBottom: '1px solid gray' }}>
                Budget (Current Month)
              </Typography>
              <Grid container sx={{ justifyContent: 'space-evenly' }}>
                {categories.map((item, index) => (
                  <Box key={index}>
                    <DonutChart
                      title={`${item} Breakdown`}
                      data={[
                        {
                          label: 'Income',
                          value: totalIncome,
                          color: '#d3d3d3ff',
                        },
                        {
                          label: item,
                          value: totalByCategory[item],
                          color: getColorForCategory(item),
                        },
                      ]}
                    />
                  </Box>
                ))}
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
                  <BarsDataset />
                </Box>

                {/* Pie Chart - Category Distribution */}
                <Grid display={'flex'} sx={{ justifyContent: 'center', alignItems: 'center' }} flex={1}>
                  <Typography variant="h6" sx={{ textAlign: 'center', mb: 10 }}>
                    Categories
                  </Typography>
                  <ExpensePieChart />
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
