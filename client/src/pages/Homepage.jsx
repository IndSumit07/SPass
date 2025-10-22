import React from "react";
import { Bell, Plus } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Homepage = () => {
  const { user, loading } = useAuth();

  // Sample upcoming event data
  const upcomingEvent = {
    name: "TechFest 2025",
    daysLeft: 2,
    hasPass: true,
  };

  const quickActions = [
    { name: "Create Event", icon: "➕", path: "/create-event" },
    { name: "Distribute Passes", icon: "🎫", path: "/distribute" },
    { name: "Scan & Verify", icon: "📱", path: "/scan" },
  ];

  return (
    <div className="w-full min-h-[100dvh] bg-[#0e0e0e] text-white font-space flex flex-col py-5">
      {loading && (
        <div className="absolute z-50 flex bg-black/75 inset-0 justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      )}
      {/* Main Scrollable Content */}

      <div className="pt-20 px-6 flex-1 overflow-y-auto pb-16">
        {/* Highlight / Main Card */}
        <div className="w-full bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/10 shadow-lg mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-100">
                Upcoming Event 🎫
              </h3>
              <p className="text-sm text-gray-400 mt-1">{upcomingEvent.name}</p>
            </div>
            <div className="bg-white/10 p-2 rounded-lg">
              <Bell className="text-white/80 w-5 h-5" />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-4xl font-bold">
              {upcomingEvent.daysLeft} Days Left
            </p>
            <button className="px-5 py-2 rounded-full bg-gradient-to-r from-[#1d0120] to-[#810086] text-sm font-semibold hover:from-[#2a0130] hover:to-[#9a009f] transition-all duration-200">
              {upcomingEvent.hasPass ? "View Pass" : "Get Pass"}
            </button>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="mb-6">
          <h3 className="text-lg font-forum mb-4">What do you need?</h3>
          <div className="grid grid-cols-3 gap-3">
            {quickActions.map((action, index) => (
              <button
                key={action.name}
                className="bg-white/10 backdrop-blur-md p-4 rounded-2xl flex flex-col justify-between items-start border border-white/10 hover:bg-white/15 transition-all duration-200 min-h-[100px] w-full text-left"
                onClick={() => console.log(`Navigate to: ${action.path}`)}
              >
                <p className="text-sm font-medium">{action.name}</p>
                <div className="w-8 h-8 rounded-full bg-white/20 flex justify-center items-center mt-2 text-sm">
                  {action.icon}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Promotion / CTA */}
        <div className="bg-gradient-to-br from-[#1d0120]/60 to-[#810086]/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5 mb-6">
          <h3 className="text-xl font-forum mb-2">Organize Your Next Event</h3>
          <p className="text-sm text-gray-300 mb-4">
            Create and manage your events with smart digital passes.
          </p>
          <button className="px-5 py-2.5 bg-white text-black rounded-full font-semibold hover:bg-gray-100 transition-all duration-200">
            Get Started
          </button>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10">
          <h3 className="text-lg font-forum mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              "You created 'Tech Conference 2024'",
              "15 passes distributed for Summer Meetup",
              "3 new attendees registered today",
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 text-sm text-gray-300"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>{activity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
