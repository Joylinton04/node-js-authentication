import axios from "axios";
import React, { useState, createContext, ReactNode, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  // getUserData?: () => Promise<void>;
  getAuthState?: () => Promise<void>;
  canAccessResetPassword: boolean;
  setCanAccessResetPassword: React.Dispatch<React.SetStateAction<boolean>>;
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
  canAccessResetPassword: false,
  setCanAccessResetPassword: () => {},
});

const AppContextProvider: React.FC<AppContextProviderProps> = ({
  children,
}) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL as string;
  const [userData, setUserData] = useState(null);
  const [canAccessResetPassword, setCanAccessResetPassword] = useState(false);

  const getLoggedInState = localStorage.getItem("loggedIn");
  const savedLoggedInState = getLoggedInState
    ? JSON.parse(getLoggedInState)
    : false;
  const [isLoggedIn, setIsLoggedIn] = useState(savedLoggedInState);

  useEffect(() => {
    localStorage.setItem("loggedIn", isLoggedIn);
  }, [isLoggedIn]);

  const getAuthState = async () => {
    try {
      // axios.defaults.withCredentials = true;
      const { data } = await axios.post(
      backendUrl + "/api/auth/is-auth",
      {},
      { withCredentials: true } // ✅ correct place
    );
      if (data.success) {
        setIsLoggedIn(true);
        if (data.userData) {
          setUserData(data.userData);
        }
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    } catch (err: any) {
      if (err.status === 401) {
        setIsLoggedIn(false);
        setUserData(null);
      } else {
        console.error("Auth check failed:", err);
      }
    }
  };

  // const getUserData = async () => {
  //   try {
  //     const { data } = await axios.get(backendUrl + "/api/user/data");
  //     data.success ? setUserData(data.userData) : toast.error(data.message);
  //   } catch (err: any) {
  //     console.log(err)
  //   }
  // };

  // useEffect(() => {
  //   getAuthState();
  // }, []);

  const value: AppContextType = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    // getUserData,
    setUserData,
    getAuthState,
    canAccessResetPassword,
    setCanAccessResetPassword,
  };

  return <AppContent.Provider value={value}>{children}</AppContent.Provider>;
};

export { AppContent, AppContextProvider };
