const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const db = require('../config/database');

const secretKey = process.env.JWT_SECRET;

const authController = {
    login: (req, res) => {
        const { email, password } = req.body;

        const sql = "SELECT * FROM login WHERE email = ?";
        db.query(sql, [email], (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ success: false, message: "Internal server error" });
            }

            if (results.length > 0) {
                const user = results[0];
                const passwordIsValid = bcrypt.compareSync(password, user.password);

                if (!passwordIsValid) {
                    return res.status(401).json({ success: false, message: "Invalid email or password" });
                }

                const token = jwt.sign({ userId: user.id, email: user.email }, secretKey, { expiresIn: '90m' });

                res.json({
                    success: true,
                    message: 'Login successful',
                    token: token,
                    expiresIn: '30m'
                });
            } else {
                return res.status(401).json({ success: false, message: "Invalid email or password" });
            }
        });
    }
};

module.exports = authController;
