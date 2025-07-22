
// import ExpenseForm from './components/Header.jsx/ExpenseForm'
import DashBoard from './pages/DashBoard'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import ExpenseList from './pages/ExpenseList'
import Status from './pages/Status'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<DashBoard/>}/>
          <Route path='/expense' element={<ExpenseList/>}/>
          <Route path='/status' element={<Status/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
