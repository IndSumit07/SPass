import { PendingUser } from "../models/pendingUser.model.js";
import { User } from "../models/user.model.js";
import { sendRegistrationEmail } from "../utils/sendRegistrationEmail.js";
import { sendVerificationOtp } from "../utils/sendVerificationOtp.js";
import { BlacklistToken } from "../models/blacklistToken.model.js";

const generateOtp = () => {
  const OTP = Math.floor(100000 + Math.random() * 900000).toString();
  return OTP;
};

export const register = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
      return res.json({ success: false, message: "All fields are required." });
    }

    const isRegistered = await User.findOne({ email });

    if (isRegistered) {
      return res.json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const isAvailable = await PendingUser.findOne({ email });
    if (isAvailable) {
      await PendingUser.deleteOne({ email });
    }

    const verificationOtp = generateOtp();

    const user = await PendingUser.create({
      fullname,
      email,
      password,
      verificationOtp,
    });

    await user.save();
    await sendVerificationOtp(email, verificationOtp);

    return res.json({
      success: true,
      message: "Verification OTP sent on email",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const verifyRegistrationOtp = async (req, res) => {
  try {
    const { enteredOtp, email } = req.body;
    if (!enteredOtp || !email) {
      return res.json({ success: false, message: "OTP is required" });
    }

    const user = await PendingUser.findOne({ email }).select("+password");

    if (!user) {
      return res.json({
        success: false,
        message: "Session Expired! Register Again",
      });
    }
    console.log(user);

    const isMatched = user.verificationOtp === enteredOtp;

    if (!isMatched) {
      return res.json({
        success: false,
        message: "Invalid OTP",
      });
    }

    const registeredUser = await User.create({
      fullname: user.fullname,
      email: user.email,
      password: user.password,
    });

    await PendingUser.deleteOne({ email });

    await registeredUser.save();
    await sendRegistrationEmail(registeredUser.email, registeredUser.fullname);
    return res.json({
      success: true,
      message: "Account Created Successfully",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const isMatched = await user.comparePassword(password);

    if (!isMatched) {
      return res.json({ success: false, message: "Invalid Email or Password" });
    }

    const token = await user.generateAuthToken();

    res.cookie("token", token);

    res.json({ success: true, token, user, message: "Login Successful" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const getUserProfile = async (req, res, next) => {
  try {
    res.json({ success: true, user: req.user });
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

export const logout = async (req, res, next) => {
  try {
    let token;

    if (req.cookies?.token) {
      token = req.cookies.token;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    await BlacklistToken.create({ token });
    res.clearCookie("token");
    res.json({ success: true, message: "Logged Out" });
  } catch (error) {
    res.json({
      message: error.message || "Internal Server Error",
    });
  }
};
