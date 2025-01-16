import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/login'
import Register from './pages/register'
import axios from 'axios';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='login/' element={<Login/>} />
        <Route path='register/' element={<Register/>} />
      </Routes>
    </BrowserRouter>
  
    
  )
}

export default App
