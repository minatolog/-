import {useContext} from 'react'
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import AuthContainer from "./auth/AuthContainer.tsx";
import LandingPage from "./auth/LandingPage.tsx";
import LoginPage from "./auth/LoginPage.tsx";
import RegisterPage from "./auth/RegisterPage.tsx";
import Dashboard from "./user/dashboard/Dashboard.tsx"
import {AuthContext} from "./auth/AuthContext.tsx";
import User from "./user/User.tsx";
import Presentation from "./user/presentation/Presentation.tsx";

function App() {

  const {token} = useContext(AuthContext);

  // 根路由 '/'
  // 有认证 token -> 跳转到 '/user' 路由显示用户界面
  // 无认证 token -> 跳转到 '/auth' 路由提示登录
  const rootRoute = (
    <Route
      path="/"
      element={<Navigate to={token ? '/user' : '/auth'} replace />}
    />
  );

  // 认证页路由 '/auth'
  // 双向保护: 验证 token 状态, 只有在无认证 token 的状态下才真正渲染
  // 次级路由:
  // '/auth'(index) -> 渲染 LandingPage
  // '/auth/login' -> 渲染 LoginPage
  // '/auth/register' -> 渲染 RegisterPage
  const authRoute = (
    <Route
      path="/auth"
      element={token ? <Navigate to="/user" replace /> : <AuthContainer />}
    >
      <Route index element={<LandingPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
    </Route>
  );

  // 用户页路由 '/user'
  // 双向保护: 只有在有认证 token 的状态下才真正渲染, 否则跳转到 '/auth' 路由
  // 次级路由:
  // '/user'(index) -> 跳转到 '/user/dashboard'
  // '/user/dashboard' -> 渲染 Dashboard
  // '/user/presentation/:id' -> 渲染指定 id 的 Presentation
  const userRoute = (
    <Route
      path="/user"
      element={token ? <User /> : <Navigate to="/auth" replace />}
    >
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="presentation/:id/:page" element={<Presentation />} />
    </Route>
  );

  return (
    <BrowserRouter>
      <Routes>
        {rootRoute}
        {authRoute}
        {userRoute}
      </Routes>
    </BrowserRouter>
  );
}

export default App
