import React, { useEffect, useState } from 'react';
import BeneficialAccountForm from "../components/Beneficiar";
import SendMoneyForm from "../components/MoneyTransferForm";
import { Grid, Box, Typography, Button, Paper } from '@mui/material';
import axios from 'axios';

const BeneficiaryDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const [beneficiaries, setBeneficiaries] = useState([]);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [showTransferForm, setShowTransferForm] = useState(false);

  // Fetch beneficiary list
  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:4001/beneficiaries?userId=${userId}`)
        .then(res => setBeneficiaries(res.data))
        .catch(err => console.error(err));
    }
  }, [userId]);

  const handleBeneficiaryCreated = () => {
    alert('Beneficiary saved!');
    axios.get(`http://localhost:4001/beneficiaries?userId=${userId}`)
      .then(res => setBeneficiaries(res.data));
  };
  
  if (!userId) return <p>Please log in</p>;

  return (
    <Grid container spacing={2} style={{ padding: 20 }}>
      {/* Left: Form to add beneficiary */}
      <Grid item xs={12} md={4}>
        <BeneficialAccountForm userId={userId} onCreated={handleBeneficiaryCreated}/>
      </Grid>

      {/* Right: List of beneficiaries */}
      <Grid item xs={12} md={8}>
        <Typography variant="h6">Saved Beneficiaries</Typography>
        {beneficiaries.length === 0 ? (
          <Typography>No beneficiaries added yet.</Typography>
        ) : (
          beneficiaries.map((b) => (
            <Paper key={b.id} style={{ padding: 16, marginTop: 10 }}>
              <Typography><strong>Nickname:</strong> {b.nickname}</Typography>
              <Typography><strong>Bank:</strong> {b.bankName}</Typography>
              <Typography><strong>IFSC:</strong> {b.ifsc}</Typography>
              <Typography><strong>Account Number:</strong> {b.accountNumber}</Typography>
              <Typography><strong>Account Type:</strong> {b.accountType}</Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setSelectedBeneficiary(b);
                  setShowTransferForm(true);
                }}
                style={{ marginTop: 10 }}
              >
                Transfer
              </Button>
            </Paper>
          ))
        )}

        {/* Conditionally render SendMoneyForm */}
        {showTransferForm && selectedBeneficiary && (
          <Box mt={4}>
            <Typography variant="h6">Transfer Money to: {selectedBeneficiary.nickname}</Typography>
            <SendMoneyForm
              userId={userId}
              beneficiary={selectedBeneficiary}
              onClose={() => {
                setShowTransferForm(false);
                setSelectedBeneficiary(null);
              }}
            />
          </Box>
        )}
      </Grid>
    </Grid>
  );
};

export default BeneficiaryDashboard;
