/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/set-state-in-effect */

import { createContext, useContext, useState, useEffect } from "react";
import api from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore authentication
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("Authentication restore error:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, []);

  // REGISTER
  const register = async (userData) => {
    try {
      const res = await api.post("/auth/register", userData);

      if (res.data.success) {
        return {
          success: true,
          message: res.data.message || "Registration successful",
        };
      }

      return {
        success: false,
        message: res.data.message || "Registration failed",
      };
    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);

      return {
        success: false,
        message:
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Registration failed",
      };
    }
  };

  // LOGIN
  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      if (res.data.success) {
        const { user: userData, token: jwtToken } = res.data;

        setUser(userData);
        setToken(jwtToken);

        localStorage.setItem("token", jwtToken);
        localStorage.setItem("user", JSON.stringify(userData));

        return {
          success: true,
          message: res.data.message || "Login successful",
        };
      }

      return {
        success: false,
        message: res.data.message || "Login failed",
      };
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);

      return {
        success: false,
        message:
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Login failed",
      };
    }
  };

  // LOGOUT
  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
