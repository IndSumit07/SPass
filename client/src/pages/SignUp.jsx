import React, { useState } from "react";
import StartBg from "../../public/StartBg.jpeg";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LoaderCircle } from "lucide-react";

const SignUp = () => {
  const { register, loading } = useAuth();
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    await register(fullname, email, password);
  };

  return (
    <div className="w-full h-[100dvh] flex justify-center items-center relative font-space">
      {loading && (
        <div className="absolute z-50 flex bg-black/75 inset-0 justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      )}
      {/* Background Image */}
      <img
        className="absolute inset-0 w-full h-full object-cover"
        src={StartBg}
        alt="Background"
      />
      <div className="absolute inset-0 bg-black/75"></div>

      {/* Card */}
      <div className="relative z-10 bg-white/20 backdrop-blur-lg px-10 py-12 rounded-2xl shadow-lg w-[90%] max-w-md">
        <h2 className="text-5xl text-white font-forum text-center mb-6">
          Create Your Account
        </h2>
        <p className="text-gray-200 text-center mb-8">
          Join India&apos;s #1 ticket hosting platform
        </p>

        <form onSubmit={onSubmitHandler} className="flex flex-col gap-5">
          <input
            type="text"
            placeholder="Full Name"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            className="px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-purple-600"
          />
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
            disabled={loading ? true : false}
            type="submit"
            className="mt-4 py-3 rounded-full bg-white text-black text-lg font-semibold disabled:opacity-50"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-gray-300 text-center mt-6">
          Already have an account?{" "}
          <Link to="/sign-in" className="text-white font-semibold underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
