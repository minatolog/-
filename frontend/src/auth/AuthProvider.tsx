import { type ReactNode, useState } from "react";
// import { AuthContext } from "./AuthContext.tsx";
import { createContext } from 'react';

type AuthContextType = {
  token: string | null;
  setToken: (token: string | null) => void;
};

export default function AuthProvider({ children }: { children: ReactNode }): Element {
  const [token, setTokenState] = useState(localStorage.getItem('token'));
  const AuthContext: Context<{}> = createContext(<AuthContextType>{}as AuthContextType);

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
  )
}