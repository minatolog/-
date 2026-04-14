import { type JSX, type ReactNode, useState } from "react";
import { AuthContext } from "./AuthContext.tsx";

export default function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [token, setTokenState] = useState(localStorage.getItem('token'));

  function setToken(token: string | null): void {
    setTokenState(token);
    if (token === null) {
      localStorage.removeItem('token');
    } else {
      localStorage.setItem('token', token);
    }
  }

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}