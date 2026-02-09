import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, setAuthToken } from "@/lib/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(null);

  const refreshUser = async () => {
    try {
      const { data } = await api.get("/auth/me");
      setUser(data);
      setStatus(true);
    } catch (error) {
      setUser(null);
      setStatus(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) setAuthToken(token);
    refreshUser();
  }, []);

  const loginWithJWT = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("auth_token", data.token);
    setAuthToken(data.token);
    setUser(data.user);
    setStatus(true);
  };

  const registerWithJWT = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    setUser(data.user);
    setStatus(true);
  };

  const logout = async () => {
    localStorage.removeItem("auth_token");
    setAuthToken(null);
    await api.post("/auth/logout");
    setUser(null);
    setStatus(false);
  };

  const loginWithGoogle = () => {
    const redirectUrl = window.location.origin + "/admin";
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  const value = useMemo(
    () => ({ user, status, loginWithJWT, registerWithJWT, logout, loginWithGoogle, refreshUser }),
    [user, status]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
