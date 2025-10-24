import React from "react";
import {
  Calendar,
  Users,
  Star,
  ArrowRight,
  Sparkles,
  Crown,
  Mail,
  Shield,
  Ticket,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

const Homepage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 rounded-full border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const isAdmin = user?.role === "admin";

  const features = [
    {
      icon: <Ticket className="w-6 h-6 md:w-8 md:h-8" />,
      title: "Digital Passes",
      description: "Secure, scannable digital passes for seamless event access",
    },
    {
      icon: <Calendar className="w-6 h-6 md:w-8 md:h-8" />,
      title: "Smart Management",
      description:
        "Complete event lifecycle management from creation to analytics",
    },
    {
      icon: <Users className="w-6 h-6 md:w-8 md:h-8" />,
      title: "Real-time Registration",
      description: "Live attendee tracking and capacity management",
    },
  ];

  const stats = [
    { number: "500+", label: "Events Hosted", color: "text-yellow-400" },
    { number: "10K+", label: "Happy Attendees", color: "text-pink-400" },
    { number: "50+", label: "Organizations", color: "text-purple-400" },
    { number: "98%", label: "Satisfaction Rate", color: "text-green-400" },
  ];

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white py-[80px]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="text-center">
            {/* Logo/Brand */}
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 md:p-4 rounded-2xl">
                <Sparkles className="w-8 h-8 md:w-12 md:h-12 text-white" />
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-forum mb-4 md:mb-6 leading-tight">
              Welcome to{" "}
              <span className="text-gradient bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-400 bg-clip-text text-transparent">
                SPass
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-gray-300 mb-6 md:mb-8 max-w-2xl mx-auto px-4 leading-relaxed">
              Professional event management platform for seamless digital
              passes, real-time registration, and smart event analytics.
            </p>

            {/* Admin Access Message */}
            {user && !isAdmin && (
              <div className="max-w-md mx-auto mb-6 md:mb-8">
                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-4 flex items-center gap-3">
                  <Crown className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                  <div className="text-left">
                    <p className="text-yellow-300 text-sm font-medium">
                      Want to create events?
                    </p>
                    <p className="text-yellow-200/80 text-xs">
                      Contact administrator for hosting privileges
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center px-4">
              {user ? (
                <>
                  <Link
                    to="/events"
                    className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-transform flex items-center justify-center gap-2"
                  >
                    Browse Events <ArrowRight size={18} />
                  </Link>
                  <Link
                    to="/profile"
                    className="w-full sm:w-auto border border-purple-500 text-purple-400 px-6 py-3 rounded-lg font-semibold hover:bg-purple-500/10 transition-colors"
                  >
                    Your Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <button className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-transform">
                    Get Started
                  </button>
                  <button className="w-full sm:w-auto border border-gray-600 text-gray-300 px-6 py-3 rounded-lg font-semibold hover:border-purple-500 hover:text-purple-400 transition-colors">
                    Learn More
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-forum mb-3 md:mb-4">
            Why{" "}
            <span className="text-gradient bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              SPass?
            </span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto px-4">
            Enterprise-grade event management solutions for modern organizations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center hover:scale-105 transition-transform duration-200"
            >
              <div className="text-purple-400 mb-3 sm:mb-4 flex justify-center">
                {feature.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-br from-purple-900/30 via-pink-900/30 to-yellow-900/30 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-2 gap-6 sm:gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div
                  className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 ${stat.color}`}
                >
                  {stat.number}
                </div>
                <div className="text-gray-400 text-sm sm:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="bg-gradient-to-br from-purple-900/40 via-pink-900/40 to-yellow-900/40 border border-white/10 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-forum mb-3 sm:mb-4">
            Ready to Elevate Your Events?
          </h2>
          <p className="text-gray-300 text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
            Join professional organizations using SPass for seamless event
            management and digital pass solutions
          </p>

          {/* Admin Contact for Regular Users */}
          {user && !isAdmin && (
            <div className="max-w-md mx-auto mb-6">
              <div className="bg-black/40 border border-white/10 rounded-xl p-4 flex items-start gap-3">
                <Mail className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <p className="text-purple-300 text-sm font-medium mb-1">
                    Need Event Hosting Access?
                  </p>
                  <p className="text-gray-400 text-xs">
                    Contact your organization administrator to get SPass event
                    creation privileges
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {user ? (
              isAdmin ? (
                <button className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 text-black px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-transform">
                  Create New Event
                </button>
              ) : (
                <button className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-transform">
                  Browse Events
                </button>
              )
            ) : (
              <button className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-transform">
                Sign Up Now
              </button>
            )}
            <button className="w-full sm:w-auto border border-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:border-purple-500 hover:text-purple-400 transition-colors">
              View Demo
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-purple-400" />
            <span className="text-lg font-semibold text-purple-400">SPass</span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2024 SPass. Professional Event Management Platform.{" "}
            <span className="text-purple-400">Secure • Scalable • Smart</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
