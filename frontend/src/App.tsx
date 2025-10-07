import { Container } from '@mui/material'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/common/Header'
import Loading from './components/common/Loading'
import Home from './pages/protected/Home'
import Error from './pages/Error'
import Register from './pages/Register'
import Login from './pages/Login'

function App() {
  return (
    <BrowserRouter >
        {/* <Header /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/*" element={<Error />} />
        <Route path='/sign-up' element={<Register />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App