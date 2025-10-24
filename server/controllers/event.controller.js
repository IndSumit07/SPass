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

    // Validate required fields
    if (!eventName || !organisationName || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message:
          "Event name, organization, start date, and end date are required!",
      });
    }

    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized, please login to create event",
      });
    }

    let coverImageUrl = null;

    if (req.files?.coverImage) {
      try {
        coverImageUrl = await uploadToCloudinary(
          req.files.coverImage[0].buffer,
          "events/cover"
        );
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Failed to upload cover image",
        });
      }
    }

    // Parse and validate dates
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);
    const parsedRegistrationDeadline = registrationDeadline
      ? new Date(registrationDeadline)
      : null;

    if (isNaN(parsedStartDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid start date",
      });
    }

    if (isNaN(parsedEndDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid end date",
      });
    }

    if (
      parsedRegistrationDeadline &&
      isNaN(parsedRegistrationDeadline.getTime())
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid registration deadline date",
      });
    }

    // Parse numeric fields
    const parsedCapacity = capacity ? parseInt(capacity) : 0;
    const parsedTicketPrice = ticketPrice ? parseFloat(ticketPrice) : 0;

    const location = {
      name: locationName || "",
      address: locationAddress || "",
    };

    const event = await Event.create({
      eventName: eventName.trim(),
      description: description?.trim() || "",
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      location,
      venue: venue?.trim() || "",
      organisationName: organisationName.trim(),
      capacity: parsedCapacity,
      status: status || "draft",
      ticketPrice: parsedTicketPrice,
      ticketType: ticketType || "Free",
      registrationDeadline: parsedRegistrationDeadline,
      isRegistrationOpen:
        isRegistrationOpen === "true" || isRegistrationOpen === true,
      coverImage: coverImageUrl,
      createdBy: user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    console.error("Error creating event:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    return res.status(500).json({
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
    return res.status(500).json({
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
      return res.status(401).json({
        success: false,
        message: "Unauthorized, please login to view your events",
      });
    }

    const events = await Event.find({ createdBy: user._id });

    if (!events || events.length === 0) {
      return res.json({
        success: true,
        message: "You haven't created any events yet",
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
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
