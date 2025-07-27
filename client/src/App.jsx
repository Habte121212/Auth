import React from 'react'
import './home/home.scss'

import Register from './register/Register'
import Login from './login/Login'
import Home from './home/Home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContex'
import ProtectedRoute from './context/ProtectedRoute'
import { ToastContainer } from 'react-toastify'
import ResetPassword from './restpassword/ResetPassword'
import VerifyRedirect from './login/VerifyRedirect'

function App() {
  return (
    <>
      <ToastContainer />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-redirect" element={<VerifyRedirect />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </>
  )
}

export default App
