const path = require("path");
const fs = require("fs/promises");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  sendWelcomeEmail,
  notifyAdmin,
} = require("../services/emailServices");
const { requireFirebaseAdmin } = require("../firebaseAdmin");


const UPLOADS_DIR = path.resolve(__dirname, "..", "uploads");

const sanitizeEmail = (email) => (typeof email === "string" ? email.trim().toLowerCase() : "");

const buildAuthResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  profileImageUrl: user.profileImageUrl,
  token: generateToken(user._id),
});

// ==============================
// JWT GENERATOR
// ==============================
const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured.");
  }

  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// ==============================
// REGISTER USER
// ==============================
const registerUser = async (req, res) => {
  try {
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    const email = sanitizeEmail(req.body.email);
    const password = typeof req.body.password === "string" ? req.body.password : "";
    const profileImageUrl =
      typeof req.body.profileImageUrl === "string" && req.body.profileImageUrl.trim()
        ? req.body.profileImageUrl.trim()
        : null;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long.",
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: "User already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profileImageUrl,
      authProvider: "local",
      emailVerified: false,
    });
      // Fire and forget
sendWelcomeEmail(user.email, user.name)
  .catch(err => console.error("Welcome email failed:", err));

notifyAdmin(user.email, user.name)
  .catch(err => console.error("Admin email failed:", err));

    return res.status(201).json(buildAuthResponse(user));
  } catch (error) {
    console.error("Register user failed:", error);
    return res.status(500).json({
      message: "Server Error, Try later.",
      error: error.message,
    });
  }
};

// ==============================
// LOGIN USER
// ==============================
const loginUser = async (req, res) => {
  try {
    const email = sanitizeEmail(req.body.email);
    const password = typeof req.body.password === "string" ? req.body.password : "";

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !user.password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    return res.status(200).json(buildAuthResponse(user));
  } catch (error) {
    console.error("Login user failed:", error);
    return res.status(500).json({
      message: "Server Error, Try later.",
      error: error.message,
    });
  }
};

// ==============================
// GET USER PROFILE
// ==============================
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user?._id || req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Not authorized." });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found." });
    return res.json(user);
  } catch (error) {
    console.error("Get user profile failed:", error);
    return res.status(500).json({
      message: "Server Error, Try later.",
      error: error.message,
    });
  }
};

// ==============================
// GOOGLE AUTH
// ==============================
const googleAuth = async (req, res) => {
  const correlationId = req.correlationId || "n/a";

  try {
    const token = req.body?.token;

    if (!token || typeof token !== "string") {
      return res.status(400).json({ message: "Token is required." });
    }

    const admin = requireFirebaseAdmin();
    const decoded = await admin.auth().verifyIdToken(token);

    const email = sanitizeEmail(decoded.email);

    if (!email) {
      console.error(`[${correlationId}] verifyIdToken decoded missing email`, decoded);
      return res.status(400).json({ message: "Firebase token missing email" });
    }

    const name =
      typeof decoded.name === "string" && decoded.name.trim()
        ? decoded.name.trim()
        : "Google User";

    const picture =
      typeof decoded.picture === "string" && decoded.picture.trim()
        ? decoded.picture.trim()
        : null;

    const uid = typeof decoded.uid === "string" ? decoded.uid : null;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        profileImageUrl: picture,
        googleId: uid,
        authProvider: "google",
        emailVerified: true,
      });
    } else {
      let changed = false;

      if (uid && user.googleId !== uid) {
        user.googleId = uid;
        changed = true;
      }

      if (picture && !user.profileImageUrl) {
        user.profileImageUrl = picture;
        changed = true;
      }

      if (user.authProvider !== "google" && user.googleId) {
        user.authProvider = "google";
        changed = true;
      }

      if (changed) {
        await user.save();
      }
    }

    return res.json(buildAuthResponse(user));
  } catch (error) {
    console.error(`[${correlationId}] Google auth failed:`, {
      message: error?.message,
      code: error?.code,
      stack: error?.stack,
    });

    return res.status(500).json({
      message: "Google authentication failed.",
      error: error?.message,
    });
  }
};

// ==============================
// DELETE UPLOADED IMAGE
// ==============================
const deleteUploadedImage = async (req, res) => {
  try {
    const { filename } = req.params;

    if (!filename || typeof filename !== "string") {
      return res.status(400).json({ success: false, message: "Filename is required." });
    }

    if (path.basename(filename) !== filename) {
      return res.status(400).json({ success: false, message: "Invalid filename." });
    }

    const filePath = path.resolve(UPLOADS_DIR, filename);
    const normalizedUploadsDir = `${path.resolve(UPLOADS_DIR)}${path.sep}`;

    if (!filePath.startsWith(normalizedUploadsDir)) {
      return res.status(400).json({ success: false, message: "Invalid file path." });
    }

    await fs.access(filePath);
    await fs.unlink(filePath);

    return res.status(200).json({
      success: true,
      message: "Image deleted successfully.",
    });
  } catch (error) {
    if (error?.code === "ENOENT") {
      return res.status(404).json({
        success: false,
        message: "Image not found.",
      });
    }

    console.error("Delete uploaded image failed:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete image.",
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  googleAuth,
  deleteUploadedImage,
};
