const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

// Google Client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ==============================
// JWT GENERATOR
// ==============================
const generateToken = (userId) => {
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

    const user = await User.findOne({ email });

    if (!user || !user.password) {
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
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        message: "Google token missing",
      });
    }

    // VERIFY GOOGLE TOKEN
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const {
      email,
      name,
      picture,
      sub: googleId,
    } = payload;

    // CHECK USER
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        profileImageUrl: picture,
        googleId,
        authProvider: "google",
        password: null,
      });
    } else {
      // UPDATE EXISTING USER IF NEEDED
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = "google";
        user.profileImageUrl = user.profileImageUrl || picture;
        await user.save();
      }
    }

    // GENERATE TOKEN
    const token = generateToken(user._id);

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Google authentication failed",
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