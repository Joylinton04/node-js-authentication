import React, { useContext, useEffect, useState } from 'react'
import { AppContent } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const {getAuthState, isLoggedIn} = useContext(AppContent)
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    getAuthState?.().finally(() => setChecked(true));
  }, []);

  if (!checked) return <div className="text-white text-center mt-10">Loading...</div>;

  return isLoggedIn ? <>{children}</> : <>{navigate('/login')}</>;
}

export default ProtectedRoute;