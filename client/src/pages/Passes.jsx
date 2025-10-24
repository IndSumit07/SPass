import React, { useState } from "react";
import { usePass } from "../contexts/PassContext";
import { useAuth } from "../contexts/AuthContext";
import {
  Eye,
  Download,
  CalendarDays,
  MapPin,
  Clock,
  Users,
  QrCode,
  X,
  User,
  Crown,
} from "lucide-react";

const Passes = () => {
  const { userPasses, passLoadingState } = usePass();
  const [selectedPass, setSelectedPass] = useState(null);
  const [showPassModal, setShowPassModal] = useState(false);

  const themeColors = {
    gold: {
      card: "from-[#2a1a00]/80 to-[#b8860b]/40 border-[#FFD700]/50",
      button: "from-[#FFD700] to-[#C5A100]",
      text: "text-yellow-400",
      accent: "text-yellow-300",
    },
    purple: {
      card: "from-[#2a003a]/80 to-[#8b00b8]/40 border-purple-500/50",
      button: "from-[#8B5CF6] to-[#7C3AED]",
      text: "text-purple-400",
      accent: "text-purple-300",
    },
    blue: {
      card: "from-[#001b3a]/80 to-[#004aad]/40 border-blue-400/50",
      button: "from-[#3B82F6] to-[#1D4ED8]",
      text: "text-blue-400",
      accent: "text-blue-300",
    },
    teal: {
      card: "from-[#002b2b]/80 to-[#00bfa6]/40 border-teal-400/50",
      button: "from-[#00bfa6] to-[#00a896]",
      text: "text-teal-400",
      accent: "text-teal-300",
    },
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format time for display
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get theme based on pass index
  const getPassTheme = (index) => {
    const themes = ["gold", "purple", "blue", "teal"];
    return themes[index % themes.length];
  };

  const handleViewPass = (pass) => {
    setSelectedPass(pass);
    setShowPassModal(true);
  };

  const closePassModal = () => {
    setShowPassModal(false);
    setSelectedPass(null);
  };

  const downloadPass = (pass) => {
    if (pass?.passImage) {
      const link = document.createElement("a");
      link.href = pass.passImage;
      link.download = `pass-${pass.passId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (passLoadingState) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center">
        <div className="animate-spin h-12 w-12 rounded-full border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[100dvh] bg-[#0e0e0e] text-white font-space py-6 relative">
      <div className="px-6 pt-20 pb-16 flex-1 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-forum mb-2 tracking-wide">
              My Passes{" "}
              <span className="text-gradient bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-400 bg-clip-text text-transparent">
                🎫
              </span>
            </h2>
            <p className="text-gray-400 text-sm">
              {userPasses?.length || 0} passes issued
            </p>
          </div>
        </div>

        {/* Passes Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {userPasses?.map((pass, index) => {
            const theme = themeColors[getPassTheme(index)];
            return (
              <div
                key={pass._id}
                className={`bg-gradient-to-br ${theme.card} backdrop-blur-xl border ${theme.border} rounded-2xl overflow-hidden shadow-xl hover:scale-105 transition-transform duration-200`}
              >
                {/* Pass Header */}
                <div className="p-5 border-b border-white/10">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3
                        className={`text-xl font-bold tracking-wide mb-2 ${theme.text}`}
                      >
                        {pass.event.eventName}
                      </h3>
                      <p className="text-gradient bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent text-sm mb-1">
                        {pass.event.organisationName}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-green-300 text-sm font-semibold">
                          {pass.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="bg-white/10 p-2 rounded-lg">
                      <QrCode size={20} className={theme.accent} />
                    </div>
                  </div>

                  {/* Pass ID */}
                  <div className="bg-black/30 rounded-lg p-3 border border-white/10">
                    <p className="text-gray-400 text-xs mb-1">Pass ID</p>
                    <p className="font-mono text-sm text-white">
                      {pass.passId}
                    </p>
                  </div>
                </div>

                {/* Event Details */}
                <div className="p-5">
                  <div className="space-y-3 text-sm text-gray-300 mb-4">
                    <div className="flex items-center gap-2">
                      <CalendarDays size={16} />
                      <span className="text-yellow-300">
                        {formatDate(pass.event.startDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span className="text-pink-300">
                        {formatTime(pass.event.startDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      <span className="text-green-300">{pass.event.venue}</span>
                    </div>
                    {pass.seatNumber && (
                      <div className="flex items-center gap-2">
                        <Users size={16} />
                        <span className="text-blue-300">
                          Seat: {pass.seatNumber}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Issue Date */}
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10 mb-4">
                    <p className="text-gray-400 text-xs mb-1">Issued On</p>
                    <p className="text-white text-sm">
                      {new Date(pass.issuedAt).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleViewPass(pass)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors border border-white/20"
                    >
                      <Eye size={16} />
                      View
                    </button>
                    <button
                      onClick={() => downloadPass(pass)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:scale-105 transition-transform"
                    >
                      <Download size={16} />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {(!userPasses || userPasses.length === 0) && (
          <div className="text-center py-12">
            <div className="bg-gradient-to-br from-purple-900/50 via-pink-900/50 to-yellow-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-forum mb-2 text-gradient bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                No Passes Yet
              </h3>
              <p className="text-gray-400 mb-4">
                You haven't registered for any events yet. Browse events and get
                your first pass!
              </p>
              <button className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-black font-semibold hover:scale-105 transition-transform">
                Browse Events
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Pass Detail Modal */}
      {showPassModal && selectedPass && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-50 p-4">
          <div className="relative bg-gradient-to-br from-[#1a0f2c] to-[#2d1b4e] backdrop-blur-xl border border-purple-500/30 rounded-2xl w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={closePassModal}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10 hover:bg-white/10 p-2 rounded-full"
            >
              <X size={24} />
            </button>

            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
                  <QrCode className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent">
                    {selectedPass.event.eventName}
                  </h2>
                  <p className="text-gray-300">
                    {selectedPass.event.organisationName}
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Pass Visual */}
                <div className="space-y-6">
                  {/* Pass Image */}
                  <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-500/20">
                    <div className="text-center mb-4">
                      <h3 className="text-white font-bold text-lg mb-2">
                        Digital Pass
                      </h3>
                      <div className="inline-flex items-center gap-2 bg-green-500/20 px-3 py-1 rounded-full">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-green-300 text-sm font-semibold">
                          VALID • {selectedPass.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                      <img
                        src={selectedPass.passImage}
                        alt="Digital Pass"
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="bg-gradient-to-br from-[#0f0820] to-[#1e1138] rounded-2xl p-6 border border-purple-500/20">
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                      <QrCode size={20} />
                      Quick Scan
                    </h3>
                    <div className="flex flex-col items-center">
                      <div className="bg-white p-4 rounded-lg mb-3">
                        <img
                          src={selectedPass.qrCodeData}
                          alt="QR Code"
                          className="w-40 h-40"
                        />
                      </div>
                      <p className="text-gray-400 text-sm text-center">
                        Scan at event entrance
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="space-y-6">
                  {/* Attendee Info */}
                  <div className="bg-gradient-to-br from-[#0f0820] to-[#1e1138] rounded-2xl p-6 border border-purple-500/20">
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                      <User size={20} />
                      Attendee Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Full Name</p>
                        <p className="text-white font-semibold text-lg">
                          {selectedPass.userId.fullname}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Email</p>
                        <p className="text-white font-medium">
                          {selectedPass.userId.email}
                        </p>
                      </div>
                      {selectedPass.seatNumber && (
                        <div>
                          <p className="text-gray-400 text-sm mb-1">
                            Seat Assignment
                          </p>
                          <div className="bg-yellow-500/20 border border-yellow-500/30 px-4 py-3 rounded-lg">
                            <p className="text-yellow-400 font-bold text-center text-lg">
                              {selectedPass.seatNumber}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="bg-gradient-to-br from-[#0f0820] to-[#1e1138] rounded-2xl p-6 border border-purple-500/20">
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                      <CalendarDays size={20} />
                      Event Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-white/10">
                        <span className="text-gray-400">Date</span>
                        <span className="text-white font-semibold">
                          {formatDate(selectedPass.event.startDate)}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/10">
                        <span className="text-gray-400">Time</span>
                        <span className="text-white">
                          {formatTime(selectedPass.event.startDate)}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/10">
                        <span className="text-gray-400">Venue</span>
                        <span className="text-white text-right">
                          {selectedPass.event.venue}
                        </span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-400">Pass ID</span>
                        <span className="text-purple-300 font-mono text-sm">
                          {selectedPass.passId}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Issue Details */}
                  <div className="bg-gradient-to-br from-[#0f0820] to-[#1e1138] rounded-2xl p-6 border border-purple-500/20">
                    <h3 className="text-white font-bold text-lg mb-4">
                      Pass Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Issued On</span>
                        <span className="text-white">
                          {new Date(selectedPass.issuedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status</span>
                        <span className="text-green-400 font-semibold">
                          {selectedPass.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8 pt-6 border-t border-white/10">
                <button
                  onClick={() => downloadPass(selectedPass)}
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-purple-500/25 font-semibold text-lg"
                >
                  <Download size={20} />
                  Download Pass
                </button>
                <button
                  onClick={closePassModal}
                  className="flex-1 px-6 py-4 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-200 border border-white/20 font-semibold text-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Passes;
