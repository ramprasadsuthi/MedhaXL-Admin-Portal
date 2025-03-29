const db = require('../config/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const secretKey = process.env.JWT_SECRET;

const authController = {
    login: (req, res) => {
        const { emailOrusername, password } = req.body;

        // Fix SQL to match either email OR username
        const sql = "SELECT * FROM login WHERE email = ? OR username = ?";
        db.query(sql, [emailOrusername, emailOrusername], (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ success: false, message: "Internal server error" });
            }

            if (results.length > 0) {
                const user = results[0];
                const passwordIsValid = bcrypt.compareSync(password, user.password);

                if (!passwordIsValid) {
                    return res.status(401).json({ success: false, message: "Invalid email/username or password" });
                }

                const token = jwt.sign({ userId: user.id, email: user.email }, secretKey, { expiresIn: '90m' });

                res.json({
                    success: true,
                    message: 'Login successful',
                    token: token,
                    expiresIn: '90m'
                });
            } else {
                return res.status(401).json({ success: false, message: "Invalid email/username or password" });
            }
        });
    },

    //**new student register for  login */
    registerStudent: async (req, res) => {
        const { can_id, fullname, email, username, password } = req.body;

        if (!can_id || !fullname || !email || !username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        try {
            // Check if student already exists (by CAN-ID or Email)
            const checkUserQuery = "SELECT * FROM student_login WHERE can_id = ? OR email = ?";
            db.query(checkUserQuery, [can_id, email], async (err, results) => {
                if (err) {
                    console.error("Database error:", err);
                    return res.status(500).json({ message: "Database error" });
                }

                if (results.length > 0) {
                    return res.status(400).json({ message: "CAN-ID or Email already exists" });
                }

                // Hash password
                const hashedPassword = await bcrypt.hash(password, 10);

                // Insert student into database
                const insertQuery = "INSERT INTO student_login (can_id, fullname, email, username, password) VALUES (?, ?, ?, ?, ?)";
                db.query(insertQuery, [can_id, fullname, email, username, hashedPassword], (err, result) => {
                    if (err) {
                        console.error("Insert error:", err);
                        return res.status(500).json({ message: "Database error" });
                    }

                    res.status(201).json({ message: "Student registered successfully" });
                });
            });
        } catch (error) {
            console.error("Server error:", error);
            res.status(500).json({ message: "Server error" });
        }
    },

    //**student login */
    loginStudent: async (req, res) => {
        const { emailOrCanID, password } = req.body;

        if (!emailOrCanID || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        try {
            const checkUserQuery = "SELECT * FROM student_login WHERE can_id = ? OR email = ?";
            db.query(checkUserQuery, [emailOrCanID, emailOrCanID], async (err, results) => {
                if (err) return res.status(500).json({ message: "Database error", error: err });

                if (results.length === 0) {
                    return res.status(401).json({ message: "Invalid CAN-ID, Email, or Password. If the issue persists, please contact the MedhaXl Admin Team." });
                }

                const student = results[0];

                const isMatch = await bcrypt.compare(password, student.password);
                if (!isMatch) {
                    return res.status(401).json({ message: "Invalid CAN-ID, Email, or Password. If the issue persists, please contact the MedhaXl Admin Team." });
                }

                // Redirect without a success message
                res.status(200).json({ redirectTo: "/PAGES/studentdashboard.html" });
            });
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    },
};

module.exports = authController;
