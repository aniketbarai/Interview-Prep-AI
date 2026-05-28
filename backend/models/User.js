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
      index: true,
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

// validation rules
userSchema.pre("save", function (next) {
  if (this.authProvider === "local" && !this.password) {
    return next(new Error("Password required for local users"));
  }

  if (this.authProvider === "google") {
    this.password = null;
    this.emailVerified = true;
  }

  next();
});

module.exports = mongoose.model("User", userSchema);