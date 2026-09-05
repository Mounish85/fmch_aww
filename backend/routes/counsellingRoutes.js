const express = require("express");

const {
  createCounselling,
  getCounsellings,
  getCounsellingById,
  updateCounselling,
} = require("../controllers/counsellingController");

const router = express.Router();

// Create counselling
router.post("/", createCounselling);

// Get all counselling records
router.get("/", getCounsellings);

// Get counselling by ID
router.get("/:id", getCounsellingById);

// Update counselling
router.put("/:id", updateCounselling);

module.exports = router;