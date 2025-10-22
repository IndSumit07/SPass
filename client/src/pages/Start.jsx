import React from "react";
import StartBg from "../../public/StartBg.jpeg";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Start = () => {
  return (
    <div className="w-full h-[100dvh] flex justify-center items-center relative font-space">
      {/* Background Image */}
      <img
        className="absolute inset-0 w-full h-full object-cover"
        src={StartBg}
        alt="Background"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/75"></div>

      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col justify-end items-start px-5 py-10">
        <h3 className="text-white font-forum text-5xl leading-snug">
          India&apos;s No.1 Ticket Hosting Platform
        </h3>
        <p className="text-white text-lg font-semibold font-space mt-2">
          Create, Host, Distribute and Manage Passes for all types of events.
        </p>

        <div className="w-full h-[80px] font-space text-white mt-8 bg-white/20 backdrop-blur-lg px-3 py-3 rounded-full flex gap-5 justify-between items-center">
          <Link to="/sign-up" className="w-1/2 h-full">
            <button className="w-full h-full flex justify-center items-center rounded-full bg-white text-black text-lg font-semibold">
              Sign Up
            </button>
          </Link>
          <Link to="/sign-in" className="w-1/2 h-full">
            <button className="w-full h-full flex justify-center items-center rounded-full bg-gradient-to-r from-[#1d0120] to-[#810086] text-white text-lg font-semibold">
              Sign In
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Start;
