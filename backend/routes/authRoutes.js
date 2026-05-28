const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  googleAuth,
} = require("../controllers/authController");

const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

/* =========================
   AUTH ROUTES
========================= */

// Register new user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

// Google login
router.post("/google", googleAuth);

// Get logged-in user profile (protected)
router.get("/profile", protect, getUserProfile);

/* =========================
   IMAGE UPLOAD ROUTE
========================= */
router.post("/upload-image", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded.",
      });
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    return res.status(200).json({
      success: true,
      imageUrl,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Upload failed",
      error: error.message,
    });
  }
});

module.exports = router;