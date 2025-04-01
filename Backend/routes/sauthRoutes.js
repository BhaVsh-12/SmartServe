require("dotenv").config(); // Load environment variables

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Serviceman = require("../models/Serviceman");
const protectRoute = require("../middleware/authMiddleware"); // ✅ Import authentication middleware

const router = express.Router();

// ✅ Serviceman Signup
router.post("/signup", async (req, res) => {
    try {
        console.log("Signup request received:", req.body);
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const userExists = await Serviceman.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new Serviceman({ email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: "Serviceman registered successfully" });
    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ message: error.message });
    }
});

// ✅ Serviceman Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const serviceman = await Serviceman.findOne({ email });
        if (!serviceman) return res.status(400).json({ message: "Serviceman not found" });

        const isMatch = await bcrypt.compare(password, serviceman.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // 🛑 Include role in token (serviceman)
        const token = jwt.sign({ id: serviceman._id, role: "serviceman" }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, role: "serviceman" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ✅ Serviceman Logout
router.post("/logout", async (req, res) => {
    try {
        res.json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ✅ Update Serviceman Profile
router.put("/updateProfile", protectRoute("serviceman"), async (req, res) => {
    try {
        const { fullName, serviceCategory, subCategory, availability, location, price,experience,description } = req.body;
        const serviceman = await Serviceman.findById(req.user.id);
        if (!serviceman) return res.status(404).json({ message: "Serviceman not found" });

        // Update only provided fields
        if (fullName) serviceman.fullName = fullName;
        if (serviceCategory) serviceman.serviceCategory = serviceCategory;
        if (subCategory) serviceman.subCategory = subCategory;
        if (availability !== undefined) serviceman.availability = availability;
        if (location) serviceman.location = location;
        if (price !== undefined) serviceman.price = price;
        if(experience) serviceman.experience=experience;
        if(description) serviceman.description=description;

        await serviceman.save();
        res.status(200).json({ message: "Profile updated successfully", serviceman });

    } catch (error) {
        console.error("Profile update error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ✅ Get Serviceman Profile
router.get("/getProfile", protectRoute("serviceman"), async (req, res) => {
    try {
        const serviceman = await Serviceman.findById(req.user.id).select("-password");
        if (!serviceman) return res.status(404).json({ message: "Serviceman not found" });

        res.json(serviceman);
    } catch (error) {
        console.error("Profile fetch error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
const multer = require("multer");

// ✅ Configure Multer for Image Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Save to 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
    }
});

const upload = multer({ storage });

// ✅ Upload Image Endpoint
router.post("/uploadPhoto", protectRoute("serviceman"), upload.single("profilePhoto"), async (req, res) => {
    console.log("🖼️ File Upload Attempt:", req.file);
    
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    // ✅ Generate Image URL
    const imageUrl = `https://smartserve-z2ms.onrender.com/uploads/${req.file.filename}`;

    try {
        // ✅ Update Profile Photo in Database
        const updatedServiceman = await Serviceman.findByIdAndUpdate(
            req.user.id, 
            { profilePhoto: imageUrl },
            { new: true, select: "-password" } // Return updated document without password
        );

        if (!updatedServiceman) {
            return res.status(404).json({ message: "Serviceman not found" });
        }

        console.log("✅ Profile photo updated in DB:", updatedServiceman);
        res.json({ message: "Profile photo updated", imageUrl, serviceman: updatedServiceman });
    } catch (error) {
        console.error("❌ Error updating profile photo:", error);
        res.status(500).json({ message: "Failed to update profile photo" });
    }
});


module.exports = router;
