import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { BlacklistToken } from "../models/blacklistToken.model.js";

export const authUser = async (req, res, next) => {
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

    if (!token) {
      throw new Error("Unauthorized: No token provided");
    }

    const isBlacklisted = await BlacklistToken.findOne({ token });

    if (isBlacklisted) {
      return res.json({
        success: false,
        message: "Unauthorized: Token Expired, Login Again",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded._id);
    if (!user) {
      throw new Error(401, "Unauthorized: User not found");
    }

    req.user = user;

    next();
  } catch (error) {
    res.json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
