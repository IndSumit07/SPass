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
  // Create Event Function
  const navigate = useNavigate();
  const createEvent = async (
    eventName,
    description,
    startDate,
    endDate,
    locationName,
    locationAddress,
    venue,
    organisationName,
    capacity,
    isRegistrationOpen,
    status,
    coverImage,
    logo,
    ticketType,
    ticketPrice,
    registrationDeadline
  ) => {
    setLoading(true);

    try {
      const formData = new FormData();

      // Append all fields
      formData.append("eventName", eventName);
      formData.append("description", description);
      formData.append("startDate", startDate);
      formData.append("endDate", endDate);
      formData.append("locationName", locationName);
      formData.append("locationAddress", locationAddress);
      formData.append("venue", venue);
      formData.append("organisationName", organisationName);
      formData.append("capacity", capacity);
      formData.append("isRegistrationOpen", isRegistrationOpen);
      formData.append("status", status);
      formData.append("ticketType", ticketType);
      formData.append("ticketPrice", ticketPrice);
      formData.append("registrationDeadline", registrationDeadline);

      // Append files if provided
      if (coverImage) {
        if (coverImage.size > 5 * 1024 * 1024)
          return toast.error("Cover image must be under 5MB");
        formData.append("coverImage", coverImage);
      }

      if (logo) {
        if (logo.size > 2 * 1024 * 1024)
          return toast.error("Logo must be under 2MB");
        formData.append("logo", logo);
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
        location.reload();
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
        console.log(data.events);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserEvents = async () => {
    setLoading(true);
    if (user?.role === "user") {
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
        console.log(data.events);
      }
    } catch (error) {
      console.log(error.message);
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
  };

  return (
    <EventWalaContext.Provider value={value}>
      {children}
    </EventWalaContext.Provider>
  );
};

export default EventContext;
