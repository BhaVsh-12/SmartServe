const jwt = require("jsonwebtoken");

const protectRoute = (requiredRole) => (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.error("❌ No Authorization header or incorrect format");
        return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log("✅ Token Decoded:", decoded); // Debugging

        // 🛑 Check if the role matches the required role
        if (requiredRole && decoded.role !== requiredRole) {
            console.error(`❌ Forbidden: Expected role '${requiredRole}', got '${decoded.role}'`);
            return res.status(403).json({ message: "Forbidden: You do not have the correct role" });
        }

        req.user = decoded;
        next();
    } catch (error) {
        console.error("❌ Token verification failed:", error.message);
        return res.status(401).json({ message: "Invalid or Expired Token" });
    }
};

module.exports = protectRoute;
