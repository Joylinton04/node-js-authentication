import axios from "axios";
import React, { useState, createContext, ReactNode } from "react";
import { toast } from "react-toastify";

interface AppContextType {
  backendUrl: string;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  userData: boolean;
  getUserData?: (() => {});
}

interface AppContextProviderProps {
  children: ReactNode;
}

const AppContent = createContext<AppContextType>({
  backendUrl: "",
  isLoggedIn: false,
  setIsLoggedIn: () => {}, // placeholder
  userData: false,
});

const AppContextProvider: React.FC<AppContextProviderProps> = ({
  children,
}) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL as string;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(false);

  const getUserData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/data");
      data.success ? setUserData(data.userData) : toast.error(data.message);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const value: AppContextType = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    getUserData
  };

  return <AppContent.Provider value={value}>{children}</AppContent.Provider>;
};

export { AppContent, AppContextProvider };
