const express = require("express");
const User = require("../models/User");
const Serviceman = require("../models/Serviceman"); // ✅ Import Serviceman model
const protectRoute = require("../middleware/authMiddleware"); // ✅ Import auth middleware
const router = express.Router();
const Request = require("../models/Request");

router.post("/create", protectRoute("client"), async (req, res) => {
  try {
    const { servicemanId } = req.body;
    const clientId = req.user.id;
    const clientExists = await User.findById(clientId).select('location fullName profilePhoto');
    // Validate if servicemanId exists
    const servicemanExists = await Serviceman.findById(servicemanId).select('fullName subCategory description price');
    if (!servicemanExists) {
      return res.status(404).json({ message: "Serviceman not found" });
    }
    const request = new Request({ clientId, servicemanId,service:servicemanExists.subCategory,serviceman:servicemanExists.fullName,description:servicemanExists.description,price:servicemanExists.price,clientname:clientExists.fullName,location:clientExists.location,clientPhoto:clientExists.profilePhoto });
    await request.save();
    res.status(201).json({ message: "Request created successfully" });
  } catch (error) {
    console.error("Request creation error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/gethistory", protectRoute("client"), async (req, res) => {
  try {
    const clientId = req.user.id;
    const requests = await Request.find({ clientId: clientId });
    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching request history:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.get("/getrequest", protectRoute("serviceman"), async (req, res) => {
    try {
      const servicemanId = req.user.id;
      const requests = await Request.find({ servicemanId: servicemanId });
      res.status(200).json(requests);
    } catch (error) {
      console.error("Error fetching request history:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
router.post("/accept",protectRoute("serviceman"),async(req,res)=>{
    try{
        const {requestId}=req.body;
        const request=await Request.findById(requestId);
        if(!request){
            return res.status(404).json({message:"request not found"});
        }
        request.userstatus="pursuing";
        request.servicestatus="accepted";
        request.paid="unpaid";
        await request.save();
        res.status(200).json({message:"Request Acccepted succesfully"});

    }catch(error){
        console.error("Request accept error :",error);
        res.status(500).json({message:"internal server error"});
    }
});
router.post("/decline",protectRoute("serviceman"),async(req,res)=>{
    try{
        const {requestId}=req.body;
        const request=await Request.findById(requestId);
        if(!request){
            return res.status(404).json({message:"request not found"});
        }
        request.userstatus="declined";
        request.servicestatus="rejected";
        await request.save();
        res.status(200).json({message:"Request Declined succesfully"});

    }catch(error){
        console.error("Request decline error :",error);
        res.status(500).json({message:"internal server error"});
    }
});
router.post("/complete",protectRoute("serviceman"),async(req,res)=>{
    try{
        const {requestId}=req.body;
        const request=await Request.findById(requestId);
        if(!request){
            return res.status(404).json({message:"request not found"});
        }
        request.userstatus="completed";
        request.servicestatus="completed";
        await request.save();
        res.status(200).json({message:"Request completed succesfully"});

    }catch(error){
        console.error("Request complete error :",error);
        res.status(500).json({message:"internal server error"});
    }
});
router.put("/rebook",protectRoute("client"), async (req, res) => {
    try {
      const { requestId } = req.body;
      const request = await Request.findById(requestId);
  
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }
  
      request.userstatus = "pending";
      request.servicestatus = "";
      await request.save();
  
      res.status(200).json({ message: "Request rebooked successfully" });
    } catch (error) {
      console.error("Request rebook error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  router.delete("/cancle",protectRoute("client"), async (req, res) => {
    try {
      const { requestId } = req.body;
      const deletedRequest = await Request.findByIdAndDelete(requestId);

      if (!deletedRequest) {
          return res.status(404).json({ message: "Request not found" });
      }

      res.status(200).json({ message: "Request canceled successfully" });
    } catch (error) {
      console.error("Request deleted error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  router.get("/pendingpayments", protectRoute("client"), async (req, res) => {
    try {
        const clientId = req.user.id;
        const requests = await Request.find({ clientId, paid: "unpaid" }).lean();
        res.status(200).json(requests);
    } catch (error) {
        console.error("Error fetching pending payments:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get completed payments
router.get("/completedpayments", protectRoute("client"), async (req, res) => {
    try {
        const clientId = req.user.id;
        const requests = await Request.find({ clientId, paid: "paid" }).lean();
        res.status(200).json(requests);
    } catch (error) {
        console.error("Error fetching completed payments:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Process payment
router.put("/payment", protectRoute("client"), async (req, res) => {
    try {
        const { requestId, paymentmethod, cardno, upiid } = req.body;
        
        const request = await Request.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        // Ensure payment is not already processed
        if (request.paid === "paid") {
            return res.status(400).json({ message: "Payment already completed" });
        }

        // Validate payment method
        if (!["Card", "UPI"].includes(paymentmethod)) {
            return res.status(400).json({ message: "Invalid payment method" });
        }

        // Validate card number format (Basic check for 16-digit number)
        if (paymentmethod === "Card" && (!cardno || !/^\d{16}$/.test(cardno))) {
            return res.status(400).json({ message: "Invalid card number" });
        }

        // Validate UPI ID format (Basic check)
        if (paymentmethod === "UPI" && (!upiid || !/^[\w.-]+@[\w.-]+$/.test(upiid))) {
            return res.status(400).json({ message: "Invalid UPI ID" });
        }

        // Update request
        request.paid = "paid";
        request.paymentmethod = paymentmethod;
        if (paymentmethod === "Card") request.cardno = cardno;
        if (paymentmethod === "UPI") request.upiid = upiid;
        request.paymentAt = new Date();
        
        await request.save();
        res.status(200).json({ message: "Payment Successful" });

    } catch (error) {
        console.error("Error processing payment:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
  router.get("/getpayments", protectRoute("serviceman"), async (req, res) => {
    try {
      const servicemanId = req.user.id; // Assuming serviceman is logged in
      const requests = await Request.find({
        servicemanId: servicemanId,
        paid: { $in: ["paid", "unpaid"] }
      });
      console.log("Requests:",requests);
      res.status(200).json(requests);
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
  
module.exports = router;