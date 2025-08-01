import React, { useEffect, useState } from 'react';
import { Box, TextField, MenuItem, Button, Typography } from '@mui/material';
import axios from 'axios';

const SendMoneyForm = ({ userId }) => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    const fetchBeneficiaries = async () => {
      const res = await axios.get(`http://localhost:4001/transactions?userId=${userId}`);
      setBeneficiaries(res.data);
    };
    fetchBeneficiaries();
  }, [userId]);

  const handleTransfer = async (e) => {
    e.preventDefault();
    const beneficiary = beneficiaries.find(b => b.id === selectedId);
    if (!beneficiary) return;

    const transaction = {
      id: crypto.randomUUID(),
      category: 'Transfer',
      type: 'Expense',
      amount: parseFloat(amount),
      date: new Date().toISOString().split('T')[0],
      description: `Sent to ${beneficiary.nickname}`,
      userId,
      createdAt: new Date().toLocaleString()
    };

    await axios.post('http://localhost:4001/transactions', transaction);
    alert('Money transferred!');
    setSelectedId('');
    setAmount('');
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
          select
          label="Select Beneficiary"
          fullWidth
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          margin="normal"
          required
        >
          {beneficiaries.length === 0 ? (
            <MenuItem disabled>No beneficiaries found</MenuItem>
          ) : (
            beneficiaries.map((b) => (
              <MenuItem key={b.id} value={b.id}>
                {b.nickname} — {b.accountNumber}
              </MenuItem>
            ))
          )}
        </TextField>

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
          disabled={!selectedId || !amount}
        >
          Send
        </Button>
      </Box>
    </>
  );
};

export default SendMoneyForm;
