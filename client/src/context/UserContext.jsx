import axios from "axios";
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
  const updateBalance = async (data = totalTransactions) => {
    // debugger
    let income = 0;
    let expense = 0;
    let loan = 0;

    data.forEach(txn => {
      const type = txn.type.toLowerCase();
      if (type === 'income') {
        income += txn.amount ?? 0;
      } else if (type === 'expense') {
        expense += txn.amount ?? 0;
      } else if (type === 'loan') {
        loan += Math.round(txn.amount) ?? 0;
      }
    });

    setTotalIncome(income);
    setTotalExpense(expense);
    setTotalBalance(income - expense + loan);
  };


  const getTotalExpense = (data = totalTransactions) => {
    const expenses = data.filter(txn => txn.type === 'Expense');
    setTotalExpTransactions(expenses); // Not appending to existing state
  }


  // Fetch all transactions for the current user
  const getTotalTransactions = async () => {
    if (!user) return;

    try {
      const res = await axios.get(TURL, {
        params: { userId: user.id }
      });

      // Save transactions and update totals
      setTotalTransaction(res.data);
      updateBalance(res.data);
      getTotalExpense(res.data);
    } catch (error) {
      console.error('Failed to fetch Transaction:', error);
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
    return filteredData.filter(txn => txn.type === 'Expense')
  }, [totalTransactions]);

  const monthlyExpenseAmount = useMemo(() => {
    return monthlyExpense.reduce((sum, txn) => sum + txn.amount, 0);
  }, [monthlyExpense]);


  const monthlyIncome = useMemo(() => {
    return filteredData.filter(txn => txn.type === 'Income')
  }, [totalTransactions]);

  const monthlyIncomeAmount = useMemo(() => {
    return monthlyIncome.reduce((sum, txn) => sum + txn.amount, 0);
  }, [monthlyIncome]);


  const remainingBalance = useMemo(() => {
    return monthlyIncomeAmount - monthlyExpenseAmount;
  }, [monthlyIncome, monthlyExpense]);


  //Loan contexts 

  const getTotalLoanTransactions = () => {
    return totalExpTansactions.filter(txn => txn.type === 'Expense' && txn.category === 'EMI')
  }

  const loantransaction = getTotalLoanTransactions();


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
        totalBalance, totalExpense, getTotalByCategory,loantransaction,
        totalIncome, updateBalance, getTotalTransactions
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
