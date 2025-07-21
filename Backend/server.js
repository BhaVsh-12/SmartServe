// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");

const { connectRedis } = require("./config/redis");

const authRoutes = require("./routes/authRoutes");
const sauthRoutes = require("./routes/sauthRoutes");
const rauthRoutes = require("./routes/rauthRoutes");
const reauthRoutes = require("./routes/reauthRoutes");
const chatRoutes = require("./routes/chatRoutes");

const protectRoute = require("./middleware/authMiddleware");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://smart-serve-coral.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});

const allowedOrigins = ["http://localhost:5173", "https://smart-serve-coral.vercel.app"];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use((req, res, next) => {
  req.io = io;
  next();
});

const startServer = async () => {
  try {
    await connectRedis();

    // ✅ Load rate limiter after Redis is connected
    const rateLimiter = require("./middleware/rateLimiter");
    app.use(rateLimiter); // global middleware

    // Routes
    app.use("/user/api/auth", authRoutes);
    app.get("/user/api/protected", protectRoute("client"), (req, res) => {
      res.json({ message: "Access granted to client protected data" });
    });

    app.use("/serviceman/api/auth", sauthRoutes);
    app.get("/serviceman/api/protected", protectRoute("serviceman"), (req, res) => {
      res.json({ message: "Access granted to serviceman protected data" });
    });

    app.use("/request/api/auth", rauthRoutes);
    app.get("/request/api/protected", protectRoute("client"), (req, res) => {
      res.json({ message: "Access granted to client protected data" });
    });

    app.use("/review/api/auth", reauthRoutes);
    app.get("/review/api/protected", protectRoute("client"), (req, res) => {
      res.json({ message: "Access granted to client protected data" });
    });

    app.use("/chat/api", chatRoutes);

    app.get('/ping', (req, res) => res.send('pong'));

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
  }
};

startServer();
