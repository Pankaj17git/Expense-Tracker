import axiosInstance from "../api/axiosInstance";

import { createContext, useContext, useEffect, useState, useMemo } from "react";
import dayjs from "dayjs";
// Create a new context to share user and transaction-related data across components
const UserContext = createContext();

// Context Provider Component
const UserContextProvider = ({ children }) => {
  // Load user from localStorage on initial mount
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  // State for income, expense, balance, and transactions list
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalTransactions, setTotalTransaction] = useState([]);
  const [totalExpTansactions, setTotalExpTransactions] = useState([])

  // Transaction API URL from environment variables
  const TURL = import.meta.env.VITE_USER_TRANSACTIONS;

  // Utility function to calculate and update income, expense, and balance
  const updateBalance = (data = totalTransactions) => {
    let income = 0;
    let expense = 0;

    data.forEach(txn => {
      if (txn.type === 'income') {
        income += txn.amount ?? 0;
      } else if (txn.type === 'expense') {
        console.log("expense", txn)
        expense += txn.amount ?? 0;
      }
    });

    setTotalIncome(income);
    setTotalExpense(expense);
  };



  const getTotalExpense = (data = totalTransactions) => {
    const expenses = data.filter(txn => txn.type === 'expense');
    setTotalExpTransactions(expenses);
  };



  // Fetch all transactions for the current user
  const getTotalTransactions = async () => {
    if (!user) return;

    try {
      const res = await axiosInstance.get("/api/transactions");

      const transactions = res.data.transactions || [];

      setTotalTransaction(transactions);

      // ✅ Balance comes from latest transaction
      if (transactions.length > 0) {
        setTotalBalance(transactions[0].balance);
      } else {
        setTotalBalance(0);
      }

      getTotalExpense(transactions);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    }
  };



  // Utility to calculate total amount for a specific type and category (e.g., 'Expense' + 'Food')
  const getTotalByCategory = (data, type, category) => {
    return data
      .filter(txn => txn.type === type && txn.category === category)
      .reduce((sum, txn) => sum + txn.amount, 0);
  };


  //Total by month
  const today = dayjs();
  const date = new Date(today);
  const month = date.getMonth()

  const filteredData = useMemo(() => {
    return totalTransactions.filter(txn => {
      const date = new Date(txn.date);
      return date.getMonth() === month
    })
  })

  const monthlyExpense = useMemo(() => {
    return filteredData.filter(txn => txn.type === 'expense')
  }, [totalTransactions]);

  const monthlyExpenseAmount = useMemo(() => {
    return monthlyExpense.reduce((sum, txn) => sum + txn.amount, 0);
  }, [monthlyExpense]);


  const monthlyIncome = useMemo(() => {
    return filteredData.filter(txn => txn.type === 'income')
  }, [totalTransactions]);

  const monthlyIncomeAmount = useMemo(() => {
    return monthlyIncome.reduce((sum, txn) => sum + txn.amount, 0);
  }, [monthlyIncome]);


  const remainingBalance = useMemo(() => {
    return monthlyIncomeAmount - monthlyExpenseAmount;
  }, [monthlyIncome, monthlyExpense]);


  //Loan contexts 

  const getTotalLoanTransactions = () => {
    return totalExpTansactions.filter(
      txn => txn.type === "expense" && txn.category === "EMI"
    );
  };


  const loantransaction = getTotalLoanTransactions();

  const availableYears = useMemo(() => {
    const yearsSet = new Set();

    totalTransactions.forEach(txn => {
      if (!txn.date) return;
      const year = new Date(txn.date).getFullYear();
      yearsSet.add(year);
    });

    // Convert to array and sort descending
    return Array.from(yearsSet).sort((a, b) => b - a);
  }, [totalTransactions]);



  // When `user` changes (e.g., login), fetch their transactions
  useEffect(() => {
    if (user) {
      getTotalTransactions();
    }
  }, [user]);

  // Provide context value to child components
  return (
    <UserContext.Provider
      value={{
        user, setUser, setTotalBalance, totalTransactions, totalExpTansactions,
        getTotalExpense, remainingBalance, monthlyExpense, monthlyIncome,
        monthlyExpenseAmount, monthlyIncomeAmount, filteredData,
        totalBalance, totalExpense, getTotalByCategory, loantransaction,
        totalIncome, updateBalance, getTotalTransactions, availableYears
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to easily access context
const useUserContext = () => useContext(UserContext);

// Export Provider and hook
// eslint-disable-next-line react-refresh/only-export-components
export { UserContextProvider, useUserContext };
