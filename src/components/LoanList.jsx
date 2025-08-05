import React, { useEffect, useState } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';

const LoanList = () => {
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    gettotalLoans();
  }, [loans])
console.log(loans);


  const gettotalLoans = async () => {
    const res = await axios.get('http://localhost:4001/loan');
    setLoans(res.data);
  }


  const handlePayEMI = (id) => {
    alert(`EMI Paid for Loan ID: ${id}`);
    // You can add logic here to mark EMI as paid or update next due date
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ background: '#838383de' }}>
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
                <TableCell>{loan.EMI}</TableCell>
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
