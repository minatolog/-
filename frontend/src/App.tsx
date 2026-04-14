import { useState } from 'react'
import { BrowserRouter, Routes,Route, Navigate } from 'react-router-dom'
import AuthContainer from './auth/AuthContainer.tsx';
import LoginPage from './auth/LoginPage.tsx';
import RegisterPage from './auth/RegisterPage.tsx';
import LandingPage from './auth/LandingPage.tsx';
import Dashboard from './dashboard/dashboard.tsx';
function App() {
  const[token,setTokenState]=useState(localStorage.getItem('token'));
  return (
    
     <BrowserRouter>
     
     <Routes>
       <Route 
       path="/auth" 
       element={
        token? < Navigate to ="/dashboard" replace /> : <AuthContainer/>
       }
       >   
         
      <Route index element={<LandingPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
        </Route>
      <Route path='dashboard'
       element={
        token? <Dashboard /> : < Navigate to ="/auth" replace />
       }
      />
      <Route 
      path="/dashboard" 
      element={token ? <Dashboard /> : <Navigate to="/auth" replace />} 
      />



     </Routes>
     </BrowserRouter>

  )
}

export default App
 