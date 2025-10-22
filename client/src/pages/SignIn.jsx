import React, { useState } from "react";
import StartBg from "../../public/StartBg.jpeg";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const SignIn = () => {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };
  return (
    <div className="w-full h-[100dvh] flex justify-center items-center relative font-space">
      {loading && (
        <div className="absolute z-50 flex bg-black/75 inset-0 justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      )}
      <img
        className="absolute inset-0 w-full h-full object-cover"
        src={StartBg}
        alt="Background"
      />
      <div className="absolute inset-0 bg-black/75"></div>

      <div className="relative z-10 bg-white/20 backdrop-blur-lg px-10 py-12 rounded-2xl shadow-lg w-[90%] max-w-md">
        <h2 className="text-5xl text-white font-forum text-center mb-6">
          Welcome Back
        </h2>
        <p className="text-gray-200 text-center mb-8">
          Sign in to manage your events and passes
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-purple-600"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-purple-600"
          />

          <button
            type="submit"
            className="mt-4 py-3 rounded-full bg-gradient-to-r from-[#1d0120] to-[#810086] text-white text-lg font-semibold disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="text-gray-300 text-center mt-6">
          Don&apos;t have an account?{" "}
          <Link to="/sign-up" className="text-white font-semibold underline">
            Sign Up
          </Link>
        </p>
        <p className="text-gray-300 text-center mt-2">
          <Link
            to="/forgot-password"
            className="text-white font-semibold underline"
          >
            Forgot Password?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
