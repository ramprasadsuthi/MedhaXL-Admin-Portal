const db = require('../config/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const util = require('util');
const dbQuery = util.promisify(db.query).bind(db);

const secretKey = process.env.JWT_SECRET;

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

            const studentQuery = "SELECT * FROM student_login WHERE can_id = ? OR username = ?";
            const studentResults = await dbQuery(studentQuery, [identifier, identifier]);

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


};

module.exports = authController;