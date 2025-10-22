import React from "react";
import { Bell, Ticket, Calendar, User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
const Profile = () => {
  const { user, loading, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };
  // Sample data
  const purchasedPasses = [
    { event: "TechFest 2025", date: "Dec 10, 2025" },
    { event: "CodeCon 2025", date: "Jan 15, 2025" },
  ];

  const yourEvents = [
    { event: "Hackathon 2025", date: "Nov 20, 2025" },
    { event: "AI Workshop", date: "Dec 5, 2025" },
  ];

  return (
    <div className="w-full min-h-[100dvh] bg-[#0e0e0e] text-white font-space flex flex-col relative">
      {loading && (
        <div className="absolute z-50 flex bg-black/75 inset-0 justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      )}
      {/* Main Scrollable Content */}
      <div className="pt-[100px] px-6 flex-1 overflow-y-auto pb-24">
        {/* Profile Header Card */}
        <div className="w-full bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/10 shadow-md flex justify-between items-center overflow-hidden">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-purple-700 flex justify-center items-center text-white text-2xl font-bold">
              {user?.fullname.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-semibold"></h2>
              <p className="text-lg">{user?.fullname}</p>
              <p className="max-w-[200px] text-white/50 text-sm ">
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Purchased Passes Section */}
        <div className="mt-8">
          <h3 className="text-lg font-forum mb-3 flex items-center gap-2">
            <Ticket size={18} /> Purchased Passes
          </h3>
          <div className="flex flex-col gap-3">
            {purchasedPasses.map((pass, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md p-4 rounded-2xl flex justify-between items-center border border-white/10"
              >
                <div>
                  <p className="font-semibold">{pass.event}</p>
                  <p className="text-sm text-gray-400">{pass.date}</p>
                </div>
                <button className="px-3 py-1 rounded-full bg-purple-700 text-white text-sm font-semibold">
                  View
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Your Events Section */}
        <div className="mt-8">
          <h3 className="text-lg font-forum mb-3 flex items-center gap-2">
            <Calendar size={18} /> Your Events
          </h3>
          <div className="flex flex-col gap-3">
            {yourEvents.map((event, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md p-4 rounded-2xl flex justify-between items-center border border-white/10"
              >
                <div>
                  <p className="font-semibold">{event.event}</p>
                  <p className="text-sm text-gray-400">{event.date}</p>
                </div>
                <button className="px-3 py-1 rounded-full bg-purple-700 text-white text-sm font-semibold">
                  Manage
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Account Settings Section */}
        <div className="mt-8">
          <h3 className="text-lg font-forum mb-3 flex items-center gap-2">
            <User size={18} /> Account Settings
          </h3>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex flex-col gap-4 border border-white/10">
            <div className="flex justify-between items-center">
              <p className="text-sm">Edit Profile</p>
              <button className="px-3 py-1 rounded-full bg-purple-700 text-white text-sm font-semibold">
                Edit
              </button>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm">Change Password</p>
              <button className="px-3 py-1 rounded-full bg-purple-700 text-white text-sm font-semibold">
                Change
              </button>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm">Email Preferences</p>
              <button className="px-3 py-1 rounded-full bg-purple-700 text-white text-sm font-semibold">
                Update
              </button>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-8">
          <button
            onClick={handleLogout}
            className="w-full py-3 bg-red-600 rounded-2xl font-semibold hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
