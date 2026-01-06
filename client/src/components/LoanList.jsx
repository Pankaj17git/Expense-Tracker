import React, { useEffect, useState } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import axios from 'axios';
import dayjs from 'dayjs';
import { useUserContext } from '../context/UserContext';

const LoanList = () => {
  const [loans, setLoans] = useState([]);
  const { totalBalance } = useUserContext();

  const TXRURL = import.meta.env.VITE_USER_TRANSACTIONS;
  const LOANURL = import.meta.env.VITE_USER_LOAN;

  useEffect(() => {
    gettotalLoans();
  }, [totalBalance]);


  const gettotalLoans = async () => {
    const res = await axios.get(LOANURL);
    setLoans(res.data);
  };

  const handlePayEMI = async (loanId) => {
    const loan = loans.find((l) => l.id === loanId);
    if (!loan) return;

    const transaction = {
      category: 'EMI',
      type: 'Expense',
      amount: parseFloat(loan.EMI),
      date: new Date().toISOString().split('T')[0],
      balance: totalBalance,
      medium: 'netBanking',
      description: `EMI payment for ${loan.type} loan`,
      loanId,
      userId: loan.userId,
      createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    };

    try {
      await axios.post(TXRURL, transaction);
      await axios.patch(`${LOANURL}/${loanId}`, {
        emiPaidCount: (loan.emiPaidCount || 0) + 1,
      })

      alert(`EMI Paid for Loan ID: ${loanId}`);
      gettotalLoans();
    } catch (error) {
      console.error('Something went wrong!', error);
    }
  };


  const calculateLoanStatus = (loan) => {
    const emiPaid = loan.emiPaidCount || 0;
    const totalEMIs = loan.term;
    const emiRemaining = Math.max(totalEMIs - emiPaid, 0);

    const nextDueDate = dayjs(loan.startDate).add(emiPaid, 'month').format('YYYY-MM-DD');
    const isOverdue = dayjs().isAfter(dayjs(nextDueDate), 'day');

    return {
      emiPaid,
      emiRemaining,
      nextDueDate,
      isOverdue,
    };
  };


  return (
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
            <TableCell>EMIs Paid</TableCell>
            <TableCell>EMIs Left</TableCell>
            <TableCell>Next Due</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loans.map((loan) => {
            const status = calculateLoanStatus(loan);

            return (
              <TableRow key={loan.id}>
                <TableCell>{loan.type}</TableCell>
                <TableCell>&#8377;{loan.amount}</TableCell>
                <TableCell>{loan.term}</TableCell>
                <TableCell>{loan.rate}%</TableCell>
                <TableCell>&#8377;{loan.EMI}</TableCell>
                <TableCell>{loan.startDate}</TableCell>
                <TableCell>{loan.endDate}</TableCell>
                <TableCell>{status.emiPaid}</TableCell>
                <TableCell>{status.emiRemaining}</TableCell>
                <TableCell>{status.nextDueDate}</TableCell>
                <TableCell>
                  <Typography color={status.emiRemaining === 0 ? 'green' : status.isOverdue ? 'red' : 'green'}>
                    {status.emiRemaining === 0 ? 'Compeleted' : status.isOverdue ? 'Overdue' : 'Upcoming'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handlePayEMI(loan.id)}
                    disabled={status.emiRemaining === 0}
                  >
                    Pay EMI
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LoanList;
