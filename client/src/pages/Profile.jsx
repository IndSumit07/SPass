import React, { useState } from "react";
import { useEvent } from "../contexts/EventContext";
import { useAuth } from "../contexts/AuthContext";
import { usePass } from "../contexts/PassContext";
import QRScanner from "../components/QRScanner";
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
  IndianRupee,
  QrCode,
  UserCheck,
} from "lucide-react";
import { toast } from "react-toastify";

const Profile = () => {
  const {
    createEvent,
    updateEvent,
    deleteEvent,
    userEvents,
    editingEvent,
    setEventForEditing,
    cancelEditing,
  } = useEvent();
  const { user, loading, logout } = useAuth();
  const { scanPass, startScanning, stopScanning, scanning } = usePass();

  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState("events");
  const [formLoading, setFormLoading] = useState(false);
  const [manageEvent, setManageEvent] = useState(null);
  const [showScanner, setShowScanner] = useState(false);

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
    if (!dateString) return "TBD";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format time for display
  const formatTime = (dateString) => {
    if (!dateString) return "TBD";
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

  // Load event data into form for editing
  const handleEdit = (event) => {
    setEventForEditing(event);
    setForm({
      eventName: event.eventName || "",
      description: event.description || "",
      startDate: event.startDate
        ? new Date(event.startDate).toISOString().slice(0, 16)
        : "",
      endDate: event.endDate
        ? new Date(event.endDate).toISOString().slice(0, 16)
        : "",
      locationName: event.location?.name || "",
      locationAddress: event.location?.address || "",
      venue: event.venue || "",
      organisationName: event.organisationName || "",
      capacity: event.capacity || "",
      isRegistrationOpen: event.isRegistrationOpen || true,
      status: event.status || "draft",
      ticketType: event.ticketType || "Free",
      ticketPrice: event.ticketPrice || 0,
      registrationDeadline: event.registrationDeadline
        ? new Date(event.registrationDeadline).toISOString().slice(0, 16)
        : "",
      coverImage: event.coverImage || null,
    });
    setShowForm(true);
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

    setFormLoading(true);
    try {
      // Create properly formatted event data
      const eventData = {
        eventName: form.eventName.trim(),
        description: form.description.trim(),
        startDate: form.startDate,
        endDate: form.endDate,
        locationName: form.locationName.trim(),
        locationAddress: form.locationAddress.trim(),
        venue: form.venue.trim(),
        organisationName: form.organisationName.trim(),
        capacity: form.capacity ? parseInt(form.capacity) : 0,
        isRegistrationOpen: form.isRegistrationOpen,
        status: form.status,
        ticketType: form.ticketType,
        ticketPrice:
          form.ticketType === "Paid" ? parseFloat(form.ticketPrice) : 0,
        registrationDeadline: form.registrationDeadline || null,
        coverImage: form.coverImage,
      };

      // Validate required fields
      if (
        !eventData.eventName ||
        !eventData.organisationName ||
        !eventData.startDate ||
        !eventData.endDate
      ) {
        toast.error("Please fill in all required fields");
        setFormLoading(false);
        return;
      }

      if (editingEvent) {
        await updateEvent(editingEvent._id, eventData);
      } else {
        await createEvent(eventData);
      }

      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error("Error saving event:", error);
      toast.error("Failed to save event. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const resetForm = () => {
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
    });
    cancelEditing();
  };

  const handleDelete = async (eventId) => {
    await deleteEvent(eventId);
  };

  const handleManage = (event) => {
    setManageEvent(event);
    setActiveTab("manage");
  };

  const handleScan = async (passId, eventId) => {
    const result = await scanPass(passId, eventId);
    if (result) {
      setShowScanner(false);
    }
  };

  const handleStartScan = () => {
    setShowScanner(true);
    startScanning();
  };

  const handleCloseScanner = () => {
    setShowScanner(false);
    stopScanning();
  };

  const handleLogout = async () => {
    await logout();
  };

  const getFileName = (file) => {
    if (!file) return "No file selected";
    return typeof file === "string" ? "Current image" : file.name;
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

      {/* QR Scanner Modal */}
      {showScanner && manageEvent && (
        <QRScanner
          onScan={handleScan}
          onClose={handleCloseScanner}
          eventId={manageEvent._id}
        />
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
              {isAdmin && !showForm && !manageEvent && (
                <button
                  onClick={() => {
                    resetForm();
                    setShowForm(true);
                  }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:scale-105 transition-transform flex items-center gap-2"
                >
                  <Plus size={18} />
                  New Event
                </button>
              )}
              {(showForm || manageEvent) && (
                <button
                  onClick={() => {
                    setShowForm(false);
                    setManageEvent(null);
                    setActiveTab("events");
                    resetForm();
                  }}
                  className="bg-white/5 border border-white/10 text-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-white/10 transition-colors flex items-center gap-2"
                >
                  <X size={18} />
                  Back to Events
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
        {/* Manage Event Section */}
        {manageEvent && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 p-2 rounded-lg">
                <UserCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">
                  Manage {manageEvent.eventName}
                </h2>
                <p className="text-gray-400 text-sm">
                  Scan passes and manage attendees
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 text-center">
                <Users className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-blue-400 mb-1">
                  {manageEvent.attendees?.length || 0}
                </h3>
                <p className="text-gray-400 text-sm">Total Attendees</p>
              </div>

              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 text-center">
                <UserCheck className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-green-400 mb-1">
                  {manageEvent.passes?.filter((p) => p.status === "checked-in")
                    ?.length || 0}
                </h3>
                <p className="text-gray-400 text-sm">Checked In</p>
              </div>

              <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-6 text-center">
                <QrCode className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-purple-400 mb-1">
                  Scan Passes
                </h3>
                <button
                  onClick={handleStartScan}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:scale-105 transition-transform mt-2"
                >
                  Start Scanning
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Event Creation/Edit Form */}
        {isAdmin && showForm && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-yellow-500 to-amber-500 p-2 rounded-lg">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">
                  {editingEvent ? "Edit Event" : "Create New Event"}
                </h2>
                <p className="text-gray-400 text-sm">
                  {editingEvent
                    ? "Update your event details"
                    : "Fill in the event details below"}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ... (keep the existing form fields exactly as they are) ... */}
              {/* All your existing form fields remain the same */}

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="bg-white/5 border border-white/10 text-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg font-medium hover:scale-105 transition-transform flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      {editingEvent ? "Updating Event..." : "Creating Event..."}
                    </>
                  ) : editingEvent ? (
                    "Update Event"
                  ) : (
                    "Create Event"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* User's Events Section */}
        {isAdmin &&
          userEvents &&
          userEvents.length > 0 &&
          !showForm &&
          !manageEvent && (
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

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 px-2 gap-6">
                {userEvents.map((event, index) => {
                  const theme = themeColors[getEventTheme(index)];
                  return (
                    <div
                      key={event._id}
                      className={`${theme.card} border rounded-xl overflow-hidden hover:scale-105 transition-transform duration-200`}
                    >
                      {/* Event Header */}
                      <div className="h-48 bg-gradient-to-r from-gray-800 to-gray-700 relative">
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
                            <button
                              onClick={() => handleManage(event)}
                              className="p-2 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors"
                              title="Manage Event"
                            >
                              <UserCheck size={16} />
                            </button>
                            <button
                              onClick={() => handleEdit(event)}
                              className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                              title="Edit Event"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(event._id)}
                              className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                              title="Delete Event"
                            >
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
        {!showForm &&
          !manageEvent &&
          (!userEvents || userEvents.length === 0) && (
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
                      onClick={() => {
                        resetForm();
                        setShowForm(true);
                      }}
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
                    <h3 className="text-xl font-semibold mb-3">
                      User Dashboard
                    </h3>
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
