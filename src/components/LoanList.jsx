import React, { useState } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const LoanList = () => {
  const [loans, setLoans] = useState([
    {
      id: '1',
      type: 'Personal',
      amount: '100000',
      term: '12',
      rate: '10',
      monthlyEMI: '8792',
      startDate: '2025-08-01',
      endDate: '2026-07-31',
    },
    {
      id: '2',
      type: 'Home',
      amount: '500000',
      term: '60',
      rate: '7.5',
      monthlyEMI: '10019',
      startDate: '2025-07-15',
      endDate: '2030-07-15',
    },
  ]);

  const handlePayEMI = (id) => {
    alert(`EMI Paid for Loan ID: ${id}`);
    // You can add logic here to mark EMI as paid or update next due date
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{background: '#838383de'}}>
              <TableCell>Type</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Term (Months)</TableCell>
              <TableCell>Rate (%)</TableCell>
              <TableCell>Monthly EMI</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loans.map((loan) => (
              <TableRow key={loan.id}>
                <TableCell>{loan.type}</TableCell>
                <TableCell>{loan.amount}</TableCell>
                <TableCell>{loan.term}</TableCell>
                <TableCell>{loan.rate}</TableCell>
                <TableCell>{loan.monthlyEMI}</TableCell>
                <TableCell>{loan.startDate}</TableCell>
                <TableCell>{loan.endDate}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => handlePayEMI(loan.id)}>
                    Pay EMI
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default LoanList
