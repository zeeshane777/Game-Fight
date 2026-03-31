import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("gameFightToken"));
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("gameFightUser") || "null")
  );
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    let mounted = true;

    async function hydrate() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const profile = await authService.me(token);
        if (mounted) {
          setUser(profile.user);
          localStorage.setItem("gameFightUser", JSON.stringify(profile.user));
        }
      } catch (error) {
        if (mounted) {
          localStorage.removeItem("gameFightToken");
          localStorage.removeItem("gameFightUser");
          setToken(null);
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    hydrate();

    return () => {
      mounted = false;
    };
  }, [token]);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    setToken(response.token);
    setUser(response.user);
    localStorage.setItem("gameFightToken", response.token);
    localStorage.setItem("gameFightUser", JSON.stringify(response.user));
    return response.user;
  };

  const register = async (payload) => {
    const response = await authService.register(payload);
    setToken(response.token);
    setUser(response.user);
    localStorage.setItem("gameFightToken", response.token);
    localStorage.setItem("gameFightUser", JSON.stringify(response.user));
    return response.user;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("gameFightToken");
    localStorage.removeItem("gameFightUser");
    sessionStorage.removeItem("gameFightSelection");
  };

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout,
    }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
