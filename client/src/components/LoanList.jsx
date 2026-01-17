import React, { useEffect, useState } from 'react';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography
} from '@mui/material';
import dayjs from 'dayjs';
import { useUserContext } from '../context/UserContext';
import axiosInstance from '../api/axiosInstance'; // ✅ ONLY CHANGE

const LoanList = () => {
  const [loans, setLoans] = useState([]);
  const { totalBalance } = useUserContext();

  useEffect(() => {
    gettotalLoans();
  }, [totalBalance]);

  /* ================= GET LOANS ================= */
  const gettotalLoans = async () => {
    try {
      const res = await axiosInstance.get('/api/loans');
      setLoans(res.data);
    } catch (error) {
      console.error('Failed to fetch loans', error);
    }
  };

  /* ================= PAY EMI ================= */
  const handlePayEMI = async (loanId) => {
    const loan = loans.find((l) => l._id === loanId || l.id === loanId);
    if (!loan) return;

    const transaction = {
      category: 'EMI',
      type: 'expense',
      amount: parseFloat(loan.EMI),
      date: new Date().toISOString().split('T')[0],
      balance: totalBalance,
      mode: 'netBanking',
      description: `EMI payment for ${loan.type} loan`,
      loanId,
      createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    };

    try {
      // 🔹 Create EMI transaction
      await axiosInstance.post('/api/transactions', transaction);

      // 🔹 Update EMI count (backend validates user & loan)  
      await axiosInstance.patch(`/api/loans/${loanId}/pay-emi`);

      alert(`EMI Paid for Loan ID: ${loanId}`);
      gettotalLoans();
    } catch (error) {
      console.error('Something went wrong!', error);
    }
  };

  /* ================= STATUS CALC ================= */
  const calculateLoanStatus = (loan) => {
    const emiPaid = loan.emiPaidCount || 0;
    const totalEMIs = loan.term;
    const emiRemaining = Math.max(totalEMIs - emiPaid, 0);

    const nextDueDate = dayjs(loan.startDate)
      .add(emiPaid, 'month')
      .format('YYYY-MM-DD');

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
              <TableRow key={loan._id || loan.id}>
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
                  <Typography
                    color={
                      status.emiRemaining === 0
                        ? 'green'
                        : status.isOverdue
                        ? 'red'
                        : 'green'
                    }
                  >
                    {status.emiRemaining === 0
                      ? 'Compeleted'
                      : status.isOverdue
                      ? 'Overdue'
                      : 'Upcoming'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handlePayEMI(loan._id || loan.id)}
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
