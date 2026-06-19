import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const loadProfile = useCallback(async () => {
    if (!token) { setLoading(false); return; }
    try {
      const data = await api.getProfile();
      setUser(data);
    } catch { setUser(null); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { loadProfile(); }, [loadProfile]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("fullName");
    setUser(null);
    window.location.href = "/";
  };

  const refresh = () => loadProfile();

  return (
    <AuthContext.Provider value={{ user, loading, logout, refresh, token, isAdmin: user?.role === "ADMIN" }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
