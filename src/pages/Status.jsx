import React, { useEffect, useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import {
  Box, Grid, Paper, Typography, MenuItem, Select, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, tableCellClasses, TablePagination,
  TableFooter, IconButton
} from '@mui/material';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
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


function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}


const Status = () => {
  const [year, setYear] = useState(2019);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  const { getTotalTransactions, totalTransactions } = useUserContext();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
              <Typography variant="subtitle2" color="textSecondary"> SPENT THIS MONTH</Typography>
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
                  {(
                    rowsPerPage > 0
                      ? totalTransactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      : totalTransactions
                  ).map((row, id) => (
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
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                      colSpan={3}
                      count={totalTransactions.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      slotProps={{
                        select: {
                          inputProps: {
                            'aria-label': 'rows per page',
                          },
                          native: true,
                        },
                      }}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      ActionsComponent={TablePaginationActions}
                    >
                    </TablePagination>
                  </TableRow>
                </TableFooter>
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
                  {(
                    rowsPerPage > 0
                      ? totalTransactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      : totalTransactions
                  ).map((row, id) => (
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
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                      colSpan={3}
                      count={totalTransactions.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      slotProps={{
                        select: {
                          inputProps: {
                            'aria-label': 'rows per page',
                          },
                          native: true,
                        },
                      }}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      ActionsComponent={TablePaginationActions}
                    >
                    </TablePagination>
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </Grid>

          {/* Chart */}
          <Grid display={'flex'} sx={{ justifyContent: 'center', alignItems: 'center' }} flex={1}>

            <ExpensePieChart />
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
                  {(
                    rowsPerPage > 0
                      ? totalTransactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      : totalTransactions
                  ).map((row, id) => (
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
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                      colSpan={3}
                      count={totalTransactions.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      slotProps={{
                        select: {
                          inputProps: {
                            'aria-label': 'rows per page',
                          },
                          native: true,
                        },
                      }}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      ActionsComponent={TablePaginationActions}
                    >
                    </TablePagination>
                  </TableRow>
                </TableFooter>
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
