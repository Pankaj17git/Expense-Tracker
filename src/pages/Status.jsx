import React, { useEffect, useState, useMemo } from 'react';
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
import { BarChart } from '@mui/x-charts/BarChart';
import { useUserContext } from '../context/UserContext';
import ReactECharts from 'echarts-for-react';
import { years, months, monthNames, chartSetting, categories } from '../data/chart-data';

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
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [pagination, setPagination] = useState({
    expense: { page: 0, rowsPerPage: 5 },
    category: { page: 0, rowsPerPage: 5 },
    type: { page: 0, rowsPerPage: 5 },
  });

  const { getTotalTransactions, monthlyExpenseAmount, totalTransactions, totalExpense, getTotalByCategory, totalExpTansactions } = useUserContext();

  // Color mapping for each category in pie charts
  const categoryColorMap = {
    Food: '#ff6384',
    Travel: '#bacf66ff',
    Shopping: '#ffcd56',
    Miscellaneous: '#4bc0c0',
    Utilities: '#9966ff',
    Transfer: '#ff66f7ff'
  };
  const getColorForCategory = (category) => categoryColorMap[category] || '#888';



  const handleChangePage = (tableKey, newPage) => {
    setPagination((prev) => ({
      ...prev,
      [tableKey]: { ...prev[tableKey], page: newPage },
    }));
  };

  const handleChangeRowsPerPage = (tableKey, event) => {
    setPagination((prev) => ({
      ...prev,
      [tableKey]: {
        ...prev[tableKey],
        rowsPerPage: parseInt(event.target.value, 10),
        page: 0,
      },
    }));
  };





  //Filtered data to display in the table
  const filteredTransactions = useMemo(() => {
    return totalExpTansactions.filter((txn) => {
      const date = new Date(txn.date);
      const yearMatches = selectedYear ? date.getFullYear() === selectedYear : true;
      const monthMatches = selectedMonth ? date.getMonth() + 1 === selectedMonth : true; // getMonth is 0-indexed
      return yearMatches && monthMatches;
    });
  }, [totalTransactions, selectedYear, selectedMonth]);

  const { page, rowsPerPage } = pagination.expense;
  filteredTransactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);



  const monthlyData = useMemo(() => {
    const grouped = {};

    filteredTransactions.forEach(tx => {
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
  }, [filteredTransactions]);


  // Calculate total amount spent in each category
  const totalByCategory = useMemo(() => {
    const result = {};
    categories.forEach((cat) => {
      result[cat] = getTotalByCategory(filteredTransactions, 'Expense', cat);
    });
    return result;
  }, [filteredTransactions]);

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
          value: totalByCategory[cat],
          itemStyle: {
            color: getColorForCategory(cat),
          },
        })),
      },
    ],
  };


  const { category: highestExpenseCategory, amount: highestAmount } = Object.entries(totalByCategory).reduce((maxExpense, [category, amount]) => {
    return amount > maxExpense.amount ? { category, amount } : maxExpense;
  },
    { category: '', amount: -Infinity }
  );



  useEffect(() => {
    getTotalTransactions();
  }, []);


  return (
    <>

      <Box p={3} sx={{ flexGrow: 1, background: '#e3e3e3' }}>
        {/* Top Cards */}
        <Grid container spacing={2} mb={3}>
          <Grid >
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="textSecondary"> SPENT THIS MONTH</Typography>
              <Typography variant="h6" color="primary">&#8377;{monthlyExpenseAmount}</Typography>
            </Paper>
          </Grid>
          <Grid >
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">MOST SPENT BY</Typography>
              <Typography variant="h6" color="primary">Debit Card</Typography>
            </Paper>
          </Grid>
          <Grid >
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">MOST SPENT ON</Typography>
              <Typography variant="h6" color="primary">{highestExpenseCategory}</Typography>
            </Paper>
          </Grid>
          <Grid >
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">SPENT THIS YEAR</Typography>
              <Typography variant="h6" color="primary">&#8377;{totalExpense}</Typography>
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
          <Grid >
            <Typography variant="h6" mb={1}>Expenses Breakdown</Typography>
            <Box display="flex" alignItems="center" mb={2}>
              <Typography variant="subtitle1" mr={1}>Year</Typography>
              <Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} size="small">
                {years.map((y) => (
                  <MenuItem key={y} value={y}>{y}</MenuItem>
                ))}
              </Select>

              <Typography variant="subtitle1" ml={2} mr={1}>Month</Typography>
              <Select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} size="small">
                {months.map((m) => (
                  <MenuItem key={m.name} value={m.value}>{m.name}</MenuItem>
                ))}
              </Select>
            </Box>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Category</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Discription</TableCell>
                    <TableCell>Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(
                    rowsPerPage > 0
                      ? filteredTransactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      : filteredTransactions
                  ).map((row, id) => (
                    <StyledTableRow key={id}>

                      <StyledTableCell >{row.category}</StyledTableCell>
                      <StyledTableCell >{row.date}</StyledTableCell>
                      <StyledTableCell >{row.description}</StyledTableCell>
                      <StyledTableCell component="th" scope="row">
                        &#8377;{row.amount}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                      count={filteredTransactions.length}
                      rowsPerPage={pagination.expense.rowsPerPage}
                      page={pagination.expense.page}
                      onPageChange={(e, newPage) => handleChangePage('expense', newPage)}
                      onRowsPerPageChange={(e) => handleChangeRowsPerPage('expense', e)}
                      ActionsComponent={TablePaginationActions}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </Grid>

          {/* Chart */}
          <Grid display={'flex'} flex={1} justifyContent={'center'} alignItems={'center'}>
            <BarChart
              dataset={monthlyData}
              xAxis={[{ dataKey: 'month' }]}
              series={[
                { dataKey: 'Food', label: 'Food' },
                { dataKey: 'Shopping', label: 'Shopping' },
                { dataKey: 'Travel', label: 'Travel' },
                { dataKey: 'Miscellaneous', label: 'Miscellaneous' },
                { dataKey: 'Utilities', label: 'Utilities' },
                { dataKey: 'Transfer', label: 'Transfer' },
              ]}
              {...chartSetting}
            />
          </Grid>
        </Grid>

        {/* Category Breakdown */}
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
              <Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} size="small">
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
                    <TableCell>Discription</TableCell>
                    <TableCell>Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(
                    rowsPerPage > 0
                      ? filteredTransactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      : filteredTransactions
                  ).map((row, id) => (
                    <StyledTableRow key={id}>

                      <StyledTableCell >{row.category}</StyledTableCell>
                      <StyledTableCell >{row.date}</StyledTableCell>
                      <StyledTableCell >{row.description}</StyledTableCell>
                      <StyledTableCell component="th" scope="row">
                        &#8377;{row.amount}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                      count={filteredTransactions.length}
                      rowsPerPage={pagination.expense.rowsPerPage}
                      page={pagination.expense.page}
                      onPageChange={(e, newPage) => handleChangePage('category', newPage)}
                      onRowsPerPageChange={(e) => handleChangeRowsPerPage('category', e)}
                      ActionsComponent={TablePaginationActions}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </Grid>

          {/* Chart */}
          <Grid display={'flex'} sx={{ justifyContent: 'center', alignItems: 'center' }} flex={1}>
            <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{
          p: 3,
          background: 'white',
          borderRadius: 1,
          mb: 2,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <Grid >
            <Typography variant="h6" mb={1}>Type Breakdown</Typography>
            <Box display="flex" alignItems="center" mb={2}>
              <Typography variant="subtitle1" mr={1}>Year</Typography>
              <Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} size="small">
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
                      count={filteredTransactions.length}
                      rowsPerPage={pagination.expense.rowsPerPage}
                      page={pagination.expense.page}
                      onPageChange={(e, newPage) => handleChangePage('type', newPage)}
                      onRowsPerPageChange={(e) => handleChangeRowsPerPage('type', e)}
                      ActionsComponent={TablePaginationActions}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </Grid>

          {/* Chart */}
          <Grid >
            <BarsDataset />
          </Grid>
        </Grid>
      </Box>

    </>
  )
}

export default Status
