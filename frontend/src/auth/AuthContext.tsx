import { createContext, type Context } from 'react';

type AuthContextType = {
  token: string | null,
  setToken: (_token: string | null) => void;
};

export const AuthContext: Context<AuthContextType> = createContext<AuthContextType>({} as AuthContextType);