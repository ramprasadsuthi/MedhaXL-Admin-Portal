const jwt = require('jsonwebtoken'); // JWT module for token creation
const bcrypt = require('bcryptjs'); // Bcrypt for password hashing

const secretKey = process.env.JWT_SECRET; // Load secret key from environment

if (!secretKey) {
    throw new Error("JWT_SECRET is not set in environment variables.");
}

// Middleware to verify token
function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({ success: false, message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ success: false, message: "Invalid or expired token." });
        }

        req.userId = decoded.userId; // Attach user ID to request
        next(); // Proceed to the next middleware/route
    });
}

module.exports = {
    jwt,
    bcrypt,
    verifyToken
};
