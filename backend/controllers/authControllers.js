const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");

const registerController = async (req, res) => {
  try {
    const { username, email, password, address, phoneNumber, userType } =
      req.body;

    if (!username || !email || !password || !address || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const allowedRoles = ["client", "vendor", "delivery"];
    const chosenRole = allowedRoles.includes(userType) ? userType : "client";

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username: username.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      address,
      phoneNumber,
      userType: chosenRole,
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      userType: chosenRole,
    });
  } catch (error) {
    console.error("Register Error:", error);

    return res.status(500).json({
      success: false,
      message: "Error in register user",
      error: error.message,
    });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing from environment variables");
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = JWT.sign(
      {
        id: user._id,
        userType: user.userType,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    const userData = user.toObject();
    delete userData.password;

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: userData,
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Error in login user",
      error: error.message,
    });
  }
};

module.exports = {
  registerController,
  loginController,
};
