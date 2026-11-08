import { createContext, useContext, useEffect, useState } from "react";
import * as api from "./api";

type Ctx = {
  user: any | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  setUser: (user: any) => void;
  setTokenAndUser: (token: string) => Promise<any>;
};

const AuthContext = createContext<Ctx>(null as any);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("pw_token");
    if (!token) return setLoading(false);
    api
      .me()
      .then(setUser)
      .catch(() => localStorage.removeItem("pw_token"))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const { access_token } = await api.login(email, password);
    localStorage.setItem("pw_token", access_token);
    setUser(await api.me());
  };
  const register = async (email: string, password: string, name: string) => {
    const { access_token } = await api.register({ email, password, full_name: name });
    localStorage.setItem("pw_token", access_token);
    setUser(await api.me());
  };
  const setTokenAndUser = async (token: string) => {
    localStorage.setItem("pw_token", token);
    const u = await api.me();
    setUser(u);
    return u;
  };
  const logout = () => {
    localStorage.removeItem("pw_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser, setTokenAndUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
