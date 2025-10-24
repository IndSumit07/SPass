import React, { useState } from "react";
import { useEvent } from "../contexts/EventContext";
import { useAuth } from "../contexts/AuthContext";
import {
  CalendarDays,
  MapPin,
  Upload,
  Loader2,
  Plus,
  X,
  LogOut,
  Shield,
  Crown,
  Users,
  Clock,
  Edit,
  Trash2,
  Settings,
  BarChart3,
} from "lucide-react";

const Profile = () => {
  const { createEvent, userEvents } = useEvent();
  const { user, loading, logout } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState("events");

  const [form, setForm] = useState({
    eventName: "",
    description: "",
    startDate: "",
    endDate: "",
    locationName: "",
    locationAddress: "",
    venue: "",
    organisationName: "",
    capacity: "",
    isRegistrationOpen: true,
    status: "draft",
    ticketType: "Free",
    ticketPrice: 0,
    registrationDeadline: "",
    coverImage: null,
    logo: null,
  });

  const themeColors = {
    gold: {
      card: "bg-gradient-to-br from-yellow-500/10 to-amber-500/5 border-yellow-500/20",
      button: "bg-gradient-to-r from-yellow-500 to-amber-500",
      text: "text-yellow-400",
      accent: "text-yellow-300",
    },
    purple: {
      card: "bg-gradient-to-br from-purple-500/10 to-pink-500/5 border-purple-500/20",
      button: "bg-gradient-to-r from-purple-500 to-pink-500",
      text: "text-purple-400",
      accent: "text-purple-300",
    },
    blue: {
      card: "bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border-blue-500/20",
      button: "bg-gradient-to-r from-blue-500 to-cyan-500",
      text: "text-blue-400",
      accent: "text-blue-300",
    },
  };

  // Check if user is admin
  const isAdmin = user?.role === "admin";

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
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

  // Get theme based on event index
  const getEventTheme = (index) => {
    const themes = ["gold", "purple", "blue"];
    return themes[index % themes.length];
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setForm({ ...form, [name]: files[0] });
    } else if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      alert("Only administrators can create events.");
      return;
    }

    await createEvent(
      form.eventName,
      form.description,
      form.startDate,
      form.endDate,
      form.locationName,
      form.locationAddress,
      form.venue,
      form.organisationName,
      form.capacity,
      form.isRegistrationOpen,
      form.status,
      form.coverImage,
      form.logo,
      form.ticketType,
      form.ticketPrice,
      form.registrationDeadline
    );
    setShowForm(false);
    setForm({
      eventName: "",
      description: "",
      startDate: "",
      endDate: "",
      locationName: "",
      locationAddress: "",
      venue: "",
      organisationName: "",
      capacity: "",
      isRegistrationOpen: true,
      status: "draft",
      ticketType: "Free",
      ticketPrice: 0,
      registrationDeadline: "",
      coverImage: null,
      logo: null,
    });
  };

  const handleLogout = async () => {
    await logout();
  };

  const getFileName = (file) => {
    return file ? file.name : "No file selected";
  };

  // Stats for admin dashboard
  const dashboardStats = userEvents
    ? [
        {
          label: "Total Events",
          value: userEvents.length,
          icon: CalendarDays,
          color: "text-purple-400",
        },
        {
          label: "Total Attendees",
          value: userEvents.reduce(
            (sum, event) => sum + (event.attendees?.length || 0),
            0
          ),
          icon: Users,
          color: "text-blue-400",
        },
        {
          label: "Published",
          value: userEvents.filter((event) => event.status === "published")
            .length,
          icon: BarChart3,
          color: "text-green-400",
        },
        {
          label: "Draft",
          value: userEvents.filter((event) => event.status === "draft").length,
          icon: Settings,
          color: "text-yellow-400",
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white py-[80px]">
      {loading && (
        <div className="fixed inset-0 bg-black/75 flex justify-center items-center z-50">
          <div className="animate-spin h-8 w-8 rounded-full border-b-2 border-purple-500"></div>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-white/10 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-xl">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold">Dashboard</h1>
                <p className="text-gray-400 text-sm">
                  Welcome back, {user?.fullname}
                </p>
              </div>
            </div>
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
                isAdmin
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  : "bg-gray-500/20 text-gray-300 border border-gray-500/30"
              }`}
            >
              {isAdmin ? <Crown size={16} /> : <Shield size={16} />}
              {isAdmin ? "Administrator" : "User"}
            </div>

            <div className="flex w-full items-center gap-3 justify-center">
              {isAdmin && (
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:scale-105 transition-transform flex items-center gap-2"
                >
                  {showForm ? <X size={18} /> : <Plus size={18} />}
                  {showForm ? "Cancel" : "New Event"}
                </button>
              )}
              <button
                onClick={handleLogout}
                className="bg-white/5 border border-white/10 text-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Dashboard Stats */}
        {isAdmin && userEvents && userEvents.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {dashboardStats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-xl p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                    <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color} opacity-60`} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Event Creation Form */}
        {isAdmin && showForm && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-yellow-500 to-amber-500 p-2 rounded-lg">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Create New Event</h2>
                <p className="text-gray-400 text-sm">
                  Fill in the event details below
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Event Name *
                    </label>
                    <input
                      type="text"
                      name="eventName"
                      value={form.eventName}
                      onChange={handleChange}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter event name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Organization *
                    </label>
                    <input
                      type="text"
                      name="organisationName"
                      value={form.organisationName}
                      onChange={handleChange}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Organization name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      rows={3}
                      value={form.description}
                      onChange={handleChange}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      placeholder="Describe your event"
                    />
                  </div>
                </div>

                {/* Event Details */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Start Date & Time *
                      </label>
                      <input
                        type="datetime-local"
                        name="startDate"
                        value={form.startDate}
                        onChange={handleChange}
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        End Date & Time *
                      </label>
                      <input
                        type="datetime-local"
                        name="endDate"
                        value={form.endDate}
                        onChange={handleChange}
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Venue *
                    </label>
                    <input
                      type="text"
                      name="venue"
                      value={form.venue}
                      onChange={handleChange}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Event venue"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Capacity
                      </label>
                      <input
                        type="number"
                        name="capacity"
                        value={form.capacity}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Number of attendees"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Status
                      </label>
                      <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* File Uploads */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Cover Image
                  </label>
                  <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-purple-400/50 transition-colors bg-white/5">
                    <input
                      type="file"
                      name="coverImage"
                      accept="image/*"
                      onChange={handleChange}
                      className="hidden"
                      id="coverImage"
                    />
                    <label
                      htmlFor="coverImage"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Upload className="text-purple-400 mb-3" size={24} />
                      <span className="text-gray-300 font-medium mb-1">
                        Upload cover image
                      </span>
                      <span className="text-gray-400 text-sm mb-2">
                        PNG, JPG, JPEG up to 10MB
                      </span>
                      <span className="text-purple-300 text-sm bg-purple-500/20 px-3 py-1 rounded-full">
                        {getFileName(form.coverImage)}
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Event Logo
                  </label>
                  <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-pink-400/50 transition-colors bg-white/5">
                    <input
                      type="file"
                      name="logo"
                      accept="image/*"
                      onChange={handleChange}
                      className="hidden"
                      id="logo"
                    />
                    <label
                      htmlFor="logo"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Upload className="text-pink-400 mb-3" size={24} />
                      <span className="text-gray-300 font-medium mb-1">
                        Upload event logo
                      </span>
                      <span className="text-gray-400 text-sm mb-2">
                        PNG, JPG, JPEG up to 5MB
                      </span>
                      <span className="text-pink-300 text-sm bg-pink-500/20 px-3 py-1 rounded-full">
                        {getFileName(form.logo)}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg font-medium hover:scale-105 transition-transform flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Creating Event...
                    </>
                  ) : (
                    "Create Event"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* User's Events Section */}
        {isAdmin && userEvents && userEvents.length > 0 && !showForm && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold">Your Events</h2>
                <p className="text-gray-400 text-sm mt-1">
                  Manage and track your created events
                </p>
              </div>
              <div className="text-sm text-gray-400">
                {userEvents.length} event{userEvents.length !== 1 ? "s" : ""}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {userEvents.map((event, index) => {
                const theme = themeColors[getEventTheme(index)];
                return (
                  <div
                    key={event._id}
                    className={`${theme.card} border rounded-xl overflow-hidden hover:scale-105 transition-transform duration-200`}
                  >
                    {/* Event Header */}
                    <div className="h-32 bg-gradient-to-r from-gray-800 to-gray-700 relative">
                      {event.coverImage && (
                        <img
                          src={event.coverImage}
                          alt={event.eventName}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute top-3 right-3 flex gap-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            event.status === "published"
                              ? "bg-green-500/20 text-green-300"
                              : event.status === "ongoing"
                              ? "bg-blue-500/20 text-blue-300"
                              : event.status === "completed"
                              ? "bg-gray-500/20 text-gray-300"
                              : "bg-yellow-500/20 text-yellow-300"
                          }`}
                        >
                          {event.status}
                        </span>
                      </div>
                    </div>

                    {/* Event Content */}
                    <div className="p-4">
                      <div className="mb-3">
                        <h3
                          className={`font-semibold text-lg mb-1 ${theme.text}`}
                        >
                          {event.eventName}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {event.organisationName}
                        </p>
                      </div>

                      {/* Event Details */}
                      <div className="space-y-2 text-sm text-gray-300 mb-4">
                        <div className="flex items-center gap-2">
                          <CalendarDays size={14} />
                          <span>{formatDate(event.startDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={14} />
                          <span>{formatTime(event.startDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={14} />
                          <span className="truncate">
                            {event.venue || event.location?.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users size={14} />
                          <span>
                            {event.attendees?.length || 0} / {event.capacity}{" "}
                            attendees
                          </span>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex justify-between items-center pt-3 border-t border-white/10">
                        <div
                          className={`text-sm font-medium ${
                            event.ticketType === "Free"
                              ? "text-green-400"
                              : "text-yellow-400"
                          }`}
                        >
                          {event.ticketType === "Free"
                            ? "Free"
                            : `₹${event.ticketPrice}`}
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors">
                            <Edit size={16} />
                          </button>
                          <button className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!showForm && (!userEvents || userEvents.length === 0) && (
          <div className="text-center py-12">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-12 max-w-md mx-auto">
              {isAdmin ? (
                <>
                  <div className="bg-gradient-to-r from-yellow-500 to-amber-500 p-3 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    No Events Created
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Start by creating your first event to manage registrations
                    and digital passes.
                  </p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:scale-105 transition-transform"
                  >
                    Create Your First Event
                  </button>
                </>
              ) : (
                <>
                  <div className="bg-gradient-to-r from-gray-500 to-gray-600 p-3 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">User Dashboard</h3>
                  <p className="text-gray-400 mb-4">
                    Browse and register for events. Event creation requires
                    administrator privileges.
                  </p>
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-sm">
                    <p className="text-yellow-300">
                      <strong>Need to host events?</strong> Contact your
                      administrator for access.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
