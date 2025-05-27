import React, { useContext, useState } from "react";
import images from "../assets/assets";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { backendUrl, setIsLoggedIn, userData, setUserData } = useContext(AppContent);

  const sendEmailVerificationOTP = async () => {
    try{
      axios.defaults.withCredentials = true
      setIsLoading(true)
      const {data} = await axios.post(backendUrl+'/api/auth/send-verify-otp')

      if(data.success) {
        navigate('/verify-email')
        toast.success(data.message)
      }else{
       toast.error(data.message)
      }
      setIsLoading(false)

    }catch(err:any) {
      setIsLoading(false)
      toast.error(err.message)
    }
  }

  const logout = async () => {
  try{
    axios.defaults.withCredentials = true
    const {data} = await axios.post(backendUrl+'/api/auth/logout')
    data.success && setIsLoggedIn(false)
    data.success && setUserData?.(null)
    navigate('/')
  }catch(err:any) {
    toast.error(err.message)
  }
  }

  console.log(userData)

  return (
    <div className="w-full p-8 flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <img src={images.logo} alt="" />
      </div>
      {userData ? (
        <div className="font-bold w-8 h-8 rounded-full bg-black text-white flex items-center justify-center p-2 relative group cursor-pointer">
          {userData.name[0].toUpperCase()}
          <div className={`absolute top-0 right-0 z-10 pt-10 text-black rounded hidden group-hover:block w-max`}>
            <ul className={`list-none m-0 text-sm bg-gray-100 rounded ${isLoading ? 'bg-white text-black/60' : ''}`}>
              {!userData.isAccountVerified && (
                <li className={`py-3 px-2 ${!isLoading ? 'hover:bg-gray-200' : ''}`} onClick={sendEmailVerificationOTP}>Verify Email</li>
              )}
              <li onClick={logout} className={`py-3 px-2 ${!isLoading ? 'hover:bg-gray-200' : ''}`}>Logout</li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="rounded-full px-6 py-3 flex items-center gap-2 border hover:bg-gray-50 transition-all"
        >
          <span className="text-base">Login</span>
          <span>
            <img src={assets.arrow_icon} alt="" />
          </span>
        </button>
      )}
    </div>
  );
};

export default Navbar;
