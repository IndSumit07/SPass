import { Bell } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const TopNavbar = () => {
  const { user } = useAuth();

  return (
    <div className="fixed w-full h-[80px] top-0 left-0 z-50 bg-[#0e0e0e]/90 backdrop-blur-md border-b border-white/10 px-6 py-4 flex justify-between items-center">
      <div>
        <h2 className="text-lg text-gray-300">Hey {user?.fullname} 👋</h2>
      </div>
      <div className="flex items-center gap-4">
        {/* Notification Button */}
        <button className="p-3 bg-white/10 rounded-full flex justify-center items-center hover:bg-white/20 transition">
          <Bell size={20} color="white" />
        </button>

        {/* Profile Button */}
        <Link
          to="/profile"
          className="w-10 h-10 rounded-full bg-purple-700 flex justify-center items-center text-white font-bold text-lg"
        >
          {user?.fullname.charAt(0).toUpperCase()}
        </Link>
      </div>
    </div>
  );
};

export default TopNavbar;
