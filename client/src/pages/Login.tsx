import React, { useState, ChangeEvent, FormEvent, useContext, useEffect } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

type FormState = "Sign Up" | "Login";

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { backendUrl, 
    setIsLoggedIn,
    setCanAccessResetPassword, 
    isLoggedIn,
    userData,
    getAuthState
  } = useContext(AppContent);

  const [formState, setFormState] = useState<FormState>("Sign Up");
  const [formVariables, setFormVariables] = useState({
    name: "",
    email: "",
    password: "",
  });

  const setOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormVariables((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleForgotPassword = () => {
    setCanAccessResetPassword(true)
    navigate('/reset-password')
  }

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();
      axios.defaults.withCredentials = true;
      setIsLoading(true);

      if (formState === "Sign Up") {
        const { data } = await axios.post(backendUrl + "/api/auth/register", {
          ...formVariables,
        });
        if (data.success) {
          setIsLoggedIn(true);
          navigate("/");
        } else {
          toast.error(data.message);
        }
        setIsLoading(false);
      } else {
        const { email, password } = formVariables;
        const { data } = await axios.post(backendUrl + "/api/auth/login", {
          email,
          password,
        });
        if (data.success) {
          setIsLoggedIn(true);
          navigate("/");
        } else {
          toast.error(data.message);
        }
        setIsLoading(false);
      }
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error.response.data);
    }
  };

  // useEffect(() => {
  //   isLoggedIn && getAuthState?.();
  // }, []);

  useEffect(() => {
    isLoggedIn && userData && navigate('/')
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

      {/* form section */}
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-sm text-indigo-300">
        <div>
          <h1 className="text-3xl font-semibold text-white text-center mb-3">
            {formState === "Sign Up" ? "Create Account" : "Login"}
          </h1>
          <h2 className="text-center mb-6 text-sm">
            {formState === "Sign Up"
              ? "Create your account"
              : "Login to your account!"}
          </h2>

          {/* form */}
          <form onSubmit={handleSubmit}>
            {formState === "Sign Up" && (
              <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                <img src={assets.person_icon} alt="Person Icon" />
                <input
                  type="text"
                  name="name"
                  value={formVariables.name}
                  onChange={setOnChange}
                  placeholder="Full Name"
                  className="bg-transparent outline-none w-full text-white"
                  required
                />
              </div>
            )}

            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src={assets.mail_icon} alt="Mail Icon" />
              <input
                type="email"
                name="email"
                value={formVariables.email}
                onChange={setOnChange}
                placeholder="Email"
                className="bg-transparent outline-none w-full text-white"
                required
              />
            </div>

            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src={assets.lock_icon} alt="Lock Icon" />
              <input
                type="password"
                name="password"
                value={formVariables.password}
                onChange={setOnChange}
                placeholder="Password"
                className="bg-transparent outline-none w-full text-white"
                autoComplete="off"
                required
              />
            </div>

            <p
              onClick={() => handleForgotPassword()}
              className="cursor-pointer mb-4 text-indigo-500 hover:underline"
            >
              Forgot Password?
            </p>

            <button
              type="submit"
              className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 grid place-content-center"
              disabled={isLoading}
            >
              {isLoading ? <div className="loader"></div> : formState}
            </button>
          </form>

          {formState === "Sign Up" ? (
            <p className="text-xs text-gray-400 text-center mt-4">
              Already have an account?{" "}
              <span
                onClick={() => setFormState("Login")}
                className="text-blue-400 cursor-pointer underline"
              >
                Login here
              </span>
            </p>
          ) : (
            <p className="text-xs text-gray-400 text-center mt-4">
              Don't have an account?{" "}
              <span
                onClick={() => setFormState("Sign Up")}
                className="text-blue-400 cursor-pointer underline"
              >
                Sign up
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
