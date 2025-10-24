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
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useEvent } from "../contexts/EventContext";

const Events = () => {
  const { user, loading } = useAuth();
  const { allEvents } = useEvent();
  const [selectedEvent, setSelectedEvent] = useState(null);

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
    </div>
  );
};

export default Events;
