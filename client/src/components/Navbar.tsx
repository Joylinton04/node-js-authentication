import React from "react";
import images from "../assets/assets";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full p-8 flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <img src={images.logo} alt="" />
      </div>
      <button
        onClick={() => navigate("/login")}
        className="rounded-full px-6 py-3 flex items-center gap-2 border hover:bg-gray-50 transition-all"
      >
        <span className="text-base">Login</span>
        <span>
          <img src={assets.arrow_icon} alt="" />
        </span>
      </button>
    </div>
  );
};

export default Navbar;
