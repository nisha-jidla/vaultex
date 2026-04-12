const express = require("express");
const router  = express.Router();
const {
  processPayment, getPayment,
  getOrderPayments, refundPayment
} = require("../controllers/paymentController");

// POST /process       — process payment
router.post("/process", processPayment);

// POST /refund        — refund payment
router.post("/refund", refundPayment);

// GET  /order/:orderId — payments for an order
router.get("/order/:orderId", getOrderPayments);

// GET  /:paymentId    — single payment status
router.get("/:paymentId", getPayment);

module.exports = router;
