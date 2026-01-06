import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Paper
} from '@mui/material';
import './style/expense-form.css'
import axios from 'axios';
import { useUserContext } from '../context/UserContext';
import dayjs from 'dayjs';

const incomeCategories = ["Salary", "Freelancing", "Investments", "Gifts"];
const expenseCategories = ["Food", "Travel", "Shopping", "Miscellaneous", "Utilities"];
const expenseMedium = ['Debit Card', 'Credit Card', 'Cheque', 'Cash', 'netBanking'];
const ExpenseForm = ({editData, onClose}) => {

  const [formData, setFormData] = useState({
    category: '',
    type: '',
    medium: '',
    date: '',
    balance: '',
    amount: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const TXRURL = import.meta.env.VITE_USER_TRANSACTIONS;

  const { updateBalance, totalBalance, getTotalTransactions } = useUserContext();
  console.log(totalBalance);
  

  useEffect(() => {
    if (editData) {
      setFormData(editData); // Pre-fill form if editing
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    debugger
    const newErrors = {};
    const today = dayjs();
    const selectedDate = dayjs(formData.date);


    if (formData.type === 'Expense' && formData.amount >= totalBalance) {
      alert('Insufficient balance');
      return;
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else if (selectedDate.isAfter(today)) {
      newErrors.date = 'Future dates are not allowed';
    } else if (!selectedDate.isSame(today, 'month')) {
      newErrors.date = 'Only current month is allowed';
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      newErrors.amount = 'Enter a valid amount';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = async (e) => {
    debugger
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem('user'));

    if (!validate()) {
      return;
    };

    const newTransaction = {
      ...formData,
      userId: user.id,
      amount: parseFloat(formData.amount),
      balance: totalBalance,
      date: new Date(formData.date).toISOString().split("T")[0],
      createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    };

    try {
      if (editData) {
        await axios.patch(`${TXRURL}/${editData.id}`, newTransaction);
      } else {
        await axios.post(TXRURL, newTransaction)
      }

      await getTotalTransactions();
      updateBalance();
      setFormData({
        category: '',
        type: '',
        date: '',
        medium: '',
        amount: '',
        description: ''
      })
      onClose();              
    } catch (error) {
      console.error('Error adding tarnsition:', error);
      alert('failed to add transition.')
    }
  };

  return (
    <>
      <Paper elevation={3}
        sx={{
          p: 3,
          maxWidth: 750,
          borderRadius: 1,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}
      >
        <Typography variant="h6" sx={{ color: '#007bff', mb: 2, borderBottom: '1px solid gray' }}>
          Add New Transaction
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid>
            {/* Type */}
            <Grid>
              <FormControl fullWidth variant="standard">
                <InputLabel>Type</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <MenuItem value="Expense">Expense</MenuItem>
                  <MenuItem value="Income">Income</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Category */}

            <Grid>
              <FormControl fullWidth variant="standard">
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  {formData.type.toLowerCase() === 'income' ? (
                    incomeCategories.map((cat) => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)
                  ) : (
                    expenseCategories.map((cat) => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)
                  )}
                </Select>
              </FormControl>
            </Grid>

            {/* Expense Medium */}
            {formData.type === 'Expense' && (
              <Grid>
                <FormControl fullWidth variant="standard">
                  <InputLabel>Medium</InputLabel>
                  <Select
                    name="medium"
                    value={formData.medium}
                    onChange={handleChange}
                  >
                    {
                      expenseMedium.map((cat) => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)
                    }
                  </Select>
                </FormControl>
              </Grid>
            )}

            {/* Date */}
            <Grid>
              <TextField
                name="date"
                label="Date"
                type="date"
                variant="standard"
                InputLabelProps={{ shrink: true }}
                fullWidth
                value={formData.date}
                onChange={handleChange}
              />
            </Grid>

            {/* Amount */}
            <Grid>
              <TextField
                name="amount"
                label="Amount"
                type="number"
                variant="standard"
                fullWidth
                value={formData.amount}
                onChange={handleChange}
              />
            </Grid>

            {/* Description */}
            <Grid>
              <TextField
                name="description"
                label="Description"
                variant="standard"
                fullWidth
                multiline
                minRows={2}
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>

            {/* Submit */}
            <Grid textAlign="center"  mt={formData.type === 'Expense' ? 0 : 3} mb={2.59}  >
              <Button
                type="submit"
                variant="outlined"
                sx={{ textTransform: 'uppercase', borderRadius: 1 }}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </>
  );

}

export default ExpenseForm

