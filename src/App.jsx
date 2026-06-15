import './App.css'
import Main from './components/Main'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './Login'
function App() {
 
  return (
    <div className='w-full   relative overflow-hidden m-0 '>
    {/* <Router>
      <Routes>
        <Route path='/main' Component={<Main/>} />
        <Route index path='/' Component={<Login/>} />
      </Routes>
    </Router> */}
    <Main  />
    <ToastContainer/>
    </div>
  )
}

export default App
