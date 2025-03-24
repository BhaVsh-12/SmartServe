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


module.exports = router;