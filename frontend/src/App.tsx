import { useContext } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AuthContainer from './auth/AuthContainer.tsx';
import LoginPage from './auth/LoginPage.tsx';
import RegisterPage from './auth/RegisterPage.tsx';
import LandingPage from './auth/LandingPage.tsx';
import Dashboard from './dashboard/Dashboard.tsx';
import { AuthContext } from './auth/AuthContext.tsx';

function App() {
  const { token } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={token ? <Navigate to="/dashboard" replace /> : <AuthContainer />}
        >
          <Route index element={<LandingPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/auth" replace />}
        />
        <Route path="*" element={<Navigate to={token ? '/dashboard' : '/auth'} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
