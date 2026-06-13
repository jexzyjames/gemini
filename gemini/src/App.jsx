import './App.css'
import Main from './components/Main'
import { ToastContainer } from "react-toastify";
// Make sure you have the styles imported so toasts look correct!
import 'react-toastify/dist/ReactToastify.css'; 

function App() {
  return (
    <div className='w-full m-0'>
      {/* FIXED: Main is now placed normally on the page */}
      <Main />
      
      {/* FIXED: ToastContainer is now self-closing */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  )
}

export default App
