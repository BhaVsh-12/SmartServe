const { requestDB } = require("../config/db");
const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  servicemanId: { type: mongoose.Schema.Types.ObjectId, ref: "Serviceman", required: true },
  service: { type: String, default: "" },
  serviceman: { type: String, default: "" },
  description: { type: String, default: "" },
  price: { type: Number, default: 0 },
  paid: { type: String, default: "", enum: ["paid", "unpaid",""] },
  paymentmethod: { type: String, default: "Card", enum: ["Card", "UPI"] },
  upiid:{type:String,default:""},
  cardno:{type:String,default:"0"},
  userstatus: { type: String, enum: ["pending", "completed", "declined", "pursuing"], default: "pending" },
  servicestatus: { type: String, enum: ["accepted", "rejected", "completed", ""], default: "" },
  clientname: { type: String, default: "" },
  location: { type: String, default: "" },
  clientPhoto: {
    type: String,
    default: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  paymentAt: { type: Date, default: Date.now },
});

const Request = requestDB.model("Request", requestSchema);

module.exports = Request;