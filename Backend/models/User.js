const { userDB } = require("../config/db"); // Import userDB connection
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePhoto: { 
        type: String, 
        default: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
    },
    location: { type: String, default: "" },
    fullName: { type: String, default: "" },

}, { timestamps: true });

const User = userDB.model("User", UserSchema);
module.exports = User;
