import { useState } from 'react'
import { BrowserRouter, Routes,Route, Navigate } from 'react-router-dom'
import AuthContainer from './auth/AuthContainer';
import LoginPage from './auth/LoginPage';
import ReisterPage from './auth/ReigsterPage'; 
import LandingPage from './auth/LandingPage';
import Dashboard from './dashboard/dashboard';
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
         
      <Route index element={<LandingPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<ReisterPage />} />
      <Route path='dashboard'
       element={token? <Dashboard /> : < Navigate to ="/auth" replace />}
      
      />
     </Routes>
     </BrowserRouter>

  )
}

export default App
 