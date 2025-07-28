require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const { connectRedis } = require("./config/redis");
// Import your database connections to ensure they are initiated
const { userDB, servicemanDB, requestDB, reviewDB, chatDB } = require("./config/db");

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

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("joinRoom", (roomId) => {
    socket.rooms.forEach(room => {
      if (room !== socket.id) {
        socket.leave(room);
        console.log(`Socket ${socket.id} left room: ${room}`);
      }
    });
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room: ${roomId}`);
  });

  socket.on("leaveRoom", (roomId) => {
    socket.leave(roomId);
    console.log(`Socket ${socket.id} left room: ${roomId}`);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const startServer = async () => {
  try {
    // This line is removed as connections are handled by dbConnections.js
    // await mongoose.connect(process.env.MONGO_URI); // REMOVED

    await connectRedis(); // Ensure Redis connection is handled
    const rateLimiter = require("./middleware/rateLimiter");
    app.use(rateLimiter);

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