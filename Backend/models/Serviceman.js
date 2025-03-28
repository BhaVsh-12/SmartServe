const { servicemanDB } = require("../config/db"); // Import servicemanDB connection
const mongoose = require("mongoose");
console.log("Debug: Serviceman.js: Checking servicemanDB...");
if (servicemanDB) {
    console.log("Debug: Serviceman.js: servicemanDB is available.");
} else {
    console.log("Debug: Serviceman.js: servicemanDB is not available.");
}


const ServicemanSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePhoto: { 
        type: String, 
        default: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
    }, // Default profile image
    fullName: { type: String, default: "" },
    description: { type: String, default: "" },
    serviceCategory: { type: String, default: "" },
    subCategory: { type: String, default: "" },
    availability: { type: Boolean, default: true }, // true = available, false = unavailable
    location: { type: String, default: "" },
    price: { type: Number, default: 0, min: 0 }, // Ensure non-negative prices
    rating: { type: Number, default: 0, min: 0, max: 5 }, // Average rating (0-5)
    noofreviews:{type:Number,default:0},
    experience:{ type: Number, default: 0, min: 0,max:50 },
    reviews: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
        rating: { type: Number, default: 0, min: 0, max: 5 }, // Review rating (0-5)
        comment: { type: String, default: "" },
        date: { type: Date, default: Date.now },
    }]
}, { timestamps: true });

const Serviceman = servicemanDB.model("Serviceman", ServicemanSchema);
console.log("Debug: Serviceman.js: Serviceman model created:", Serviceman);
module.exports = Serviceman;
