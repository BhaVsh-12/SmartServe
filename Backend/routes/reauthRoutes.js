const express = require("express");
const User = require("../models/User");
const Serviceman = require("../models/Serviceman"); // ✅ Import Serviceman model
const protectRoute = require("../middleware/authMiddleware"); // ✅ Import auth middleware
const Request = require("../models/Request");
const Review=require("../models/Review");
const router = express.Router();
router.post("/create", protectRoute("serviceman"), async (req, res) => {
    try {
      const { requestId } = req.body;
      const servicemanId = req.user.id;
      const requestExists = await Request.findById(requestId).select('clientId serviceman clientname service clientPhoto');
      const review = new Review({clientId:requestExists.clientId,servicemanId,requestId,service:requestExists.service,serviceman:requestExists.serviceman,clientname:requestExists.clientname,clientPhoto:requestExists.clientPhoto});
      await review.save();
      res.status(201).json({ message: "review created successfully" });
    } catch (error) {
      console.error("review creation error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  router.get("/getpendingreview", protectRoute("client"), async (req, res) => {
    try {
        const clientId = req.user.id;
        const reviews = await Review.find({ clientId: clientId, reviewstatus: "pending" });

        if (!reviews || reviews.length === 0) {
            return res.status(404).json({ message: "No pending reviews found" }); // Improved message clarity
        }

        res.status(200).json(reviews);

    } catch (error) {
        console.error("Get pending reviews error:", error); // More specific error message
        res.status(500).json({ message: "Internal server error" });
    }
});

router.put("/updatereview", protectRoute("client"), async (req, res) => {
  try {
      const { reviewId, rating, review } = req.body;
      const reviewExists = await Review.findById(reviewId);

      if (!reviewExists) {
          return res.status(404).json({ message: "Review not found" });
      }

      reviewExists.rating = rating;
      reviewExists.review = review;
      reviewExists.reviewstatus = "completed";

      const serviceman = await Serviceman.findById(reviewExists.servicemanId);

      if (!serviceman) {
          return res.status(404).json({ message: "Serviceman not found" });
      }

      serviceman.noofreviews = (serviceman.noofreviews || 0) + 1;
      serviceman.reviews.push({rating: rating}); //push an object with rating

      // Calculate average rating only if there are reviews
      if (serviceman.noofreviews > 0) {
          const totalRating = serviceman.reviews.reduce((acc, reviewObj) => acc + reviewObj.rating, 0);
          serviceman.rating = Math.round(totalRating / serviceman.noofreviews);
      } else {
          serviceman.rating = 0; // Or whatever default you want if no reviews
      }

      await serviceman.save();
      await reviewExists.save();

      res.status(200).json({ message: "Review updated successfully" });

  } catch (error) {
      console.error("Review update error:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});
  router.get("/completedreview", protectRoute("client"), async (req, res) => {
    try {
      const clientId = req.user.id; 
      const reviews = await Review.find({ clientId: clientId ,reviewstatus:"completed"}); 
      if (!reviews || reviews.length === 0) { 
        return res.status(404).json({ message: "No reviews available" }); 
      }
  
      res.status(200).json(reviews); 
  
    } catch (error) {
      console.error("Review retrieval error:", error); // Corrected error message
      res.status(500).json({ message: "Internal server error" });
    }
  });
  router.get("/getreview", protectRoute("serviceman"), async (req, res) => {
    try {
      const servicemanId = req.user.id;
      const reviews = await Review.find({
        servicemanId: servicemanId,
        reviewstatus: "completed",
      });
  
      if (!reviews || reviews.length === 0) {
        return res.status(404).json({ message: "No reviews available" });
      }
  
      res.status(200).json(reviews);
    } catch (error) {
      console.error("Review retrieval error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  

  module.exports = router;
