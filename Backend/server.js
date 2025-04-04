require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { userDB, servicemanDB, requestDB, reviewDB, chatDB } = require("./config/db");
const User = require("./models/User");
const Serviceman = require("./models/Serviceman");
const Request = require("./models/Request");
const Chat = require("./models/Chat"); // Import Chat model
const authRoutes = require("./routes/authRoutes");
const sauthRoutes = require("./routes/sauthRoutes");
const rauthRoutes = require("./routes/rauthRoutes");
const reauthRoutes = require("./routes/reauthRoutes");
const chatRoutes = require("./routes/chatRoutes"); // Import chat routes
const protectRoute = require("./middleware/authMiddleware");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:5173",
            "https://smart-serve-coral.vercel.app",
        ],
        methods: ["GET", "POST"],
    },
});

// Debug: Check database connection status
console.log("Checking database connections...");
console.log("userDB Connection Status:", userDB.readyState);
console.log("servicemanDB Connection Status:", servicemanDB.readyState);
console.log("requestDB Connection Status:", requestDB.readyState);
console.log("chatDB Connection Status:", chatDB.readyState);

// CORS Configuration
const allowedOrigins = [
    "http://localhost:5173",
    "https://smart-serve-coral.vercel.app",
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Middleware to pass Socket.IO instance to routes
app.use((req, res, next) => {
    req.io = io; // Attach `io` to the request object
    next();
});

// Authentication Routes
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

// Chat Routes
app.use("/chat/api", chatRoutes);

// Socket.IO Connection
io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", (roomId) => {
        socket.join(roomId);
        console.log(`User with ID: ${socket.id} joined room: ${roomId}`);
    });

    socket.on("send_message", (data) => {
        socket.to(data.roomId).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
