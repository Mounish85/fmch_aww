const Counselling = require("../models/Counselling");

const ML_SERVICE_URL =
  process.env.ML_SERVICE_URL || "http://localhost:8000";


// Create counselling
const createCounselling = async (req, res) => {
  try {
    const {
      beneficiary,
      conductedBy,
      inputs
    } = req.body;

    // 1. Create counselling record
    const counselling = await Counselling.create({
      beneficiary,
      conductedBy,
      inputs,
      status: "in-progress"
    });

    // 2. Send the counselling ID to ML service
    const mlResponse = await fetch(
      `${ML_SERVICE_URL}/api/ml/predict/${counselling._id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    // 3. Check ML response
    if (!mlResponse.ok) {
      const errorData = await mlResponse.text();

      console.error(
        "ML service error:",
        errorData
      );

      return res.status(500).json({
        success: false,
        message: "Counselling created, but ML service failed",
        data: counselling
      });
    }

    const mlData = await mlResponse.json();

    // 4. Get translated recommendation
    const recommendation =
      mlData?.result?.recommendation;

    // 5. Update counselling with recommendation
    if (recommendation) {
      counselling.recommendation =
        recommendation.message;

      counselling.status = "completed";

      await counselling.save();
    }

    // 6. Return final result
    return res.status(201).json({
      success: true,
      message: "Counselling created successfully",
      data: counselling,
      mlResult: mlData.result
    });

  } catch (error) {
    console.error(
      "Create counselling error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create counselling",
      error: error.message
    });
  }
};

// Get all counselling records
const getCounsellings = async (req, res) => {
  try {
    const counsellings = await Counselling.find()
      .populate("beneficiary")
      .populate("conductedBy", "name email role preferredLanguage")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: counsellings.length,
      data: counsellings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch counselling records",
      error: error.message,
    });
  }
};

// Get counselling by ID
const getCounsellingById = async (req, res) => {
  try {
    const { id } = req.params;

    const counselling = await Counselling.findById(id)
      .populate("beneficiary")
      .populate("conductedBy", "name email role preferredLanguage");

    if (!counselling) {
      return res.status(404).json({
        success: false,
        message: "Counselling record not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: counselling,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch counselling record",
      error: error.message,
    });
  }
};

// Update counselling
const updateCounselling = async (req, res) => {
  try {
    const { id } = req.params;

    const allowedFields = ["inputs", "recommendation", "status"];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const counselling = await Counselling.findByIdAndUpdate(
      id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!counselling) {
      return res.status(404).json({
        success: false,
        message: "Counselling record not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Counselling updated successfully",
      data: counselling,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update counselling",
      error: error.message,
    });
  }
};

module.exports = {
  createCounselling,
  getCounsellings,
  getCounsellingById,
  updateCounselling,
};