const User = require("../models/User");

// Get user by ID
const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: error.message,
    });
  }
};

// Update user details
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const allowedFields = ["name", "email"];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: error.message,
    });
  }
};

// Update preferred language
const updateLanguagePreference = async (req, res) => {
  try {
    const { id } = req.params;
    const { preferredLanguage } = req.body;

    if (!preferredLanguage) {
      return res.status(400).json({
        success: false,
        message: "Preferred language is required",
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { preferredLanguage },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Language preference updated successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update language preference",
      error: error.message,
    });
  }
};

module.exports = {
  getUser,
  updateUser,
  updateLanguagePreference,
};