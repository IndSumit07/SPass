import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AuthWalaContext = createContext();
export const useAuth = () => {
  const context = useContext(AuthWalaContext);
  if (!context) {
    throw new Error("useA uth must be used within an AuthProvider");
  }
  return context;
};

export const AuthContext = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token") || "";
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const register = async (fullname, email, password) => {
    setLoading(true);
    try {
      const { data } = await axios.post(backendUrl + "/api/auth/register", {
        fullname,
        email,
        password,
      });

      if (data.success) {
        toast.success(data.message);
        navigate("/verify-otp", {
          state: {
            email: email,
          },
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  const verifyAccount = async (email, enteredOtp) => {
    setLoading(true);
    try {
      const { data } = await axios.post(backendUrl + "/api/auth/verify-otp", {
        email,
        enteredOtp,
      });

      if (data.success) {
        toast.success(data.message);
        navigate("/sign-in");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await axios.post(backendUrl + "/api/auth/login", {
        email,
        password,
      });

      if (data.success) {
        toast.success(data.message);
        localStorage.setItem("token", data.token);
        setUser(data.user);
        navigate("/home");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getUserProfile = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(backendUrl + "/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setUser(data.user);
        console.log(data.user);
      } else {
        navigate("/");
        location.reload();
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getUserProfile();
  }, []);

  const logout = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(backendUrl + "/api/auth/logout", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        localStorage.removeItem("token");
        navigate("/");
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    register,
    verifyAccount,
    loading,
    setLoading,
    login,
    user,
    logout,
  };
  return (
    <AuthWalaContext.Provider value={value}>
      {children}
    </AuthWalaContext.Provider>
  );
};
