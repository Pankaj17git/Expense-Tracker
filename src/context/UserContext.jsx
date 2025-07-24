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

  useEffect(() => {
    console.log('Updated transactions:', totalTransactions);
  }, [totalTransactions]);

  const TURL = import.meta.env.VITE_USER_TRANSACTIONS;

  const getTotalTransactions = async () => {
    if (!user) return;

    try {
      const res = await axios.get(TURL, {
        params: { userId: user.id }
      });

      console.log("Fetched transactions:", res.data);

      setTotalTransaction(res.data); 


    } catch (error) {
      console.error('Failed to fetch Transaction:', error);
    }

  };


  const updateBalance = async () => {
    if (!user) return;

    try {
      const res = await axios.get(TURL, {
        params: { userId: user.id }
      });

      let income = 0;
      let expense = 0;

      res.data.forEach(txn => {
        if (txn.type.toLowerCase() === 'income') {
          income += txn.amount;
        } else {
          expense += txn.amount;
        }
      });

      setTotalIncome(income);
      setTotalExpense(expense);
      setTotalBalance(income - expense);
    } catch (error) {
      console.error('Failed to fetch Transaction:', error);
    }
  }

  useEffect(() => {
    if (user) {
      updateBalance()
    }
  }, [user]);



  return (
    <UserContext
      value={{
        user, setUser,totalTransactions,
        totalBalance, totalExpense,
        totalIncome, updateBalance, getTotalTransactions
      }}
    >
      {children}
    </UserContext>
  )
}

const useUserContext = () => useContext(UserContext);

export { UserContextProvider, useUserContext }
