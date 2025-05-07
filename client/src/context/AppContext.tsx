import axios from "axios";
import React, { useState, createContext, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface AppContextType {
  backendUrl: string;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  userData: {
    name: string;
    isAccountVerified: boolean;
  } | null;
  setUserData?: React.Dispatch<React.SetStateAction<null>>;
  getUserData?: () => {};
  getAuthState?: () => {};
}

interface AppContextProviderProps {
  children: ReactNode;
}

const AppContent = createContext<AppContextType>({
  backendUrl: "",
  isLoggedIn: false,
  setIsLoggedIn: () => {}, // placeholder
  userData: {
    name: "",
    isAccountVerified: false,
  },
});

const AppContextProvider: React.FC<AppContextProviderProps> = ({
  children,
}) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL as string;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  axios.defaults.withCredentials = true;

  const getAuthState = async () => {
    try {
      const { data } = await axios.post(backendUrl + "/api/auth/is-auth");
      if (data.success) {
        setIsLoggedIn(true);
        getUserData();
      } else {
        toast.error(data.message);
      }
    } catch (err: any) {
      toast.error("You are authorized to access this page ");
    }
  };

  const getUserData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/data");
      data.success ? setUserData(data.userData) : toast.error(data.message);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  const value: AppContextType = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    getUserData,
    setUserData,
    getAuthState,
  };

  return <AppContent.Provider value={value}>{children}</AppContent.Provider>;
};

export { AppContent, AppContextProvider };
