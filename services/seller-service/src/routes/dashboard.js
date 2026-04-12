const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { getDashboard, updateDashboard, getStats } = require("../controllers/dashboardController");

router.use(protect);

router.get("/",       getDashboard);
router.put("/",       updateDashboard);
router.get("/stats",  getStats);

module.exports = router;
