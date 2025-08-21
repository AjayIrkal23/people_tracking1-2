import { createContext, useState } from "react";

type AuthUserContextProviderProps = {
  children: React.ReactNode;
};

type AuthenticatedUser = {
  _id: string;
  name: string;
  role: string;
  accessToken: string;
};

type AuthContextType = {
  user: AuthenticatedUser | null;
  setUser: React.Dispatch<React.SetStateAction<AuthenticatedUser | null>>;
};

const AuthContext = createContext({} as AuthContextType);

export const AuthProvider = ({ children }: AuthUserContextProviderProps) => {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
