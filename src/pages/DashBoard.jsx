import React from 'react'
import { Box, Paper, Grid, Typography } from '@mui/material'
import ExpenseForm from '../components/ExpenseForm'
import DonutChart from '../components/PieChart'
import BarsDataset from '../components/BarChart'
import Header from '../components/Header'

const DashBoard = () => {

  return (
    <>
      <Header/>
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
              <DonutChart />
              <Grid container sx={{ justifyContent: 'space-evenly' }}>
                <Box>
                  <Typography variant='h5'>Total</Typography>
                  <Typography>&#8377;64649</Typography>
                </Box>
                <Box>
                  <Typography variant='h5'>Spent</Typography>
                  <Typography>&#8377;644</Typography>
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
                <Box>
                  <Typography sx={{ marginBottom: 2, textAlign: 'center' }}>General Expenses</Typography>
                  <DonutChart />
                </Box>
                <Box>
                  <Typography sx={{ marginBottom: 2, textAlign: 'center' }}>Misc</Typography>
                  <DonutChart />
                </Box>
                <Box>
                  <Typography sx={{ marginBottom: 2, textAlign: 'center' }}>Shopping</Typography>
                  <DonutChart />
                </Box>
                <Box>
                  <Typography sx={{ marginBottom: 2, textAlign: 'center' }}>Travel</Typography>
                  <DonutChart />
                </Box>
                <Box>
                  <Typography sx={{ marginBottom: 2, textAlign: 'center' }}>Utils</Typography>
                  <DonutChart />
                </Box>
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
