import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/login'
import Register from './pages/register'
import Home from './pages/Home'
import UserProfile from './pages/UserProfile'
import AdminPage from './pages/AdminPage'
import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'
import PublicRoute from './components/PublicRoute'
import ToastNotifications from './components/ToastNotifications';

function App() {
  return (
    <BrowserRouter>
      <ToastNotifications />
      <Routes>
        <Route path='login/' element={<PublicRoute><Login /></PublicRoute>} />
        <Route path='register/' element={<Register />} />
        <Route path='/' element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path='/userprofile' element={<PrivateRoute><UserProfile /></PrivateRoute>} />
        <Route path='/adminpage' element={<AdminRoute><AdminPage /></AdminRoute>} />

      </Routes>

    </BrowserRouter>
  )
}

export default App
