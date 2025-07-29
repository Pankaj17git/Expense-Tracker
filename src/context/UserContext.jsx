import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalTransactions, setTotalTransaction] = useState([])


  const TURL = import.meta.env.VITE_USER_TRANSACTIONS;


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

    setTotalIncome(income);
    setTotalExpense(expense);
    setTotalBalance(income - expense);
  }


  const getTotalTransactions = async () => {
    if (!user) return;

    try {
      const res = await axios.get(TURL, {
        params: { userId: user.id }
      });

      setTotalTransaction(res.data);
      updateBalance(res.data);
    } catch (error) {
      console.error('Failed to fetch Transaction:', error);
    }
  };


  const getTotalByCategory = (data, type, category) => {
    return data
      .filter(txn => txn.type === type && txn.category === category)
      .reduce((sum, txn) => sum + txn.amount, 0);
  };

  useEffect(() => {
    if (user) {
      getTotalTransactions();
    }
  }, [user]);

  return (
    <UserContext
      value={{
        user, setUser, totalTransactions,
        totalBalance, totalExpense, getTotalByCategory,
        totalIncome, updateBalance, getTotalTransactions
      }}
    >
      {children}
    </UserContext>
  )
}

const useUserContext = () => useContext(UserContext);

// eslint-disable-next-line react-refresh/only-export-components
export { UserContextProvider, useUserContext }
