import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const pendingUserSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      minLength: [3, "fullname must be 3 characters long"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    verificationOtp: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

pendingUserSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

pendingUserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

pendingUserSchema.methods.compareOTP = async function (enteredOTP) {
  return this.verificationOtp === enteredOTP;
};

export const PendingUser = mongoose.model("PendingUser", pendingUserSchema);
