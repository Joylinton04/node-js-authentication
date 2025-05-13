import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import ResetPassword from "../pages/ResetPassword";
import VerifyEmail from "../pages/VerifyEmail";
import ProtectedRoute from "../components/ProtectedRoute";

const Approute = createBrowserRouter([
  {
    path: "/",
    element:
      <Home />
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/verify-email",
    element: (
        <VerifyEmail />
    ),
  },
]);

export default Approute;
