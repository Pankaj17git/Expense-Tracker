import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, TextField } from '@mui/material'
import dayjs from 'dayjs';
import { useState, useEffect } from 'react'
import { useUserContext } from '../context/UserContext';
import axios from 'axios';


const loanType = ['Personal', 'Car', 'Education', 'Home', 'Business',]


const LoanForm = () => {
  const [loanData, setLoanData] = useState({
    type: '',
    amount: '',
    term: '',
    rate: '',
    EMI: '',
    startDate: '',
    endDate: '',
  });

  const { user, setTotalBalance, getTotalTransactions } = useUserContext()

  useEffect(() => {
    const newEndDate = calculateEndDate(loanData.startDate, loanData.term);
    setLoanData((prev) => ({ ...prev, endDate: newEndDate }));
  }, [loanData.startDate, loanData.term]);

  useEffect(() => {
    const EmiPerMonth = calculateEmi(loanData.amount, loanData.rate, loanData.term);
    setLoanData((prev) => ({ ...prev, EMI: EmiPerMonth }));
  }, [loanData.term, loanData.amount, loanData.rate]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoanData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert('please login!');

    const newLoan = {
      ...loanData,
      userId: user.id,
      amount: parseFloat(loanData.amount),
      startDate: new Date(loanData.startDate).toISOString().split("T")[0],
      endDate: loanData.endDate,
      createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    }

    const transaction = {
      id: crypto.randomUUID(),
      category: loanData.type,
      type: `Loan`,
      amount: parseFloat(loanData.amount),
      date: new Date().toISOString().split('T')[0],
      description: `Get a ${loanData.type} loan`,
      userId: user.id,
      createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    };

    try {
      await axios.post('http://localhost:4001/transactions', transaction)
      await axios.post(`http://localhost:4001/loan`, newLoan);
      await getTotalTransactions();

      // Update total balance after loan submission
      setTotalBalance(prev => prev + parseFloat(loanData.amount));

      setLoanData({
        type: '',
        amount: '',
        term: '',
        rate: '',
        EMI: '',
        startDate: '',
        endDate: '',
      })
    } catch (error) {
      console.error('Something went wrong!0', error);
    }
  }

  const calculateEndDate = (startDate, term) => {
    if (!startDate || !term) return '';
    return dayjs(startDate).add(Number(term), 'month').format('YYYY-MM-DD');
  };

  const calculateEmi = (amount, rate, term) => {
    amount = parseFloat(amount);
    rate = parseFloat(rate);
    term = parseInt(term);

    if (!amount || !rate || !term) return '';

    const monthlyInterest = (amount * rate) / 100 / 12;
    const totalInterest = monthlyInterest * term;
    const totalAmount = amount + totalInterest;
    const emi = totalAmount / term;

    return Math.round(emi * 100) / 100; // 2 decimals
  };


  return (
    <>
      <Paper elevation={3}
        sx={{
          p: 3,
          maxWidth: 750,
          borderRadius: 1,
          border: '1px solid #c5c5c569',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}
      >
        <Box component="form" onSubmit={handleSubmit}>
          <Grid>
            <Grid>
              <FormControl fullWidth variant="standard">
                <InputLabel>Loan Type</InputLabel>
                <Select
                  name='type'
                  value={loanData.type}
                  onChange={handleChange}
                >
                  {loanType.map((type) => (
                    <MenuItem value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid>
              <TextField
                name='amount'
                fullWidth
                label="Amount"
                variant="standard"
                value={loanData.amount}
                onChange={handleChange}
              />
            </Grid>
            <Grid>
              <TextField
                name='term'
                variant="standard"
                fullWidth
                label="Term (in months)"
                value={loanData.term}
                onChange={handleChange}
              />
            </Grid>
            <Grid>
              <TextField
                name='rate'
                variant="standard"
                fullWidth
                label="Interst Rates (%)"
                value={loanData.rate}
                onChange={handleChange}
              />
            </Grid>
            <Grid>
              <TextField
                name='EMI'
                variant="standard"
                fullWidth
                label="EMI"
                value={loanData.EMI}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid>
              <TextField
                fullWidth
                name='startDate'
                label="Start Date"
                variant='standard'
                value={loanData.startDate}
                InputLabelProps={{ shrink: true }}
                type='date'
                onChange={handleChange}
              />
            </Grid>
            <Grid>
              <TextField
                name='endDate'
                variant="standard"
                fullWidth
                label="End Date"
                type='date'
                value={loanData.endDate}
                InputLabelProps={{ shrink: true }}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid textAlign="center" >
              <Button
                type="submit"
                variant="outlined"
                sx={{ textTransform: 'uppercase', borderRadius: 1, mt: 3 }}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </>
  )
}

export default LoanForm
