import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, TextField } from '@mui/material'
import { useState } from 'react'


const loanType = ['Personal', 'Car', 'Education', 'Home', 'Business',]


const LoanForm = () => {
  const [loanData, setLoanData] = useState({
    type: '',
    amount: '',
    term: '',
    rate: '',
    monthlyEMI: '',
    startDate: '',
    endDate: '',
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoanData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(loanData);

  }

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
              <FormControl>
                <TextField
                  name='amount'
                  label="Amount"
                  variant="standard"
                  value={loanData.amount}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
            <Grid>
              <FormControl>
                <TextField
                  name='term'
                  variant="standard"
                  label="Term"
                  value={loanData.term}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>\
            <Grid>
              <FormControl>
                <TextField
                  name='rate'
                  variant="standard"
                  label="Interst Rates (%)"
                  value={loanData.rate}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
            <Grid>
              <FormControl>
                <TextField
                  name='EMI'
                  variant="standard"
                  label="EMI"
                  value={loanData.EMI}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
            <Grid>
              <FormControl>
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
              </FormControl>
            </Grid>
            <Grid>
              <FormControl>
                <TextField
                  name='endDate'
                  variant="standard"
                  label="End Date"
                  value={loanData.endDate}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
            <Grid textAlign="center" >
              <Button
                type="submit"
                variant="outlined"
                sx={{ textTransform: 'uppercase', borderRadius: 1 , mt:3}}
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
