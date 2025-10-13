import { Container } from '@mui/material'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/common/Header'
import Loading from './components/common/Loading'
import Home from './pages/protected/Home'
import Error from './pages/Error'
import Register from './pages/Register'
import Login from './pages/Login'
import ProtectedLayout from './pages/protected/ProtectedLayout'
import "./index.css"

function App() {
  return (
    <BrowserRouter >
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path='/sign-up' element={<Register />} />

        {/* Protected routes */}
        <Route element={<ProtectedLayout />}> 
          <Route path="/" element={<Home />} />
          <Route path="/*" element={<Error />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
export default App