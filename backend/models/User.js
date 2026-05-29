const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    password: {
      type: String,
      default: null,
      select: false,
    },

    profileImageUrl: {
      type: String,
      default: null,
    },

    googleId: {
      type: String,
      default: null,
      unique: true,
      sparse: true, // important for null values
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      required: true,
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);