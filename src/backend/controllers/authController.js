const db = require('../config/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const twilio = require("twilio");
require("dotenv").config();
const util = require('util');
const dbQuery = util.promisify(db.query).bind(db);

const secretKey = process.env.JWT_SECRET;
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);


let otpStore = {};
const authController = {

    loginUnified: async (req, res) => {
        const { identifier, password } = req.body;
        console.log("Incoming login request:", identifier);

        if (!identifier || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        try {
            const adminQuery = "SELECT * FROM login WHERE email = ? OR username = ?";
            const adminResults = await dbQuery(adminQuery, [identifier, identifier]);

            if (adminResults.length > 0) {
                const admin = adminResults[0];
                const isAdminMatch = await bcrypt.compare(password, admin.password);
                console.log("Admin match:", isAdminMatch);

                if (isAdminMatch) {
                    const token = jwt.sign({ userId: admin.id, role: "admin" }, secretKey, { expiresIn: "1h" });
                    return res.status(200).json({ token, role: "admin" });
                }
            }

            const studentQuery = "SELECT * FROM student_login WHERE can_id = ? OR username = ? Or phone = ?";
            const studentResults = await dbQuery(studentQuery, [identifier, identifier, identifier]);

            if (studentResults.length > 0) {
                const student = studentResults[0];
                const isStudentMatch = await bcrypt.compare(password, student.password);
                console.log("Student match:", isStudentMatch);

                if (isStudentMatch) {
                    // Fetch student data from student table where StudentID matches can_id
                    const studentDataQuery = "SELECT * FROM student WHERE StudentID = ?";
                    const studentDataResults = await dbQuery(studentDataQuery, [student.can_id]);
                    const studentData = studentDataResults.length > 0 ? studentDataResults[0] : null;

                    const token = jwt.sign({ userId: student.id, role: "student", can_id: student.can_id }, secretKey, { expiresIn: "1h" });
                    return res.status(200).json({ token, role: "student", studentData });
                }
            }

            return res.status(401).json({ message: "Invalid credentials." });

        } catch (error) {
            console.error("Login error:", error.message);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    },


    //**new student register for  login */
    registernewStudent: async (req, res) => {
        const { can_id, fullname, email, phone, username, password } = req.body;

        if (!can_id || !fullname || !email || !phone || !username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        try {
            // Check if student already exists (by CAN-ID or Email)
            const checkUserQuery = "SELECT * FROM student_login WHERE can_id = ? OR email = ? OR phone = ?";
            db.query(checkUserQuery, [can_id, email, phone], async (err, results) => {
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
                const insertQuery = "INSERT INTO student_login (can_id, fullname, email, phone, username, password) VALUES (?, ?, ?, ?, ?, ?)";
                db.query(insertQuery, [can_id, fullname, email, phone, username, hashedPassword], (err, result) => {
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

    //** RESETT PASSCODE */
    verifyPhone: (req, res) => {
        const { phone } = req.body;

        const query = "SELECT * FROM student WHERE MobileNumber = ?";
        db.query(query, [phone], (err, results) => {
            if (err) return res.status(500).json({ success: false, message: "Database error." });
            if (results.length === 0) return res.json({ success: false, message: "Phone number not registered." });

            res.json({ success: true });
        });
    },

    verifyAadhar: (req, res) => {
        const { phone, aadhar } = req.body;

        const query = "SELECT * FROM student WHERE MobileNumber = ? AND AadharNumber = ?";
        db.query(query, [phone, aadhar], (err, results) => {
            if (err) return res.status(500).json({ success: false, message: "Database error." });
            if (results.length === 0) return res.json({ success: false, message: "Aadhaar does not match." });

            res.json({ success: true });
        });
    },

    resetPassword: async (req, res) => {
        const { phone, aadhar, canId, newPassword } = req.body;
    
        const validateQuery = `
            SELECT * FROM student
            WHERE MobileNumber = ? AND AadharNumber = ? AND StudentID = ?
        `;
    
        db.query(validateQuery, [phone, aadhar, canId], async (err, results) => {
            if (err) return res.status(500).json({ success: false, message: "Error checking identity." });
    
            if (results.length === 0) {
                return res.json({
                    success: false,
                    message: "Sorry, something went wrong with the universe. Please contact the MEDHAXL admin team.",
                });
            }
    
            try {
                const hashedPassword = await bcrypt.hash(newPassword, 10);
    
                const updateQuery = "UPDATE student_login SET password = ? WHERE phone = ? AND can_id = ?";
                db.query(updateQuery, [hashedPassword, phone, canId], (updateErr, result) => {
                    if (updateErr) {
                        return res.status(500).json({ success: false, message: "Error updating password." });
                    }
    
                    res.json({ success: true });
                });
            } catch (error) {
                res.status(500).json({ success: false, message: "Error hashing password." });
            }
        });
    },    


};

module.exports = authController;