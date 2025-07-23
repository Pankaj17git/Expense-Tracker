
// import ExpenseForm from './components/Header.jsx/ExpenseForm'
import DashBoard from './pages/DashBoard'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import ExpenseList from './pages/ExpenseList'
import Status from './pages/Status'
import MainLayout from './layout/MainLayout'
import AuthForm from './pages/Login'
import PrivateRoute from './routes/Protected'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<AuthForm />} />
          <Route path='/main' element={<PrivateRoute>
            <MainLayout />
          </PrivateRoute>}>
            <Route index element={<DashBoard />} />
            <Route path='dashboard' element={<DashBoard />} />
            <Route path='expense' element={<ExpenseList />} />
            <Route path='status' element={<Status />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
