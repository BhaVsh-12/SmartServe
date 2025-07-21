const express = require("express");
const User = require("../models/User");
const Serviceman = require("../models/Serviceman");
const Request =require("../models/Request");
const Review=require("../models/Review");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const protectRoute = require("../middleware/authMiddleware");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../config/cloudinary"); 
const { Readable } = require("stream"); 
const upload = multer({ storage: multer.memoryStorage() }); 
const { redisClient } = require("../config/redis")
router.post("/signup", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Login User
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, role: "client" }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, role: "client" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Logout User
router.post("/logout", async (req, res) => {
    try {
        res.json({ message: "Logged out successfully. Remove the token on the frontend." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get Service Providers by Subcategory
router.get("/getServicemans/:subCategory", protectRoute("client"), async (req, res) => {
    try {
        const { subCategory } = req.params;

        if (!subCategory) {
            return res.status(400).json({ message: "Subcategory is required" });
        }
        
        const servicemen = await Serviceman.find({ subCategory: new RegExp(`^${subCategory}$`, "i") }).select("-password");
                if (servicemen.length === 0) {
            return res.status(404).json({ message: "No service providers found in this subcategory" });
        }
        res.status(200).json(servicemen);
        
    } catch (error) {
        console.error("Error fetching servicemen:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.get("/getServiceman/:id", protectRoute("client"), async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Serviceman ID is required" });
        }

        const serviceman = await Serviceman.findById(id).select("-password");

        if (!serviceman) {
            return res.status(404).json({ message: "Serviceman not found" });
        }

        res.status(200).json(serviceman);
    } catch (error) {
        console.error("Error fetching serviceman:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.get("/getreviews/:id", protectRoute("client"), async (req, res) => {
    try {
        const { id: servicemanId } = req.params;
        const cacheKey = `serviceman_reviews_${servicemanId}`;

        if (!servicemanId) {
            return res.status(400).json({ message: "Serviceman ID is required" });
        }

        const cachedReviews = await redisClient.get(cacheKey);
        if (cachedReviews) {
            return res.status(200).json(JSON.parse(cachedReviews));
        }


        const reviews = await Review.find({
            servicemanId: servicemanId,
            reviewstatus: "completed",
        });

        if (!reviews || reviews.length === 0) {
            return res.status(404).json({ message: "No reviews available" });
        }

        await redisClient.set(cacheKey, JSON.stringify(reviews), 'EX', 1800);

        res.status(200).json(reviews);
    } catch (error) {
        console.error("Error fetching serviceman reviews:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/getProfile", protectRoute("client"), async (req, res) => {
    try {
        const redisKey = `user_profile_${req.user.id}`;

        // Try fetching from Redis
        const cached = await redisClient.get(redisKey);
        if (cached) return res.json(JSON.parse(cached));

        // If not in cache, fetch from DB
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        // Cache it for next time (optional TTL)
        await redisClient.set(redisKey, JSON.stringify(user), 'EX', 3600); // 1 hour TTL

        res.json(user);
    } catch (error) {
        console.error("Profile fetch error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// Update User Profile
router.put("/updateProfile", protectRoute("client"), async (req, res) => {
    try {
        const { fullName, location } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (fullName) user.fullName = fullName;
        if (location) user.location = location;

        await user.save();

        // Invalidate Redis cache
        await redisClient.del(`user_profile_${req.user.id}`);

        res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
        console.error("Profile update error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Upload User Profile Photo
router.post(
  "/uploadPhoto",
  protectRoute("client"),
  upload.single("profilePhoto"),
  async (req, res) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const buffer = file.buffer;
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "user_profiles" }, // Cloudinary folder
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        Readable.from(buffer).pipe(stream);
      });

      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { profilePhoto: uploadResult.secure_url },
        { new: true, select: "-password" }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        message: "Profile photo uploaded to Cloudinary",
        imageUrl: uploadResult.secure_url,
        user: updatedUser,
      });
    } catch (error) {
      console.error("❌ Cloudinary upload error:", error);
      res.status(500).json({ message: "Upload failed", error: error.message });
    }
  }
);

router.get("/getMembership/:servicemanId", protectRoute("client"), async (req, res) => {
    try {
        const {servicemanId}=req.params;
        const serviceman = await Serviceman.findById(servicemanId).select("basic professional elite");
        if (!serviceman) {
            return res.status(404).json({ message: "Serviceman not found" });
        }
        res.status(200).json(serviceman);
        console.log(serviceman);
    } catch (error) {
        console.error("Error fetching membership tiers:", error);
        res.status(500).json({ message: "Failed to fetch membership tiers", error: error.message });
    }
});
module.exports = router;