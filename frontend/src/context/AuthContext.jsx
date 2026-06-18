import { createContext, useContext, useState } from 'react';
import { adminApi } from '../services/api';
const Ctx = createContext();
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('dv_user')||'null'); } catch { return null; }
  });
  const login = async (email, password) => {
    const res = await adminApi.login({ email, password });
    const { access_token, refresh_token, user } = res.data.data;
    localStorage.setItem('dv_token',   access_token);
    localStorage.setItem('dv_refresh', refresh_token);
    localStorage.setItem('dv_user',    JSON.stringify(user));
    setUser(user);
    return user;
  };
  const logout = () => { localStorage.clear(); setUser(null); };
  return <Ctx.Provider value={{ user, login, logout }}>{children}</Ctx.Provider>;
}
export const useAuth = () => useContext(Ctx);
