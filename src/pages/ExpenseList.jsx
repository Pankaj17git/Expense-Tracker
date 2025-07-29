
import { styled, useTheme } from '@mui/material/styles';
import {
  Table, TableBody, TableCell, tableCellClasses,
  TableHead, TableRow, Paper, Typography,
  Box,
  IconButton,
  TableFooter,
  TablePagination,
  Grid,
  Tooltip,
  Avatar,
  Menu,
} from '@mui/material';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import FilterListIcon from '@mui/icons-material/FilterList';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { useUserContext } from '../context/UserContext';
import { useEffect, useState } from 'react';
import { filterDateByTimeFrame, sortByDateDesc } from '../utils/dateFilters';
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

const filter = ['monthly', 'weekly', 'yearly'];

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


const ExpenseList = () => {
  const [page, setPage] = useState(0);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('monthly')
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { getTotalTransactions, totalTransactions } = useUserContext()

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - totalTransactions.length) : 0;

  useEffect(() => {
    getTotalTransactions();
  }, []);

  const filtered = filterDateByTimeFrame(totalTransactions, selectedFilter);
  const sorted = sortByDateDesc(filtered);


  const handleFilter = (filterType) => {
    setSelectedFilter(filterType)
    console.log(selectedFilter);

  }

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Box sx={{ height: '100vh', padding: 5, background: '#eae8e8' }}>
        <Paper sx={{ paddingTop: 0.5 }}>
          <Grid display={'flex'} flexDirection={'row'}>
            <Typography variant="h6" sx={{ color: '#007bff', m: 2 }}>
              Transactions
            </Typography>
            <Typography variant="h6" sx={{ color: '#000000ff', m: 2 }} flex={1} textAlign={'right'}>
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <FilterListIcon />
                    <Typography>{selectedFilter}</Typography>
                  </IconButton> 
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  keepMounted
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {filter.map((filterType) => (
                    <Box key={filterType} onClick={() => handleFilter(filterType)} sx={{ px: 2, py: 1, cursor: 'pointer' }}>
                      <Typography sx={{ textAlign: 'center' }}>{filterType}</Typography>
                    </Box>
                  ))}
                </Menu>

              </Box>
            </Typography>
          </Grid>
          <Table sx={{ minWidth: 700, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Amount</StyledTableCell>
                <StyledTableCell align="right">Date</StyledTableCell>
                <StyledTableCell align="right">Category</StyledTableCell>
                <StyledTableCell align="right">Type</StyledTableCell>
                <StyledTableCell align="right">Discription</StyledTableCell>
                <StyledTableCell align="right">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : sorted
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
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
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
        </Paper>

      </Box>
    </>
  )
}

export default ExpenseList
