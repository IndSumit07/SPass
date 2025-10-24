import { Event } from "../models/event.model.js";
import streamifier from "streamifier";
import cloudinary from "../configs/cloudinary.config.js";

// Helper: Upload to Cloudinary
const uploadToCloudinary = (fileBuffer, folder = "events") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (result) resolve(result.secure_url);
        else reject(error);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

// ✅ Create Event
export const createEvent = async (req, res) => {
  try {
    const {
      eventName,
      description,
      startDate,
      endDate,
      locationName,
      locationAddress,
      venue,
      organisationName,
      capacity,
      status,
      ticketPrice,
      ticketType,
      registrationDeadline,
      isRegistrationOpen,
    } = req.body;

    if (!eventName || !organisationName || !ticketType) {
      return res.json({
        success: false,
        message: "All required fields must be filled!",
      });
    }

    const user = req.user;
    if (!user) {
      return res.json({
        success: false,
        message: "Unauthorized, please login to create event",
      });
    }

    let coverImageUrl = null;
    let logoUrl = null;

    if (req.files?.coverImage) {
      coverImageUrl = await uploadToCloudinary(
        req.files.coverImage[0].buffer,
        "events/cover"
      );
    }

    if (req.files?.logo) {
      logoUrl = await uploadToCloudinary(
        req.files.logo[0].buffer,
        "events/logo"
      );
    }

    const location = {
      name: locationName || "",
      address: locationAddress || "",
    };

    const event = await Event.create({
      eventName,
      description,
      startDate,
      endDate,
      location,
      venue,
      organisationName,
      capacity,
      status,
      ticketPrice,
      ticketType,
      registrationDeadline,
      isRegistrationOpen,
      coverImage: coverImageUrl,
      logo: logoUrl,
      createdBy: user._id,
    });

    return res.json({
      success: true,
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    return res.json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("createdBy", "name email");

    if (!events || events.length === 0) {
      return res.json({
        success: true,
        message: "No events found",
        events: [],
      });
    }

    return res.json({
      success: true,
      message: "All events fetched successfully",
      count: events.length,
      events,
    });
  } catch (error) {
    console.error("Error fetching all events:", error);
    return res.json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const getUserEvents = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.json({
        success: false,
        message: "Unauthorized, please login to view your events",
      });
    }

    const events = await Event.find({ createdBy: user._id });

    if (!events || events.length === 0) {
      return res.json({
        success: true,
        message: "You haven’t created any events yet",
        events: [],
      });
    }

    return res.json({
      success: true,
      message: "Your events fetched successfully",
      count: events.length,
      events,
    });
  } catch (error) {
    console.error("Error fetching user events:", error);
    return res.json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
