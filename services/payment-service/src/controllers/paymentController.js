const { getChannel, QUEUES } = require("../rabbitmq");

// Simulate payment methods
const PAYMENT_METHODS = ["card", "paypal", "wallet", "bank_transfer"];

// In-memory payment store (in production this would be a DB)
const payments = new Map();


// ── POST /process — process a payment ─────────────────────────
const processPayment = async (req, res) => {
  try {
    const { orderId, userId, amount, paymentMethod, cardLast4 } = req.body;

    if (!orderId || !userId || !amount || !paymentMethod) {
      return res.status(400).json({
        error: "orderId, userId, amount and paymentMethod are required."
      });
    }

    if (!PAYMENT_METHODS.includes(paymentMethod)) {
      return res.status(400).json({
        error: `Invalid payment method. Must be one of: ${PAYMENT_METHODS.join(", ")}`
      });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: "Amount must be greater than 0." });
    }

    // Generate payment ID
    const paymentId  = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const processedAt = new Date().toISOString();

    // Simulate payment processing (95% success rate)
    const isSuccess = Math.random() > 0.05;

    const payment = {
      paymentId,
      orderId,
      userId,
      amount:        parseFloat(amount),
      paymentMethod,
      cardLast4:     cardLast4 || null,
      status:        isSuccess ? "success" : "failed",
      processedAt,
    };

    // Store payment
    payments.set(paymentId, payment);

    // Publish to RabbitMQ
    const channel = getChannel();
    if (channel) {
      const queue   = isSuccess ? QUEUES.PAYMENT_SUCCESS : QUEUES.PAYMENT_FAILED;
      const message = JSON.stringify(payment);
      channel.sendToQueue(queue, Buffer.from(message), { persistent: true });
      console.log(`📨 Payment event published to ${queue}`);
    }

    if (isSuccess) {
      return res.status(200).json({
        message:   "Payment processed successfully.",
        payment,
      });
    } else {
      return res.status(402).json({
        message: "Payment failed. Please try again.",
        payment,
      });
    }
  } catch (err) {
    console.error("Payment processing error:", err);
    res.status(500).json({ error: "Server error processing payment." });
  }
};


// ── GET /:paymentId — get payment status ───────────────────────
const getPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = payments.get(paymentId);

    if (!payment) {
      return res.status(404).json({ error: "Payment not found." });
    }

    res.status(200).json({ payment });
  } catch (err) {
    console.error("Get payment error:", err);
    res.status(500).json({ error: "Server error fetching payment." });
  }
};


// ── GET /order/:orderId — get payments for an order ────────────
const getOrderPayments = async (req, res) => {
  try {
    const { orderId } = req.params;
    const orderPayments = [...payments.values()].filter(p => p.orderId === orderId);

    res.status(200).json({
      orderId,
      payments: orderPayments,
      total: orderPayments.length,
    });
  } catch (err) {
    console.error("Get order payments error:", err);
    res.status(500).json({ error: "Server error fetching order payments." });
  }
};


// ── POST /refund — simulate a refund ──────────────────────────
const refundPayment = async (req, res) => {
  try {
    const { paymentId, reason } = req.body;

    if (!paymentId) {
      return res.status(400).json({ error: "paymentId is required." });
    }

    const payment = payments.get(paymentId);
    if (!payment) {
      return res.status(404).json({ error: "Payment not found." });
    }

    if (payment.status !== "success") {
      return res.status(400).json({ error: "Only successful payments can be refunded." });
    }

    if (payment.status === "refunded") {
      return res.status(400).json({ error: "Payment already refunded." });
    }

    payment.status     = "refunded";
    payment.refundedAt = new Date().toISOString();
    payment.refundReason = reason || "Customer request";
    payments.set(paymentId, payment);

    // Publish refund event
    const channel = getChannel();
    if (channel) {
      channel.sendToQueue(
        QUEUES.PAYMENT_SUCCESS,
        Buffer.from(JSON.stringify({ type: "refund", ...payment })),
        { persistent: true }
      );
    }

    res.status(200).json({
      message: "Refund processed successfully.",
      payment,
    });
  } catch (err) {
    console.error("Refund error:", err);
    res.status(500).json({ error: "Server error processing refund." });
  }
};


module.exports = { processPayment, getPayment, getOrderPayments, refundPayment };
