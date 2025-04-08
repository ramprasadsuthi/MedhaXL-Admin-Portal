const jwt = require('jsonwebtoken'); // JWT module for token creation
const bcrypt = require('bcryptjs'); // Bcrypt for password hashing

const secretKey = process.env.JWT_SECRET; // Load secret key from environment

if (!secretKey) {
    throw new Error("JWT_SECRET is not set in environment variables.");
}

// Middleware to verify token
function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(403).json({ success: false, message: "Access denied. No token provided." });
    }

    // If token starts with "Bearer ", split it out
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ success: false, message: "Invalid or expired token." });
        }

        req.userId = decoded.userId;
        next();
    });
}

module.exports = {
    jwt,
    bcrypt,
    verifyToken
};
