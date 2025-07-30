import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

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

  // Transaction API URL from environment variables
  const TURL = import.meta.env.VITE_USER_TRANSACTIONS;

  // Utility function to calculate and update income, expense, and balance
  const updateBalance = async (data = totalTransactions) => {
    let income = 0;
    let expense = 0;

    data.forEach(txn => {
      if (txn.type.toLowerCase() === 'income') {
        income += txn.amount ?? 0;
      } else {
        expense += txn.amount ?? 0;
      }
    });

    // Update state
    setTotalIncome(income);
    setTotalExpense(expense);
    setTotalBalance(income - expense);
  };

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
        user, setUser, totalTransactions,
        totalBalance, totalExpense, getTotalByCategory,
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
