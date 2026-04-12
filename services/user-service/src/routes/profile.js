const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { getProfile, updateProfile, changePassword } = require("../controllers/profileController");

// All routes below require a valid JWT
router.use(protect);

// GET  /profile
router.get("/", getProfile);

// PUT  /profile
router.put("/", updateProfile);

// PUT  /profile/change-password
router.put("/change-password", changePassword);

module.exports = router;
