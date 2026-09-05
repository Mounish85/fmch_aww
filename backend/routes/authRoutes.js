const { Router } = require("express");

const {
  signup_post,
  login_post,
  profile_get,
  logout_get
} = require("../controllers/authController");

const {
  requireAuth
} = require("../middleware/authMiddleware");

const router = Router();


// Register
router.post("/signup", signup_post);


// Login
router.post("/login", login_post);


// Protected profile
router.get(
  "/profile",
  requireAuth,
  profile_get
);


// Logout
router.get("/logout", logout_get);


module.exports = router;