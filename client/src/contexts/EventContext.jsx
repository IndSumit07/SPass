import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

// Create Event context
const EventWalaContext = createContext();

// Custom hook for using Event context
export const useEvent = () => {
  const context = useContext(EventWalaContext);
  if (!context) {
    throw new Error("useEvent must be used within an EventProvider");
  }
  return context;
};

const EventContext = ({ children }) => {
  const [allEvents, setAllEvents] = useState(null);
  const [userEvents, setUserEvents] = useState(null);
  const { loading, setLoading, user } = useAuth();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Create Event Function - Accepts object parameter
  const createEvent = async (eventData) => {
    setLoading(true);

    try {
      const formData = new FormData();

      // Append all fields with proper type conversion
      formData.append("eventName", eventData.eventName || "");
      formData.append("description", eventData.description || "");
      formData.append("startDate", eventData.startDate || "");
      formData.append("endDate", eventData.endDate || "");
      formData.append("locationName", eventData.locationName || "");
      formData.append("locationAddress", eventData.locationAddress || "");
      formData.append("venue", eventData.venue || "");
      formData.append("organisationName", eventData.organisationName || "");
      formData.append(
        "capacity",
        eventData.capacity ? Number(eventData.capacity) : 0
      );
      formData.append(
        "isRegistrationOpen",
        Boolean(eventData.isRegistrationOpen)
      );
      formData.append("status", eventData.status || "draft");
      formData.append("ticketType", eventData.ticketType || "Free");
      formData.append(
        "ticketPrice",
        eventData.ticketPrice ? Number(eventData.ticketPrice) : 0
      );
      formData.append(
        "registrationDeadline",
        eventData.registrationDeadline || ""
      );

      // Append files if provided
      if (eventData.coverImage) {
        if (eventData.coverImage.size > 5 * 1024 * 1024) {
          toast.error("Cover image must be under 5MB");
          setLoading(false);
          return;
        }
        formData.append("coverImage", eventData.coverImage);
      }

      const { data } = await axios.post(
        backendUrl + "/api/events/create-event",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message || "Event created successfully!");
        navigate("/events");
        // Don't reload the page, just refetch events
        fetchAllEvents();
        fetchUserEvents();
      } else {
        toast.error(data.message || "Failed to create event!");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error(
        error.response?.data?.message || "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchAllEvents = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(backendUrl + "/api/events/all");
      if (data.success) {
        setAllEvents(data.events);
      }
    } catch (error) {
      console.log("Error fetching events:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserEvents = async () => {
    setLoading(true);
    if (user?.role === "user") {
      setLoading(false);
      return;
    }
    try {
      const { data } = await axios.get(backendUrl + "/api/events/user-events", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        setUserEvents(data.events);
      }
    } catch (error) {
      console.log("Error fetching user events:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllEvents();
    fetchUserEvents();
  }, []);

  const value = {
    createEvent,
    loading,
    allEvents,
    userEvents,
    fetchAllEvents,
    fetchUserEvents,
  };

  return (
    <EventWalaContext.Provider value={value}>
      {children}
    </EventWalaContext.Provider>
  );
};

export default EventContext;
