// const express = require("express");
// const User = require("../models/User");
// const Serviceman = require("../models/Serviceman"); // ✅ Import Serviceman model
// const protectRoute = require("../middleware/authMiddleware"); // ✅ Import auth middleware
// const Request = require("../models/Request");
// const Review=require("../models/Review");
// const router = express.Router();
// router.post("/create", protectRoute("serviceman"), async (req, res) => {
//     try {
//       const { requestId } = req.body;
//       const servicemanId = req.user.id;
//       const requestExists = await Request.findById(requestId).select('clientId serviceman clientname service clientPhoto');
//       const review = new Review({clientId:requestExists.clientId,servicemanId,requestId,service:requestExists.service,serviceman:requestExists.serviceman,clientname:requestExists.clientname,clientPhoto:requestExists.clientPhoto});
//       await review.save();
//       res.status(201).json({ message: "review created successfully" });
//     } catch (error) {
//       console.error("review creation error:", error);
//       res.status(500).json({ message: "Internal Server Error" });
//     }
//   });
  
//   module.exports = router;
