const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please enter your username"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    address: {
      type: [String],
      required: [true, "Please enter your address"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Please enter your phone number"],
    },
    userType: {
      type: String,
      required: [true, "Please enter your user type"],
      default: "client",
      enum: ["client", "admin", "vendor", "delivery"],
    },
    profileImage: {
      type: String,
      default:
        "https://pixabay.com/images/download/wanderercreative-blank-profile-picture-973460_1920.png",
    },
    resetOtp: {
      type: String,
      default: null,
    },
    resetOtpExpiry: {
      type: Date,
      default: null,
    },
    otpAttempts: {
      type: Number,
      default: 0,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
