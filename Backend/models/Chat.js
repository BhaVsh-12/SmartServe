const mongoose = require("mongoose");
const { chatDB } = require("../config/db");

const chatSchema = new mongoose.Schema({
    roomId: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    servicemanId: { type: mongoose.Schema.Types.ObjectId, ref: "Serviceman", required: true },
    userPhoto: {
        type: String,
        default: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
      servicemanPhoto: {
        type: String,
        default: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
      username: { type: String, default: "" },
      servicemanname: { type: String, default: "" },
    messages: [
        {
            sender: { type: String, enum: ["user", "serviceman"] },
            message: { type: String, default: "" },
            timestamp: { type: Date, default: Date.now },
        },
    ],
});

module.exports = chatDB.model("Chat", chatSchema);