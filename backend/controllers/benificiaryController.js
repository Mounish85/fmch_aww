const Beneficiary = require("../models/Beneficiary");

// Create beneficiary
const createBeneficiary = async (req, res) => {
  try {
    const { name, age, contactNumber, address } = req.body;

    if (!name || age === undefined) {
      return res.status(400).json({
        success: false,
        message: "Name and age are required",
      });
    }

    const beneficiary = await Beneficiary.create({
      name,
      age,
      contactNumber,
      address,
    });

    return res.status(201).json({
      success: true,
      message: "Beneficiary created successfully",
      data: beneficiary,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create beneficiary",
      error: error.message,
    });
  }
};

// Get all beneficiaries
const getBeneficiaries = async (req, res) => {
  try {
    const beneficiaries = await Beneficiary.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: beneficiaries.length,
      data: beneficiaries,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch beneficiaries",
      error: error.message,
    });
  }
};

// Get beneficiary by ID
const getBeneficiaryById = async (req, res) => {
  try {
    const { id } = req.params;

    const beneficiary = await Beneficiary.findById(id);

    if (!beneficiary) {
      return res.status(404).json({
        success: false,
        message: "Beneficiary not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: beneficiary,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch beneficiary",
      error: error.message,
    });
  }
};

// Update beneficiary
const updateBeneficiary = async (req, res) => {
  try {
    const { id } = req.params;

    const allowedFields = [
      "name",
      "age",
      "contactNumber",
      "address",
    ];

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const beneficiary = await Beneficiary.findByIdAndUpdate(
      id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!beneficiary) {
      return res.status(404).json({
        success: false,
        message: "Beneficiary not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Beneficiary updated successfully",
      data: beneficiary,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update beneficiary",
      error: error.message,
    });
  }
};

// Delete beneficiary
const deleteBeneficiary = async (req, res) => {
  try {
    const { id } = req.params;

    const beneficiary = await Beneficiary.findByIdAndDelete(id);

    if (!beneficiary) {
      return res.status(404).json({
        success: false,
        message: "Beneficiary not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Beneficiary deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete beneficiary",
      error: error.message,
    });
  }
};

module.exports = {
  createBeneficiary,
  getBeneficiaries,
  getBeneficiaryById,
  updateBeneficiary,
  deleteBeneficiary,
};