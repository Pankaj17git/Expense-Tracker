import { Box, Grid, Typography } from '@mui/material'
import React from 'react'
import LoanForm from '../components/LoanForm'
import LoanList from '../components/LoanList'
import { Helmet } from 'react-helmet'

const LoanDashBoard = () => {
  return (
    <>
      <Helmet>
        <title>Loan</title>
      </Helmet>

      <Box sx={{ flexGrow: 1, padding: 5, background: '#e3e3e3', height: '100vh' }}>
        <Grid
          sx={{padding: 5, border: '1px solid 1976d242', borderRadius: 2, background:"#1976d287", mb:4}}
        >
          <Typography color='#0f31f1ff' variant="h4" textAlign={'center'}>
            Loan Manager
          </Typography>
        </Grid>
        <Grid display={'flex'} gap={3}>
          <Grid flex={1}>
            <LoanForm />
          </Grid>
          <Grid flex={2}>
            <LoanList />
          </Grid>
        </Grid>

      </Box>
    </>
  )
}

export default LoanDashBoard
