import './App.css'
import Main from './components/Main'
import { ToastContainer, toast } from "react-toastify";


function App() {
 
  return (
    <div className='w-full m-0 '>
    <ToastContainer>
    <Main  />
    </ToastContainer>
    </div>
  )
}

export default App
