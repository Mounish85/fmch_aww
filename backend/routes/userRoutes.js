const express = require("express");

const {
  getUser,
  updateUser,
  updateLanguagePreference,
} = require("../controllers/userController");

const router = express.Router();

// Get user
router.get("/:id", getUser);

// Update user
router.put("/:id", updateUser);

// Update preferred language
router.patch("/:id/language", updateLanguagePreference);

module.exports = router;