// config/redis.js
const { createClient } = require("redis");

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

const connectRedis = async () => {
  redisClient.on("error", (err) => console.error("❌ Redis Error:", err));
  await redisClient.connect();
  console.log("✅ Connected to Redis");
};

module.exports = { redisClient, connectRedis };
