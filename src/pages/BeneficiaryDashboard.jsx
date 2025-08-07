import React, { useEffect, useState } from 'react';
import BeneficialAccountForm from "../components/Beneficiar";
import SendMoneyForm from "../components/MoneyTransferForm";
import { Grid, Box, Typography, Button, Paper, Dialog, DialogContent } from '@mui/material';
import axios from 'axios';
import { Helmet } from 'react-helmet';

const BeneficiaryDashboard = () => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [openForm, setOpenForm] = useState(false)

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;


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
    <>
      <Helmet>
        <title>Beneficiaries</title>
      </Helmet>
      <Box sx={{ flexGrow: 1, padding: 1, background: '#e3e3e3' }}>
        <Grid container spacing={2} style={{ padding: 20 }}>
          {/* Left: Form to add beneficiary */}
          <Grid>
            <BeneficialAccountForm userId={userId} onCreated={handleBeneficiaryCreated} />
          </Grid>

          {/* Right: List of beneficiaries */}
          <Grid flex={1}>
            <Typography variant="h6">Saved Beneficiaries</Typography>
            {beneficiaries.length === 0 ? (
              <Typography>No beneficiaries added yet.</Typography>
            ) : (
              <Box style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {beneficiaries.map((b) => (
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
                        setOpenForm(true)
                      }}
                      style={{ marginTop: 10 }}
                    >
                      Transfer
                    </Button>
                  </Paper>
                ))}
              </Box>
            )}
            {/* Conditionally render SendMoneyForm */}
            {showTransferForm && selectedBeneficiary && (
              <Dialog open={openForm} onClose={() => setOpenForm(false)}>
                <DialogContent>
                  <Box mt={4}>
                    <Typography variant="h6">Transfer Money to: {selectedBeneficiary.nickname}</Typography>
                    <SendMoneyForm
                      userId={userId}
                      beneficiary={selectedBeneficiary}
                      onClose={() => {
                        setShowTransferForm(false);
                        setSelectedBeneficiary(null);
                        setOpenForm(false)
                      }}
                    />
                  </Box>
                </DialogContent>
              </Dialog>
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default BeneficiaryDashboard;
