const User = require("../models/userModel");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const sendOtpEmail = require("../utils/sendEmail");

const getuserController = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }
    res.status(200).send({
      success: true,
      message: "User data fetched successfully",
      user,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching user data",
      error: error.message,
    });
  }
};

const updateUserController = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    if (req.body.username !== undefined) user.username = req.body.username;
    if (req.body.email !== undefined) user.email = req.body.email;
    if (req.body.address !== undefined) user.address = req.body.address;
    if (req.body.phoneNumber !== undefined)
      user.phoneNumber = req.body.phoneNumber;

    const updatedUser = await user.save();
    updatedUser.password = undefined;

    res.status(200).send({
      success: true,
      message: "User data updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error updating user data",
      error: error.message,
    });
  }
};

const requestPasswordOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "No account found with that email",
      });
    }

    if (
      user.resetOtpExpiry &&
      user.resetOtpExpiry > Date.now() + 9 * 60 * 1000
    ) {
      return res.status(429).send({
        success: false,
        message: "Please wait before requesting a new OTP",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 10 * 60 * 1000;
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    user.resetOtp = hashedOtp;
    user.resetOtpExpiry = otpExpiry;
    user.otpAttempts = 0;
    await user.save();

    await sendOtpEmail(user.email, "Password Reset OTP", otp);

    res.status(200).send({
      success: true,
      message: "OTP sent to your email",
    });
  } catch (error) {
    console.error("requestPasswordOtp error:", error);
    res.status(500).send({
      success: false,
      message: "Error sending OTP",
      error: error.message,
    });
  }
};

const changePasswordWithOtp = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).send({
        success: false,
        message: "Email, OTP and new password are required",
      });
    }
    if (newPassword.length < 6) {
      return res.status(400).send({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    if (
      !user.resetOtp ||
      !user.resetOtpExpiry ||
      user.resetOtpExpiry < Date.now()
    ) {
      return res
        .status(400)
        .send({ success: false, message: "OTP has expired or is invalid" });
    }

    if (user.otpAttempts >= 5) {
      user.resetOtp = null;
      user.resetOtpExpiry = null;
      user.otpAttempts = 0;
      await user.save();
      return res.status(429).send({
        success: false,
        message: "Maximum OTP attempts exceeded. Request a new OTP.",
      });
    }

    const hashedInput = crypto.createHash("sha256").update(otp).digest("hex");
    if (hashedInput !== user.resetOtp) {
      user.otpAttempts += 1;
      await user.save();
      return res.status(400).send({ success: false, message: "Invalid OTP" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOtp = null;
    user.resetOtpExpiry = null;
    user.otpAttempts = 0;
    await user.save();

    res.status(200).send({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("changePasswordWithOtp error:", error);
    res.status(500).send({
      success: false,
      message: "Error changing password",
      error: error.message,
    });
  }
};

const deleteUserController = async (req, res) => {
  try {
    const userId = req.params.id || req.query.id || req.user.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send({
        success: false,
        message: "Invalid user id",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    await User.findByIdAndDelete(userId);

    res.status(200).send({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error deleting user",
      error: error.message,
    });
  }
};

module.exports = {
  getuserController,
  updateUserController,
  requestPasswordOtp,
  changePasswordWithOtp,
  deleteUserController,
};
