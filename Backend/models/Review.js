const { reviewDB } = require("../config/db"); // ✅ Import reviewDB
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  servicemanId: { type: mongoose.Schema.Types.ObjectId, ref: "Serviceman", required: true },
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: "Request", required: true },
  rating: { type: Number, default: 0 },
  review: { type: String, default: "" },
  service: { type: String, default: "" },
  serviceman: { type: String, default: "" },
  clientname: { type: String, default: "" },
  clientPhoto: {
    type: String,
    default: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  createdAt: { type: Date, default: Date.now },
});

// ✅ Use reviewDB connection
const Review = reviewDB.model("Review", reviewSchema);

module.exports = Review;