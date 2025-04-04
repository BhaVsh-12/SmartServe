const mongoose = require("mongoose");

const userDB = mongoose.createConnection(process.env.USER_DB_URI, {
    serverSelectionTimeoutMS: 30000, 
    socketTimeoutMS: 45000, 
});

const servicemanDB = mongoose.createConnection(process.env.SERVICE_DB_URI, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
});
const requestDB = mongoose.createConnection(process.env.REQUEST_DB_URI, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
});
const reviewDB = mongoose.createConnection(process.env.REVIEW_DB_URI, {
    serverSelectionTimeoutMS: 30000, // Increase timeout to 30s
    socketTimeoutMS: 45000, // Increase socket timeout
});
const chatDB = mongoose.createConnection(process.env.CHAT_DB_URI, {
    serverSelectionTimeoutMS: 30000, // Increase timeout to 30s
    socketTimeoutMS: 45000, // Increase socket timeout
});
// ✅ Log successful connections
userDB.on("connected", () => console.log("✅ User Database Connected"));
userDB.on("error", err => console.error("❌ User Database Connection Failed:", err));

servicemanDB.on("connected", () => console.log("✅ Serviceman Database Connected"));
servicemanDB.on("error", err => console.error("❌ Serviceman Database Connection Failed:", err));

requestDB.on("connected", () => console.log("✅ requestDB Connected"));
requestDB.on("error", err => console.error("❌ requestDB Connection Failed:", err));

reviewDB.on("connected", () => console.log("✅ reviewDB Connected"));
reviewDB.on("error", err => console.error("❌ reviewDB Connection Failed:", err));


chatDB.on("connected", () => console.log("✅ chatDB Connected"));
chatDB.on("error", err => console.error("❌ chatDB Connection Failed:", err));
module.exports = { userDB, servicemanDB,requestDB,reviewDB,chatDB};
