const express = require("express");

const {
  createBeneficiary,
  getBeneficiaries,
  getBeneficiaryById,
  updateBeneficiary,
  deleteBeneficiary,
} = require("../controllers/beneficiaryController");

const router = express.Router();

// Create beneficiary
router.post("/", createBeneficiary);

// Get all beneficiaries
router.get("/", getBeneficiaries);

// Get beneficiary by ID
router.get("/:id", getBeneficiaryById);

// Update beneficiary
router.put("/:id", updateBeneficiary);

// Delete beneficiary
router.delete("/:id", deleteBeneficiary);

module.exports = router;