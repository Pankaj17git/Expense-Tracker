import React, { useEffect, useState } from 'react';
import BeneficialAccountForm from "../components/Beneficiar";
import SendMoneyForm from "../components/MoneyTransferForm";
import { Grid, Box, Typography, Button, Paper, Dialog, DialogContent } from '@mui/material';
import { Helmet } from 'react-helmet';
import axiosInstance from "../api/axiosInstance"; 

const BeneficiaryDashboard = () => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [openForm, setOpenForm] = useState(false);


  // 🔹 Fetch beneficiaries (user from token)
  useEffect(() => {
    axiosInstance.get('/api/beneficiaries')
      .then(res => setBeneficiaries(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleBeneficiaryCreated = () => {
    alert('Beneficiary saved!');
    axiosInstance.get('/api/beneficiaries').then(res => setBeneficiaries(res.data));
  };

  return (
    <>
      <Helmet><title>Beneficiaries</title></Helmet>

      <Box sx={{ flexGrow: 1, padding: 1, background: '#e3e3e3' }}>
        <Grid container spacing={2} style={{ padding: 20 }}>
          <Grid>
            <BeneficialAccountForm onCreated={handleBeneficiaryCreated} />
          </Grid>

          <Grid flex={1}>
            <Typography variant="h6">Saved Beneficiaries</Typography>

            {beneficiaries.length === 0 ? (
              <Typography>No beneficiaries added yet.</Typography>
            ) : (
              <Box style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {beneficiaries.map((b) => (
                  <Paper key={b._id} style={{ padding: 16, marginTop: 10 }}>
                    <Typography><strong>Nickname:</strong> {b.nickname}</Typography>
                    <Typography><strong>Bank:</strong> {b.bankName}</Typography>
                    <Typography><strong>IFSC:</strong> {b.ifsc}</Typography>
                    <Typography><strong>Account Number:</strong> {b.accountNumber}</Typography>
                    <Typography><strong>Account Type:</strong> {b.accountType}</Typography>

                    <Button
                      variant="contained"
                      onClick={() => {
                        setSelectedBeneficiary(b);
                        setShowTransferForm(true);
                        setOpenForm(true);
                      }}
                      sx={{ mt: 1 }}
                    >
                      Transfer
                    </Button>
                  </Paper>
                ))}
              </Box>
            )}

            {showTransferForm && selectedBeneficiary && (
              <Dialog open={openForm} onClose={() => setOpenForm(false)}>
                <DialogContent>
                  <SendMoneyForm
                    beneficiary={selectedBeneficiary}
                    onClose={() => {
                      setShowTransferForm(false);
                      setSelectedBeneficiary(null);
                      setOpenForm(false);
                    }}
                  />
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
