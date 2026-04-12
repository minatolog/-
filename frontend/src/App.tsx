import { useState } from 'react'
import { BrowserRouter, Routes,Route, Navigate } from 'react-router-dom'
import AuthContainer from './auth/AuthContainer';
function App() {
  const[token,setTokenState]=useState(localStorage.getItem('token'));
  return (
    
     <BrowserRouter>
     
     <Routes>
       <Route path="/auth" 
       element={
        token? < Navigate to ="/dashboard" replace /> : <AuthContainer/>
       }>   
       </Route>
         
      
     </Routes>
     
     
     </BrowserRouter>

  )
}

export default App
 