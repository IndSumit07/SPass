import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";
import axios from "axios";

const PassWalaContext = createContext();

export const usePass = () => {
  const context = useContext(PassWalaContext);
  if (!context) {
    throw new Error("passAuth must be used within an PassProvider");
  }
  return context;
};

const PassContext = ({ children }) => {
  const [passLoadingState, setPassLoadingState] = useState(false);
  const token = localStorage.getItem("token");
  const [userPasses, setUserPasses] = useState(null);
  const [scanning, setScanning] = useState(false);

  const { setLoading, user } = useAuth();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const issuePass = async (eventId) => {
    setPassLoadingState(true);

    try {
      const userId = user?._id;
      if (!userId) {
        toast.error("User Id not found");
      }
      const { data } = await axios.post(
        backendUrl + "/api/passes/issue",
        {
          eventId,
          userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
      console.log(data.pass);

      return data.pass;
    } catch (error) {
      console.log(error.message);
    } finally {
      setPassLoadingState(false);
    }
  };

  const getUserPasses = async () => {
    setPassLoadingState(true);
    try {
      const { data } = await axios.get(backendUrl + "/api/passes/user-passes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setUserPasses(data.passes);
        console.log(data.passes);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setPassLoadingState(false);
    }
  };

  const scanPass = async (passId, eventId) => {
    setPassLoadingState(true);
    try {
      const { data } = await axios.post(backendUrl + "/api/passes/scan", {
        passId,
        eventId,
      });
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setPassLoadingState(false);
    }
  };
  const startScanning = () => {
    setScanning(true);
  };

  const stopScanning = () => {
    setScanning(false);
  };

  useEffect(() => {
    getUserPasses();
  }, []);

  const value = {
    issuePass,
    userPasses,
    passLoadingState,
    scanPass,
    startScanning,
    stopScanning,
    scanning,
  };
  return (
    <PassWalaContext.Provider value={value}>
      {children}
    </PassWalaContext.Provider>
  );
};

export default PassContext;
