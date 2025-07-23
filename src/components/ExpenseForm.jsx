import React, { useState } from 'react';
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
import Header from './Header';

const ExpenseForm = () => {

  const [formData, setFormData] = useState({
    category: '',
    type: '',
    date: '',
    amount: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted:', formData);
  };

  return (
    <>
      <Box elevation={3}
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
          <Grid className='form-container'>
            {/* Category */}
            <Grid item sx={{ flexGrow: 6 }}>
              <FormControl fullWidth variant="standard">
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <MenuItem value="Food">Food</MenuItem>
                  <MenuItem value="Travel">Travel</MenuItem>
                  <MenuItem value="Shopping">Shopping</MenuItem>
                  <MenuItem value="Mis">Mis</MenuItem>
                  <MenuItem value="Utilities">Utilities</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Date */}
            <Grid item xs={6}>
              <TextField
                name="date"
                label="Date"
                type="date"
                variant="standard"
                fullWidth
                value={formData.date}
                onChange={handleChange}
              />
            </Grid>

            {/* Type */}
            <Grid item xs={6}>
              <FormControl fullWidth variant="standard">
                <InputLabel>Type</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <MenuItem value="Debit">Debit</MenuItem>
                  <MenuItem value="Credit">Credit</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Amount */}
            <Grid item xs={6}>
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
            <Grid item xs={12}>
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
            <Grid item xs={12} textAlign="center" mt={2}>
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
      </Box>
    </>
  );

}

export default ExpenseForm

