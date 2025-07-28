import React, { useEffect, useMemo } from 'react'
import { Box, Paper, Grid, Typography } from '@mui/material'
import ExpenseForm from '../components/ExpenseForm'
import DonutChart from '../components/PieChart'
import BarsDataset from '../components/BarChart'
import { useUserContext } from '../context/UserContext'


const DashBoard = () => {
  const { totalExpense, totalBalance, totalIncome, getTotalByCategory, totalTransactions, getTotalTransactions } = useUserContext();
  const categories = ["Food", "Travel", "Shopping", "Miscellaneous", "Utilities"];
  const balanceChartData = useMemo(() => ([
    { label: 'Spent', value: totalExpense, color: '#ff6384' },
    { label: 'Remaining', value: totalBalance, color: '#36a2eb' },
  ]), [totalBalance, totalExpense]);

  const categoryColorMap = {
    Food: '#ff6384',
    Travel: '#bacf66ff',
    Shopping: '#ffcd56',
    Miscellaneous: '#4bc0c0',
    Utilities: '#9966ff',
  };

  useEffect(() => {
    getTotalTransactions();
  }, [totalIncome, totalExpense]);

  console.log(totalTransactions);


  const getColorForCategory = (category) => categoryColorMap[category] || '#888';

  console.log(categories)
  return (
    <>
      <Box sx={{ flexGrow: 1, padding: 1, background: '#e3e3e3' }}>
        <Grid container spacing={1}>
          <Grid size={6} sx={{ margin: 0 }}>
            <ExpenseForm />
          </Grid>
          <Grid size={6}>
            <Paper elevation={3}
              sx={{
                p: 3,
                maxWidth: 750,
                borderRadius: 1,
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}
            >
              <Typography variant="h6" sx={{ color: '#007bff', mb: 5, borderBottom: '1px solid gray' }}>
                Budget (Current Month)
              </Typography>
              <DonutChart data={balanceChartData} title="Monthely Expenses" />
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
          <Grid size={12}>
            <Paper elevation={3}
              sx={{
                p: 3,
                borderRadius: 1,
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}
            >
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
                          value: getTotalByCategory(totalTransactions, 'Expense', item),
                          color: getColorForCategory(item),
                        },
                      ]}
                    />
                  </Box>
                ))}
              </Grid>
            </Paper>
          </Grid>
          <Grid size={12} sx={{ mt: 1 }}>
            <Paper elevation={3}
              sx={{
                p: 3,
                borderRadius: 1,
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}
            >
              <Typography variant="h6" sx={{ color: '#007bff', mb: 5, borderBottom: '1px solid gray' }}>
                Breakdown (Current Year)
              </Typography>
              <Grid container sx={{ justifyContent: 'space-evenly' }}>
                <Box sx={{ width: '50%' }}>
                  <Typography variant="h6" sx={{ textAlign: 'center' }}>
                    Expenses
                  </Typography>
                  <BarsDataset />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ textAlign: 'center', mb: 10 }}>
                    Catagories
                  </Typography>
                  <DonutChart />
                </Box>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Box>

    </>
  )
}

export default DashBoard
