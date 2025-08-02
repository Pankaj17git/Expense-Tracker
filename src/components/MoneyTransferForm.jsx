import React, {  useEffect, useState } from 'react';
import { Box, TextField, MenuItem, Button, Typography } from '@mui/material';
import dayjs from 'dayjs';
import axios from 'axios';
import { useUserContext } from '../context/UserContext';

const SendMoneyForm = ({ userId, onClose, beneficiary }) => {
  const [amount, setAmount] = useState('');
  const {totalBalance, getTotalTransactions} = useUserContext();

  useEffect(() => {
    getTotalTransactions();
  },[amount])

  console.log(totalBalance);
  

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!beneficiary) return;

    if (!amount || Number(amount) <= 0) {
      alert ('Enter a valid amount');
    }

    if (amount >= totalBalance) {
      alert('Insufficient balance');
      return;
    }

    const transaction = {
      id: crypto.randomUUID(),
      category: 'Transfer',
      type: 'Expense',
      amount: parseFloat(amount),
      date: new Date().toISOString().split('T')[0],
      description: `Sent to ${beneficiary.nickname}`,
      userId,
      createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    };

    await axios.post('http://localhost:4001/transactions', transaction);
    alert('Money transferred!');
    setAmount('');
    onClose();
  };
  

  return (
    <>
      <Box
        component="form"
        onSubmit={handleTransfer}
        sx={{ maxWidth: 400, m: 'auto', mt: 4 }}
      >
        <Typography variant="h6" gutterBottom>Send Money</Typography>

        {/* Beneficiary Select Dropdown */}
        <TextField
          label="Beneficiary"
          value={beneficiary.nickname}
          fullWidth
          margin="normal"
          InputProps={{
            readOnly: true,
          }}
        />

        {/* Amount Input */}
        <TextField
          label="Amount"
          type="number"
          fullWidth
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          margin="normal"
          required
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          disabled={!amount}
        >
          Send
        </Button>
      </Box>
    </>
  );
};

export default SendMoneyForm;
