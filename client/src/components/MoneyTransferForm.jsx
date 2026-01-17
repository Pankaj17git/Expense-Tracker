import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import dayjs from 'dayjs';
import axiosInstance from '../api/axiosInstance'; // ✅
import { useUserContext } from '../context/UserContext';

const SendMoneyForm = ({ onClose, beneficiary }) => {
  const [amount, setAmount] = useState('');
  const { totalBalance, getTotalTransactions } = useUserContext();

  useEffect(() => {
    getTotalTransactions();
  }, [amount]);

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!beneficiary) return;

    if (!amount || Number(amount) <= 0) {
      alert('Enter a valid amount');
      return;
    }

    if (Number(amount) > totalBalance) {
      alert('Insufficient balance');
      return;
    }

    const transaction = {
      category: 'Transfer',
      type: 'expense',              // ✅ matches validator
      mode: 'netBanking',            // ✅ REQUIRED by backend
      amount: parseFloat(amount),
      date: new Date().toISOString().split('T')[0],
      description: `Sent to ${beneficiary.nickname}`,
      createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    };

    try {
      await axiosInstance.post('/api/transactions', transaction);

      alert('Money transferred!');
      setAmount('');
      onClose();
    } catch (error) {
      console.error('Transfer failed', error);
    }
  };

  return (
    <>
      <Box
        component="form"
        onSubmit={handleTransfer}
        sx={{ maxWidth: 400, m: 'auto', mt: 4 }}
      >
        <Typography variant="h6" gutterBottom>
          Send Money
        </Typography>

        <TextField
          label="Beneficiary"
          value={beneficiary.nickname}
          fullWidth
          margin="normal"
          InputProps={{ readOnly: true }}
        />

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
