import mongoose from "mongoose";

const passSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  passId: { type: String, unique: true, required: true },
  qrCodeData: { type: String, required: true },
  passImage: { type: String },
  status: {
    type: String,
    enum: ["issued", "checked-in", "cancelled", "expired"],
    default: "issued",
  },
  issuedAt: { type: Date, default: Date.now },
  checkedInAt: { type: Date },
  seatNumber: { type: String },
  additionalInfo: { type: mongoose.Schema.Types.Mixed },
});

const eventSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: [true, "Event name is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    location: {
      name: {
        type: String,
        trim: true,
      },
      address: {
        type: String,
        trim: true,
      },
    },
    venue: {
      type: String,
      trim: true,
    },
    organisationName: {
      type: String,
      required: [true, "Organization name is required"],
      trim: true,
    },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    capacity: {
      type: Number,
      min: 0,
      default: 0,
    },
    isRegistrationOpen: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["draft", "published", "ongoing", "completed"],
      default: "draft",
    },
    coverImage: {
      type: String,
      default: "",
    },
    ticketType: {
      type: String,
      enum: ["Free", "Paid"],
      default: "Free",
    },
    ticketPrice: {
      type: Number,
      min: 0,
      default: 0,
    },
    registrationDeadline: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    passTemplate: {
      layout: {
        type: String,
        enum: ["standard", "premium", "vip"],
        default: "standard",
      },
      primaryColor: { type: String, default: "#8B5CF6" },
      secondaryColor: { type: String, default: "#EC4899" },
      backgroundImage: { type: String },
      showQRCode: { type: Boolean, default: true },
      showUserPhoto: { type: Boolean, default: false },
      customFields: [
        {
          label: String,
          value: String,
        },
      ],
    },
    passes: [passSchema],
  },
  { timestamps: true }
);

// Add index for better performance
eventSchema.index({ createdBy: 1 });
eventSchema.index({ startDate: 1 });
eventSchema.index({ status: 1 });

export const Event = mongoose.model("Event", eventSchema);
