import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Sidebar from './components/Sidebar'
import Main from './components/Main'
import Login from './Login'
import Register from './Register'


function App() {
 
  return (
    <div className='w-full m-0 '>

    <Main  />
    {/* <Router>
      <Routes>
        <Route index path='/'  element={<Main/>} />
        <Route index path='/login'  element={<Login/>} />
        <Route index path='/reg'  element={<Register/>} />
      </Routes>
    </Router> */}
    </div>
  )
}

export default App
