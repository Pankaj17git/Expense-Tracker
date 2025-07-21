import React from 'react'
import { Box, Paper, Grid } from '@mui/material'
import ExpenseForm from '../components/Header.jsx/ExpenseForm'

const DashBoard = () => {

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid size={6}sx={{background:'red'}}>
            <ExpenseForm/>
          </Grid>
          <Grid size={6}sx={{background:'yellow'}}>
            <h1>2</h1>
          </Grid>
          <Grid size={12} sx={{background:'yellow'}}>
            <h1>3</h1>
          </Grid>
          <Grid size={115} sx={{background:'blue'}}>
            <h1>4</h1>

          </Grid>
        </Grid>
      </Box>

    </>
  )
}

export default DashBoard
