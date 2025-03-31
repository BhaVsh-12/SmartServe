require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { userDB, servicemanDB, requestDB ,reviewDB} = require("./config/db");
const User = require("./models/User");
const Serviceman = require("./models/Serviceman");
const Request=require("./models/Request");
const sauthRoutes = require("./routes/sauthRoutes");
const authRoutes = require("./routes/authRoutes");
const rauthRoutes = require("./routes/rauthRoutes");
const reauthRoutes=require("./routes/reauthRoutes");
const protectRoute = require("./middleware/authMiddleware");

const app = express();

// Debug: Check database connection status
console.log("Debug: Checking database connections...");
if (userDB.readyState === 1) console.log("Debug: userDB connected");
else console.log("Debug: userDB connection status:", userDB.readyState);
if (servicemanDB.readyState === 1) console.log("Debug: servicemanDB connected");
else console.log("Debug: servicemanDB connection status:", servicemanDB.readyState);
if (requestDB.readyState === 1) console.log("Debug: requestDB connected");
else console.log("Debug: requestDB connection status:", requestDB.readyState);

// Debug: Check Serviceman model import and definition
console.log("Debug: Serviceman model:", Serviceman);
const allowedOrigins = [
    "http://localhost:5173", 
    "https://smart-serve-o58oe7q53-bhavsh-12s-projects.vercel.app",
    "https://smart-serve-coral.vercel.app",
    "https://smart-serve-five.vercel.app",
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
  

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

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

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));