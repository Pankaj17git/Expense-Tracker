import React, { useState } from "react";
import { Box, TextField, MenuItem, Button, Typography, Paper } from "@mui/material";
import axiosInstance from "../api/axiosInstance"; // ✅

const BeneficialAccountForm = ({ onCreated }) => {
  const [form, setForm] = useState({
    bankName: "",
    ifsc: "",
    accountNumber: "",
    nickname: "",
    accountType: ""
  });

  const BURL = import.meta.env.VITE_USER_beneficiaries;

  const banks = [
    "State Bank of India",
    "HDFC Bank",
    "ICICI Bank",
    "Axis Bank",
    "Kotak Mahindra Bank"
  ];

  const accountTypes = ["Savings", "Current", "Salary", "NRI"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axiosInstance.post('/api/beneficiaries', form);
    onCreated();

    setForm({
      bankName: "",
      ifsc: "",
      accountNumber: "",
      nickname: "",
      accountType: ""
    });
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
      <Paper sx={{ p: 3, borderRadius: 1 }}>
        <Typography variant="h6">Create Beneficial Account</Typography>
        <form onSubmit={handleSubmit}>
          <TextField select label="Bank Name" name="bankName" fullWidth
            value={form.bankName} onChange={handleChange} margin="normal">
            {banks.map((bank) => (
              <MenuItem key={bank} value={bank}>{bank}</MenuItem>
            ))}
          </TextField>

          <TextField label="IFSC Code" name="ifsc" fullWidth
            value={form.ifsc} onChange={handleChange} margin="normal" />

          <TextField label="Account Number" name="accountNumber" fullWidth
            value={form.accountNumber} onChange={handleChange} margin="normal" />

          <TextField label="Nickname" name="nickname" fullWidth
            value={form.nickname} onChange={handleChange} margin="normal" />

          <TextField select label="Type of Account" name="accountType" fullWidth
            value={form.accountType} onChange={handleChange} margin="normal">
            {accountTypes.map((type) => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </TextField>

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Create Account
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default BeneficialAccountForm;
