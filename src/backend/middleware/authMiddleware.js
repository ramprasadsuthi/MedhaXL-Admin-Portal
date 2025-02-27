const jwt = require('jsonwebtoken'); // JWT module for token creation
const bcrypt = require('bcryptjs'); // Bcrypt for password hashing
const secretKey = process.env.JWT_SECRET; // Replace with a strong secret key for JWT

// Middleware to verify token
function verifyToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ success: false, message: 'No token provided' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ success: false, message: 'Unauthorized or session expired' });
        }

        req.userId = decoded.userId; // You can use this in the protected routes
        next(); // Proceed to the next middleware/route
    });
}

module.exports = {
    jwt,
    bcrypt,
    secretKey,
    verifyToken
};
