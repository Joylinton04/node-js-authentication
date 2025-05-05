import React, { useState, createContext, ReactNode } from 'react';

interface AppContextType {
  backendUrl: string;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  userData: boolean;
}

interface AppContextProviderProps {
  children: ReactNode;
}

const AppContent = createContext<AppContextType>({
  backendUrl: "",
  isLoggedIn: false,
  setIsLoggedIn: () => {}, // placeholder
  userData: false
});

const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL as string;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(false);

  const value: AppContextType = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
  };

  return <AppContent.Provider value={value}>{children}</AppContent.Provider>;
};

export { AppContent, AppContextProvider };
