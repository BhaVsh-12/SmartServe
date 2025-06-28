require("dotenv").config(); // Load environment variables

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Serviceman = require("../models/Serviceman");
const protectRoute = require("../middleware/authMiddleware");
const router = express.Router();
const cloudinary = require("../config/cloudinary");
const upload = require("../middleware/multer"); 
const { Readable } = require('stream');
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
        const { fullName, serviceCategory, subCategory, availability, location, price, experience, description } = req.body;
        const serviceman = await Serviceman.findById(req.user.id);
        if (!serviceman) return res.status(404).json({ message: "Serviceman not found" });

       
        if (fullName) serviceman.fullName = fullName;
        if (serviceCategory) serviceman.serviceCategory = serviceCategory;
        if (subCategory) serviceman.subCategory = subCategory;
        if (availability !== undefined) serviceman.availability = availability;
        if (location) serviceman.location = location;
        if (price !== undefined) serviceman.price = price;
        if (experience) serviceman.experience = experience;
        if (description) serviceman.description = description;

        await serviceman.save();
        console.log(serviceman.profilePhoto);
        res.status(200).json({ message: "Profile updated successfully", serviceman});

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

router.post(
  "/uploadPhoto",
  protectRoute("serviceman"),
  upload.single("profilePhoto"), // match frontend field name
  async (req, res) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const buffer = file.buffer;

      // Upload buffer to Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "servicemen_profiles" }, // Optional: custom folder in Cloudinary
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        Readable.from(buffer).pipe(stream);
      });

      const updatedServiceman = await Serviceman.findByIdAndUpdate(
        req.user.id,
        { profilePhoto: uploadResult.secure_url },
        { new: true, select: "-password" }
      );

      if (!updatedServiceman) {
        return res.status(404).json({ message: "Serviceman not found" });
      }

      res.status(200).json({
        message: "Photo uploaded to Cloudinary successfully",
        url: uploadResult.secure_url,
        serviceman: updatedServiceman,
      });
    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).json({ message: "Cloudinary upload failed", error: err.message });
    }
  }
);

router.put("/updateMembership", protectRoute("serviceman"), async (req, res) => {
    try {
        const { basic, professional, elite } = req.body;
        const serviceman = await Serviceman.findById(req.user.id);

        if (!serviceman) {
            return res.status(404).json({ message: "Serviceman not found" });
        }

        const calculateSavePercentage = (monthlyPrice, yearlyPrice) => {
            if (monthlyPrice > 0 && yearlyPrice > 0) {
                const expectedYearly = monthlyPrice * 12;
                const savings = expectedYearly - yearlyPrice;
                return parseFloat(((savings / expectedYearly) * 100).toFixed(2));
            }
            return 0;
        };

        const updateTierData = (existingTier, newTierData) => {
            if (!newTierData) return existingTier; // No update provided

            const updatedTier = { ...existingTier, ...newTierData };

            // Ensure includeService and benefits are arrays if provided
            if (newTierData.includeService !== undefined && !Array.isArray(newTierData.includeService)) {
                updatedTier.includeService = []; // Or handle the error as needed
            }
            if (newTierData.benefits !== undefined && !Array.isArray(newTierData.benefits)) {
                updatedTier.benefits = []; // Or handle the error as needed
            }

            // Calculate save percentage if both monthly and yearly prices are provided
            if (updatedTier.mprice !== undefined && updatedTier.yprice !== undefined) {
                updatedTier.savepercentage = calculateSavePercentage(updatedTier.mprice, updatedTier.yprice);
            }

            return updatedTier;
        };

        if (basic !== undefined) {
            serviceman.basic = updateTierData(serviceman.basic || {}, basic);
        }
        if (professional !== undefined) {
            serviceman.professional = updateTierData(serviceman.professional || {}, professional);
        }
        if (elite !== undefined) {
            serviceman.elite = updateTierData(serviceman.elite || {}, elite);
        }

        await serviceman.save();
        res.status(200).json({ message: "Membership tiers updated successfully", serviceman });

    } catch (error) {
        console.error("Membership tier update error:", error);
        res.status(500).json({ message: "Failed to update membership tiers", error: error.message });
    }
});

// ✅ Get Serviceman Membership Tiers
router.get("/getMembership", protectRoute("serviceman"), async (req, res) => {
    try {
        const serviceman = await Serviceman.findById(req.user.id).select("basic professional elite");
        if (!serviceman) {
            return res.status(404).json({ message: "Serviceman not found" });
        }
        res.status(200).json(serviceman);
    } catch (error) {
        console.error("Error fetching membership tiers:", error);
        res.status(500).json({ message: "Failed to fetch membership tiers", error: error.message });
    }
});
module.exports = router;
