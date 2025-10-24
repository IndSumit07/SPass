import React, { useState } from "react";
import {
  Bell,
  X,
  MapPin,
  Clock,
  CalendarDays,
  Users,
  Phone,
  User,
  QrCode,
  Download,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useEvent } from "../contexts/EventContext";
import { usePass } from "../contexts/PassContext";

const Events = () => {
  const { user, loading } = useAuth();
  const { allEvents } = useEvent();
  const { issuePass } = usePass();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [issuedPass, setIssuedPass] = useState(null); // New state for storing issued pass
  const [showPassPopup, setShowPassPopup] = useState(false); // New state for pass popup

  const themeColors = {
    gold: {
      card: "from-[#2a1a00]/80 to-[#b8860b]/40 border-[#FFD700]/50",
      button: "from-[#FFD700] to-[#C5A100]",
      text: "text-yellow-400",
    },
    purple: {
      card: "from-[#2a003a]/80 to-[#8b00b8]/40 border-purple-500/50",
      button: "from-[#8B5CF6] to-[#7C3AED]",
      text: "text-purple-400",
    },
    blue: {
      card: "from-[#001b3a]/80 to-[#004aad]/40 border-blue-400/50",
      button: "from-[#3B82F6] to-[#1D4ED8]",
      text: "text-blue-400",
    },
    teal: {
      card: "from-[#002b2b]/80 to-[#00bfa6]/40 border-teal-400/50",
      button: "from-[#00bfa6] to-[#00a896]",
      text: "text-teal-400",
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

  // Get theme based on event data
  const getEventTheme = (event, index) => {
    const themes = ["gold", "purple", "blue", "teal"];
    return themes[index % themes.length];
  };

  const handleGetPass = (event) => setSelectedEvent(event);
  const closeTicket = () => setSelectedEvent(null);
  const closePassPopup = () => {
    setShowPassPopup(false);
    setIssuedPass(null);
  };

  const issue = async (e) => {
    e.preventDefault();
    try {
      const pass = await issuePass(selectedEvent._id);
      if (pass) {
        setIssuedPass(pass);
        setShowPassPopup(true);
        setSelectedEvent(null); // Close event modal
      }
    } catch (error) {
      console.error("Error issuing pass:", error);
    }
  };

  // Download pass as image
  const downloadPass = () => {
    if (issuedPass?.passImage) {
      const link = document.createElement("a");
      link.href = issuedPass.passImage;
      link.download = `pass-${issuedPass.passId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
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
              Upcoming Events{" "}
              <span className="text-gradient bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-400 bg-clip-text text-transparent">
                🎟️
              </span>
            </h2>
            <p className="text-gray-400 text-sm">
              {allEvents?.length || 0} events found
            </p>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {allEvents?.map((event, index) => {
            const theme = themeColors[getEventTheme(event, index)];
            return (
              <div
                key={event._id}
                className={`bg-gradient-to-br ${theme.card} backdrop-blur-xl border ${theme.border} rounded-2xl overflow-hidden shadow-xl hover:scale-105 transition-transform duration-200`}
              >
                {/* Event Image */}
                <div className="h-48 overflow-hidden">
                  {event.coverImage ? (
                    <img
                      src={event.coverImage}
                      alt={event.eventName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-600 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">No Image</span>
                    </div>
                  )}
                </div>

                {/* Event Content */}
                <div className="p-5">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3
                        className={`text-xl font-bold tracking-wide mb-2 ${theme.text}`}
                      >
                        {event.eventName}
                      </h3>
                      <p className="text-gradient bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent text-sm mb-1">
                        {event.organisationName}
                      </p>
                      <p className="text-purple-300 text-sm">
                        {event.location?.name || event.venue}
                      </p>
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="space-y-2 mb-4 text-sm text-gray-300">
                    <div className="flex items-center gap-2">
                      <CalendarDays size={16} />
                      <span className="text-yellow-300">
                        {formatDate(event.startDate)} -{" "}
                        {formatDate(event.endDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span className="text-pink-300">
                        {formatTime(event.startDate)} -{" "}
                        {formatTime(event.endDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      <span className="text-green-300">
                        {event.venue || event.location?.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} />
                      <span>
                        {event.attendees?.length || 0} / {event.capacity}{" "}
                        attendees
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm mb-4 leading-relaxed line-clamp-2">
                    {event.description}
                  </p>

                  {/* Price and Action */}
                  <div className="flex justify-between items-center pt-4 border-t border-white/10">
                    <span className="font-semibold text-lg">
                      {event.ticketType === "Free"
                        ? "🎟️ Free Entry"
                        : `₹${event.ticketPrice}`}
                    </span>
                    <button
                      onClick={() => handleGetPass(event)}
                      className={`px-5 py-2 rounded-full bg-gradient-to-r ${theme.button} text-black font-semibold hover:scale-105 transition-transform`}
                    >
                      Get Pass
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {(!allEvents || allEvents.length === 0) && (
          <div className="text-center py-12">
            <div className="bg-gradient-to-br from-purple-900/50 via-pink-900/50 to-yellow-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 max-w-md mx-auto">
              <CalendarDays
                className="mx-auto text-purple-400 mb-4"
                size={48}
              />
              <h3 className="text-2xl font-forum mb-2 text-gradient bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                No Events Available
              </h3>
              <p className="text-gray-400 mb-4">
                There are no upcoming events at the moment.
              </p>
            </div>
          </div>
        )}

        {/* Host Event CTA */}
        <div className="mt-12 bg-gradient-to-br from-purple-900/50 via-pink-900/50 to-yellow-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-forum mb-2 text-gradient bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Host Your Event
          </h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto leading-relaxed">
            Organize and manage your events seamlessly with digital passes,
            real-time registration, and smart analytics.
          </p>
          <button className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-black font-semibold hover:scale-105 transition-transform">
            Get Started
          </button>
        </div>
      </div>

      {/* Event Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center z-50 p-4">
          <div
            className={`bg-gradient-to-br ${
              themeColors[
                getEventTheme(
                  selectedEvent,
                  allEvents?.findIndex((e) => e._id === selectedEvent._id) || 0
                )
              ].card
            } rounded-2xl p-6 w-full max-w-md ${
              themeColors[
                getEventTheme(
                  selectedEvent,
                  allEvents?.findIndex((e) => e._id === selectedEvent._id) || 0
                )
              ].border
            } shadow-2xl max-h-[90vh] overflow-y-auto`}
          >
            <button
              onClick={closeTicket}
              className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <h2
              className={`text-xl font-semibold mb-1 ${
                themeColors[
                  getEventTheme(
                    selectedEvent,
                    allEvents?.findIndex((e) => e._id === selectedEvent._id) ||
                      0
                  )
                ].text
              }`}
            >
              🎫 {selectedEvent.eventName}
            </h2>
            <p className="text-gradient bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent text-sm mb-1">
              {selectedEvent.organisationName}
            </p>
            <p className="text-sm text-purple-300 mb-2">
              {selectedEvent.location?.name || selectedEvent.venue}
            </p>

            <div className="bg-white/10 rounded-xl p-3 text-sm space-y-1 border border-white/10 mb-4">
              <p className="flex items-center gap-2">
                <CalendarDays size={15} />{" "}
                <span className="text-yellow-300">
                  {formatDate(selectedEvent.startDate)}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Clock size={15} />{" "}
                <span className="text-pink-300">
                  {formatTime(selectedEvent.startDate)} -{" "}
                  {formatTime(selectedEvent.endDate)}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin size={15} />{" "}
                <span className="text-green-300">
                  {selectedEvent.venue || selectedEvent.location?.name}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Users size={15} />{" "}
                <span>
                  {selectedEvent.attendees?.length || 0} /{" "}
                  {selectedEvent.capacity} attendees
                </span>
              </p>
              <p className="flex items-center gap-2">
                <User size={15} />{" "}
                <span>Organizer: {selectedEvent.createdBy?.email}</span>
              </p>
              {selectedEvent.registrationDeadline && (
                <p className="flex items-center gap-2 text-orange-300">
                  <Clock size={15} /> Register by:{" "}
                  {formatDate(selectedEvent.registrationDeadline)}
                </p>
              )}
            </div>

            <p className="text-gray-300 text-sm mb-4 leading-relaxed">
              {selectedEvent.description}
            </p>

            <div className="flex justify-between items-center pt-4 border-t border-white/10">
              <div>
                <p className="text-lg font-bold">
                  {selectedEvent.ticketType === "Free"
                    ? "Free Entry"
                    : `₹${selectedEvent.ticketPrice}`}
                </p>
                <p className="text-gray-400 text-sm">
                  {selectedEvent.status === "draft" && "Draft • "}
                  {selectedEvent.isRegistrationOpen
                    ? "Registration Open"
                    : "Registration Closed"}
                </p>
              </div>
              <button
                onClick={issue}
                className={`px-6 py-2 rounded-full bg-gradient-to-r ${
                  themeColors[
                    getEventTheme(
                      selectedEvent,
                      allEvents?.findIndex(
                        (e) => e._id === selectedEvent._id
                      ) || 0
                    )
                  ].button
                } text-black font-semibold hover:scale-105 transition-transform`}
              >
                {selectedEvent.ticketType === "Free" ? "Register" : "Buy Now"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showPassPopup && issuedPass && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-50 p-4 overflow-y-auto py-20">
          <div className="relative bg-gradient-to-br from-[#1a0f2c] to-[#2d1b4e] backdrop-blur-xl border border-purple-500/30 rounded-2xl w-full max-w-5xl shadow-2xl mx-auto my-8 p-6 sm:p-8 top-[640px] ">
            {/* Close Button */}
            <button
              onClick={closePassPopup}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10 hover:bg-white/10 p-1 rounded-full"
            >
              <X size={24} />
            </button>

            {/* Header */}
            <div className="text-center mb-6 sm:mb-10">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <QrCode className="text-white" size={32} />
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent mb-2">
                🎉 Pass Created Successfully!
              </h2>
              <p className="text-gray-300 text-base sm:text-lg">
                Your digital pass is ready for{" "}
                <span className="text-purple-300 font-semibold">
                  {issuedPass.eventName}
                </span>
              </p>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8">
              {/* Pass Image */}
              <div className="flex flex-col items-center">
                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-4 sm:p-6 border border-purple-500/20 shadow-2xl w-full">
                  <div className="text-center mb-4">
                    <h3 className="text-white font-bold text-lg sm:text-xl mb-1">
                      Your Digital Pass
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Show this at the event entrance
                    </p>
                  </div>
                  <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                    <img
                      src={issuedPass.passImage}
                      alt="Digital Pass"
                      className="w-full h-auto object-contain"
                    />
                  </div>
                  <div className="text-center mt-4">
                    <div className="inline-flex items-center gap-2 bg-purple-500/20 px-4 py-2 rounded-full">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-purple-300 text-sm font-semibold">
                        VALID PASS
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details Section */}
              <div className="space-y-6">
                {/* Attendee Details */}
                <div className="bg-gradient-to-br from-[#0f0820] to-[#1e1138] rounded-2xl p-5 sm:p-6 border border-purple-500/20 shadow-xl">
                  <h3 className="text-white font-bold text-lg sm:text-xl mb-3 flex items-center gap-2">
                    <User size={20} />
                    Attendee Details
                  </h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Full Name</p>
                        <p className="text-white font-semibold">
                          {issuedPass.userId.fullname}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Email</p>
                        <p className="text-white font-medium text-sm break-all">
                          {issuedPass.userId.email}
                        </p>
                      </div>
                    </div>
                    {issuedPass.seatNumber && (
                      <div>
                        <p className="text-gray-400 text-sm mb-1">
                          Seat Assignment
                        </p>
                        <div className="bg-yellow-500/20 border border-yellow-500/30 px-3 py-2 rounded-lg text-center">
                          <p className="text-yellow-400 font-bold">
                            {issuedPass.seatNumber}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Event Details */}
                <div className="bg-gradient-to-br from-[#0f0820] to-[#1e1138] rounded-2xl p-5 sm:p-6 border border-purple-500/20 shadow-xl">
                  <h3 className="text-white font-bold text-lg sm:text-xl mb-3 flex items-center gap-2">
                    <CalendarDays size={20} />
                    Event Information
                  </h3>
                  <div className="space-y-3 text-sm sm:text-base">
                    <div className="flex justify-between py-2 border-b border-white/10">
                      <span className="text-gray-400">Event</span>
                      <span className="text-white font-semibold text-right">
                        {issuedPass.eventName}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/10">
                      <span className="text-gray-400">Organizer</span>
                      <span className="text-purple-300">
                        {issuedPass.organisationName}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/10">
                      <span className="text-gray-400">Date & Time</span>
                      <div className="text-right">
                        <p className="text-white">
                          {formatDate(issuedPass.startDate)}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {formatTime(issuedPass.startDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-400">Venue</span>
                      <span className="text-white text-right">
                        {issuedPass.venue}
                      </span>
                    </div>
                  </div>
                </div>

                {/* QR Code */}
                <div className="bg-gradient-to-br from-[#0f0820] to-[#1e1138] rounded-2xl p-5 sm:p-6 border border-purple-500/20 shadow-xl">
                  <h3 className="text-white font-bold text-lg sm:text-xl mb-3 flex items-center gap-2">
                    <QrCode size={20} />
                    Quick Scan Code
                  </h3>
                  <div className="flex flex-col items-center">
                    <div className="bg-white p-3 rounded-lg mb-3">
                      <img
                        src={issuedPass.qrCodeData}
                        alt="QR Code"
                        className="w-28 h-28 sm:w-32 sm:h-32"
                      />
                    </div>
                    <p className="text-gray-400 text-sm text-center">
                      Pass ID:{" "}
                      <span className="text-purple-300 font-mono">
                        {issuedPass.passId}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button
                onClick={downloadPass}
                className="flex-1 flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-purple-500/25 font-semibold text-base sm:text-lg"
              >
                <Download size={20} />
                Download Pass
              </button>
              <button
                onClick={closePassPopup}
                className="flex-1 px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-200 border border-white/20 font-semibold text-base sm:text-lg hover:scale-105"
              >
                Close
              </button>
            </div>

            {/* Hint */}
            <div className="text-center mt-6 pt-6 border-t border-white/10">
              <div className="inline-flex items-center gap-2 bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/20">
                <span className="text-blue-400">💡</span>
                <p className="text-blue-300 text-sm sm:text-base">
                  Save this pass to your phone for quick access
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
