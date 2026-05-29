const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const admin = require("../firebaseAdmin");


// ==============================
// JWT GENERATOR
// ==============================
const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured.");
  }

  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// ==============================
// REGISTER USER
// ==============================
const registerUser = async (req, res) => {
  try {
    const { name, email, password, profileImageUrl } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profileImageUrl,
      authProvider: "local",
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Register user failed:", error);
    res.status(500).json({
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
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user || user.authProvider !== "local" || !user.password) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Login user failed:", error);
    res.status(500).json({
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
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json(user);
  } catch (error) {
    console.error("Get user profile failed:", error);
    res.status(500).json({
      message: "Server Error, Try later.",
      error: error.message,
    });
  }
};

// ==============================
// GOOGLE AUTH (PRODUCTION SAFE)
// ==============================
const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token missing" });
    }

    console.log("Verifying Firebase ID token for google auth");
    const decoded = await admin.auth().verifyIdToken(token);

    const { email, name, picture, uid } = decoded;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        profileImageUrl: picture,
        googleId: uid,
        authProvider: "google",
      });
    } else if (user.authProvider === "local" && !user.googleId) {
      user.googleId = uid;
      user.authProvider = "google";
      await user.save();
    }

    const jwtToken = generateToken(user._id);

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      token: jwtToken,
    });

  } catch (error) {
    console.error("Google auth failed:", error);
    return res.status(500).json({
      message: "Google authentication failed.",
      error: error.message,
    });
  }
};

// ==============================
// EXPORTS (COMMONJS FIXED)
// ==============================
module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  googleAuth,
};