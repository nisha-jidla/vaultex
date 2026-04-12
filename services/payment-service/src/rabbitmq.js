const amqp = require("amqplib");

let channel = null;

const QUEUES = {
  PAYMENT_PROCESS: "payment.process",
  PAYMENT_SUCCESS: "payment.success",
  PAYMENT_FAILED:  "payment.failed",
};

async function connectRabbitMQ() {
  try {
    const url  = process.env.RABBITMQ_URL || "amqp://vaultex:vaultex_pass@rabbitmq:5672";
    const conn = await amqp.connect(url);
    channel    = await conn.createChannel();

    // Assert all queues
    for (const queue of Object.values(QUEUES)) {
      await channel.assertQueue(queue, { durable: true });
    }

    console.log("✅ RabbitMQ connected");
    return channel;
  } catch (err) {
    console.error("❌ RabbitMQ connection failed:", err.message);
    setTimeout(connectRabbitMQ, 5000); // retry after 5s
  }
}

function getChannel() {
  return channel;
}

module.exports = { connectRabbitMQ, getChannel, QUEUES };
