import React, { useContext, useEffect, useState } from 'react'
import { AppContent } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const {getAuthState, isLoggedIn} = useContext(AppContent)
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate()

  // useEffect(() => {
  //   if(!isLoggedIn) {
  //     toast.error("Login to access this page")
  //   }
  // },[isLoggedIn])

  useEffect(() => {
    getAuthState?.()
  }, []);

  return isLoggedIn ? <>{children}</> : <>{navigate('/')}</>;
}

export default ProtectedRoute;