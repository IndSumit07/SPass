import { Event } from "../models/event.model.js";
import { User } from "../models/user.model.js";
import { PassService } from "../services/pass.service.js";

export const issuePass = async (req, res) => {
  try {
    const { eventId, userId } = req.body;

    const event = await Event.findById(eventId);
    const user = await User.findById(userId);

    if (!event || !user) {
      return res.status(404).json({
        success: false,
        message: "Event or User not found",
      });
    }

    // Check if user already has a pass
    const existingPass = event.passes.find(
      (p) => p.userId.toString() === userId
    );
    if (existingPass) {
      return res.json({
        success: false,
        message: "User already has a pass for this event",
        pass: existingPass,
      });
    }

    if (event.capacity && event.attendees.length >= event.capacity) {
      return res.status(400).json({
        success: false,
        message: "Event is at full capacity",
      });
    }

    const passId = PassService.generatePassId(eventId, userId);
    const qrCodeData = await PassService.generateQRCodeData(
      passId,
      eventId,
      userId
    );
    const passImage = await PassService.createPassImage(event, user, {
      passId,
      qrCodeData,
      seatNumber: `SEAT_${(event.passes.length + 1)
        .toString()
        .padStart(3, "0")}`,
    });

    // Create pass object
    const newPass = {
      userId: userId,
      passId: passId,
      qrCodeData: qrCodeData,
      passImage: passImage,
      status: "issued",
      issuedAt: new Date(),
      seatNumber: `SEAT_${(event.passes.length + 1)
        .toString()
        .padStart(3, "0")}`,
    };

    // Save pass to event
    event.passes.push(newPass);
    event.attendees.push(userId);
    await event.save();

    // Populate user details
    await event.populate("passes.userId", "fullname email");

    const issuedPass = event.passes[event.passes.length - 1];

    res.status(201).json({
      success: true,
      message: "Pass issued successfully",
      pass: {
        ...issuedPass.toObject(),
        eventName: event.eventName,
        organisationName: event.organisationName,
        startDate: event.startDate,
        venue: event.venue,
        user: {
          fullname: user.fullname,
          email: user.email,
        },
      },
    });
  } catch (error) {
    console.error("Error issuing pass:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const scanPass = async (req, res) => {
  try {
    const { passId, eventId } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const pass = event.passes.find((p) => p.passId === passId);
    if (!pass) {
      return res.status(404).json({
        success: false,
        message: "Invalid pass",
      });
    }

    // Check pass status
    if (pass.status === "checked-in") {
      return res.json({
        success: false,
        message: "Pass already used",
        pass: pass,
      });
    }

    if (pass.status === "cancelled" || pass.status === "expired") {
      return res.json({
        success: false,
        message: `Pass ${pass.status}`,
        pass: pass,
      });
    }

    // Update pass status to checked-in
    pass.status = "checked-in";
    pass.checkedInAt = new Date();
    await event.save();

    const user = await User.findById(pass.userId);

    res.json({
      success: true,
      message: "Pass validated successfully",
      pass: {
        ...pass.toObject(),
        user: {
          fullname: user.fullname,
          email: user.email,
        },
        event: {
          name: event.eventName,
          venue: event.venue,
        },
      },
    });
  } catch (error) {
    console.error("Error scanning pass:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getUserPasses = async (req, res) => {
  try {
    const userId = req.user._id;

    const eventsWithPasses = await Event.find({
      "passes.userId": userId,
    }).populate("passes.userId", "fullname email");

    const userPasses = eventsWithPasses.flatMap((event) =>
      event.passes
        .filter((pass) => pass.userId._id.toString() === userId.toString()) // ✅ fixed
        .map((pass) => ({
          ...pass.toObject(),
          event: {
            _id: event._id,
            eventName: event.eventName,
            startDate: event.startDate,
            venue: event.venue,
            organisationName: event.organisationName,
          },
        }))
    );

    res.json({
      success: true,
      passes: userPasses,
    });
  } catch (error) {
    console.error("Error fetching user passes:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
