import React, { useState } from "react";
import { Calendar, Ticket, User, Home } from "lucide-react";
import { Link } from "react-router-dom";

const BottomNavbar = () => {
  const [activeLink, setActiveLink] = useState("Home");
  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#0a0a0a]/70 backdrop-blur-md border-t border-white/10 flex justify-around items-center py-3">
      <Link
        onClick={() => setActiveLink("Home")}
        to="/home"
        className={`flex flex-col items-center ${
          activeLink === "Home" ? "text-purple-400" : "text-gray-400"
        }`}
      >
        <Home size={22} />
        <p className="text-xs mt-1">Home</p>
      </Link>
      <Link
        onClick={() => setActiveLink("Passes")}
        to="/passes"
        className={`flex flex-col items-center ${
          activeLink === "Passes" ? "text-purple-400" : "text-gray-400"
        }`}
      >
        <Ticket size={22} />
        <p className="text-xs mt-1">Passes</p>
      </Link>
      <Link
        onClick={() => setActiveLink("Events")}
        to="/events"
        className={`flex flex-col items-center ${
          activeLink === "Events" ? "text-purple-400" : "text-gray-400"
        }`}
      >
        <Calendar size={22} />
        <p className="text-xs mt-1">Events</p>
      </Link>
      <Link
        onClick={() => setActiveLink("Profile")}
        to="/profile"
        className={`flex flex-col items-center ${
          activeLink === "Profile" ? "text-purple-400" : "text-gray-400"
        }`}
      >
        <User size={22} />
        <p className="text-xs mt-1">Profile</p>
      </Link>
    </div>
  );
};

export default BottomNavbar;
