import React, { FormEvent, useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const ResetPassword = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEmailSent, setIsEmailSent] = useState<boolean>(false);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const { backendUrl, isLoggedIn, userData, canAccessResetPassword } = useContext(AppContent);
  axios.defaults.withCredentials = true;

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

  const navigate = useNavigate();

  useEffect(() => {
    if(!canAccessResetPassword) {
      navigate('/login')
    }
  },[canAccessResetPassword, navigate])

  const handleEmailCheck = async (e: FormEvent) => {
    try {
      e.preventDefault();
      setIsLoading(true);

      const { data } = await axios.post(
        backendUrl + "/api/auth/send-reset-otp",
        { email }
      );
      if (data.success) {
        toast.success(data.message);
        setIsEmailSent(true);
      } else {
        toast.error(data.message);
      }
      setIsLoading(false);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpCheck = async (e: FormEvent) => {
    e.preventDefault()
    const otpArray = inputRefs.current.map((e) => e?.value || "");
    const joinedOtp = otpArray.join("");

    if (joinedOtp.length < 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    setOtp(joinedOtp);
    setIsOtpSubmitted(true);
  };

  const handleNewPassword = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      const { data } = await axios.post(
        backendUrl + "/api/auth/reset-password",
        { email, otp, password }
      );
      if (data.success) {
        toast.success(data.message);
        setIsOtpSubmitted(true);
        navigate("/login");
      } else {
        toast.error(data.message);
      }
      setIsLoading(false);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

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
      {!isEmailSent && (
        <form
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
          onSubmit={handleEmailCheck}
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset Password
          </h1>
          <p className="text-center text-indigo-300 mb-6">
            Enter your registerd email address
          </p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="Mail Icon" />
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="bg-transparent outline-none w-full text-white"
              required
            />
          </div>
          <button
            disabled={isLoading}
            className="cursor-pointer w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 font-semibold text-white rounded-full"
          >
            Submit
          </button>
        </form>
      )}

      {/* check otp */}
      {isEmailSent && !isOtpSubmitted && (
        <form
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
          onSubmit={handleOtpCheck}
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset Password OTP
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
            className="cursor-pointer w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 font-semibold text-white rounded-full"
          >
            Submit
          </button>
        </form>
      )}
      {/* new password */}
      {isEmailSent && isOtpSubmitted && (
        <form
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
          onSubmit={handleNewPassword}
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            New Password
          </h1>
          <p className="text-center text-indigo-300 mb-6">
            Enter your new password below
          </p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="Lock Icon" />
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="bg-transparent outline-none w-full text-white"
              autoComplete="off"
              required
            />
          </div>

          <button
            disabled={isLoading}
            className="cursor-pointer w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 font-semibold text-white rounded-full"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
