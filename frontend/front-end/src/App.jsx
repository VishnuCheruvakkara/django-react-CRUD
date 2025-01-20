import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/login'
import Register from './pages/register'
import Home from './pages/Home'
import UserProfile from './pages/UserProfile'
import AdminPage from './pages/AdminPage'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='login/' element={<Login/>} />
        <Route path='register/' element={<Register/>} />
        <Route path='/home' element={<Home/>} />
        <Route path='/userprofile' element={<UserProfile/>} />
        <Route path='/adminpage' element={<AdminPage/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
