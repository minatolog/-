import { useContext } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AuthContainer from './auth/AuthContainer.tsx';
import LoginPage from './auth/LoginPage.tsx';
import RegisterPage from './auth/RegisterPage.tsx';
import LandingPage from './auth/LandingPage.tsx';
import Dashboard from './user/dashboard/Dashboard.tsx';
import { AuthContext } from './auth/AuthContext.tsx';
import User from './user/User.tsx';
import Presentation from './user/presentation/Presentation.tsx';

function App() {
  const { token } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={token ? <Navigate to="/user" replace /> : <AuthContainer />}
        >
          <Route index element={<LandingPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        <Route
          path="/user"
          element={token ? <User/> : <Navigate to="/auth" replace />}
        />
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="presentation/:id" element={<Presentation/>} />
        <Route path="*" element={<Navigate to={token ? '/user' : '/auth'} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
