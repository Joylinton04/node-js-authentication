import React, { FormEvent, useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContent } from "../context/AppContext";
import axios from "axios";

const VerifyEmail = () => {
  const { backendUrl, getUserData, isLoggedIn, userData } = useContext(AppContent);
  const navigate = useNavigate();
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return;

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const pastedData = e.clipboardData.getData("text");
    const pastedDataArray = pastedData.split("");
    pastedDataArray.forEach((char, index) => {
      if (!/^[0-9]?$/.test(char)) return;
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
    inputRefs.current[pastedDataArray.length - 1]?.focus();
  };

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();
      const otpArray = inputRefs.current.map((e) => e?.value);
      const otp = otpArray.join("");
      setIsLoading(true);

      const { data } = await axios.post(
        backendUrl + '/api/auth/verify-account',
        { otp }
      );

      if (data.success) {
        toast.success(data.message);
        getUserData?.();
        navigate("/");
      } else {
        toast.error(data.message);
      }
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      toast.error(err.message);
    }
  };

  useEffect(() => {
    isLoggedIn && userData && userData.isAccountVerified && navigate('/')
  },[isLoggedIn,userData])

  return (
    <div className="font-default flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <div className="p-8 absolute top-0 left-5 sm:left-20">
        <img
          src={assets.logo}
          alt="Header"
          onClick={() => navigate("/")}
          className="cursor-pointer "
        />
      </div>
      <form
        className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        onSubmit={handleSubmit}
      >
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Email Verify OTP
        </h1>
        <p className="text-center text-indigo-300 mb-6">
          Enter the 6-digits OTP send to your email id.
        </p>
        <div className="flex justify-between mb-8" onPaste={handlePaste}>
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                type="text"
                key={index}
                ref={(e) => {
                  inputRefs.current[index] = e;
                }}
                onChange={(e) => handleInput(e, index)}
                maxLength={1}
                required
                className="w-12 h-12 bg-[#333A5C] rounded-md text-center text-white"
              />
            ))}
        </div>
        <button
          disabled={isLoading}
          className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 font-semibold text-white rounded-full"
        >
          Verify Email
        </button>
      </form>
    </div>
  );
};

export default VerifyEmail;
