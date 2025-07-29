import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Box, Grid, Paper, Typography, MenuItem, Select, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, tableCellClasses
} from '@mui/material';
import BarsDataset from '../components/BarChart'
import { useUserContext } from '../context/UserContext';
import ExpensePieChart from '../components/RechartPie';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const years = [2015, 2016, 2017, 2018, 2019, 2020, 2021];

const Status = () => {
  const [year, setYear] = useState(2019);
  const { getTotalTransactions, totalTransactions } = useUserContext();

  useEffect(() => {
    getTotalTransactions();
  }, []);

  return (
    <>
   
      <Box p={3} sx={{ flexGrow: 1, background: '#e3e3e3' }}>
        {/* Top Cards */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={3}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">OVERALL SPENT</Typography>
              <Typography variant="h6" color="primary">£ 34,288.34</Typography>
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">MOST SPENT BY</Typography>
              <Typography variant="h6" color="primary">Debit Card</Typography>
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">MOST SPENT ON</Typography>
              <Typography variant="h6" color="primary">Shopping</Typography>
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">SPENT THIS YEAR</Typography>
              <Typography variant="h6" color="primary">£ 19,054.49</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Table and Chart */}
        <Grid container spacing={2} sx={{
            p: 3,
            background: 'white',
            borderRadius: 1,
            mb: 2,
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
          <Grid item xs={6}>
            <Typography variant="h6" mb={1}>Expenses Breakdown</Typography>
            <Box display="flex" alignItems="center" mb={2}>
              <Typography variant="subtitle1" mr={1}>Year</Typography>
              <Select value={year} onChange={(e) => setYear(e.target.value)} size="small">
                {years.map((y) => (
                  <MenuItem key={y} value={y}>{y}</MenuItem>
                ))}
              </Select>
            </Box>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Category</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {totalTransactions.map((row, id) => (
                    <StyledTableRow key={id}>
                      <StyledTableCell component="th" scope="row">
                        &#8377;{row.amount}
                      </StyledTableCell>
                      <StyledTableCell align="right">{row.date}</StyledTableCell>
                      <StyledTableCell align="right">{row.category}</StyledTableCell>
                      <StyledTableCell align="right">{row.type}</StyledTableCell>
                      <StyledTableCell align="right">{row.description}</StyledTableCell>
                      <StyledTableCell align="right">action</StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/* Chart */}
          <Grid item xs={6}>
            <BarsDataset />
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{
            p: 3,
            background: 'white',
            borderRadius: 1,
            mb: 2,
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
          <Grid>
            <Typography variant="h6" mb={1}>Category Breakdown</Typography>
            <Box display="flex" alignItems="center" mb={2}>
              <Typography variant="subtitle1" mr={1}>Year</Typography>
              <Select value={year} onChange={(e) => setYear(e.target.value)} size="small">
                {years.map((y) => (
                  <MenuItem key={y} value={y}>{y}</MenuItem>
                ))}
              </Select>
            </Box>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Category</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {totalTransactions.map((row, id) => (
                    <StyledTableRow key={id}>
                      <StyledTableCell component="th" scope="row">
                        &#8377;{row.amount}
                      </StyledTableCell>
                      <StyledTableCell align="right">{row.date}</StyledTableCell>
                      <StyledTableCell align="right">{row.category}</StyledTableCell>
                      <StyledTableCell align="right">{row.type}</StyledTableCell>
                      <StyledTableCell align="right">{row.description}</StyledTableCell>
                      <StyledTableCell align="right">action</StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/* Chart */}
          <Grid display={'flex'} sx={{justifyContent: 'center', alignItems: 'center'}} flex={1}>
           
           <ExpensePieChart/>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{
          p: 3,
          background: 'white',
          borderRadius: 1,
          mb: 2,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <Grid item xs={6}>
            <Typography variant="h6" mb={1}>Type Breakdown</Typography>
            <Box display="flex" alignItems="center" mb={2}>
              <Typography variant="subtitle1" mr={1}>Year</Typography>
              <Select value={year} onChange={(e) => setYear(e.target.value)} size="small">
                {years.map((y) => (
                  <MenuItem key={y} value={y}>{y}</MenuItem>
                ))}
              </Select>
            </Box>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Category</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {totalTransactions.map((row, id) => (
                    <StyledTableRow key={id}>
                      <StyledTableCell component="th" scope="row">
                        &#8377;{row.amount}
                      </StyledTableCell>
                      <StyledTableCell align="right">{row.date}</StyledTableCell>
                      <StyledTableCell align="right">{row.category}</StyledTableCell>
                      <StyledTableCell align="right">{row.type}</StyledTableCell>
                      <StyledTableCell align="right">{row.description}</StyledTableCell>
                      <StyledTableCell align="right">action</StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/* Chart */}
          <Grid item xs={6}>
            <BarsDataset />
          </Grid>
        </Grid>
      </Box>

    </>
  )
}

export default Status
