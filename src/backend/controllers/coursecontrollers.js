const db = require('../config/database');

const coursecontrollers = {
    getCourses: (req, res) => {
        const sql = "SELECT coursename FROM courses"; // Fetch coursename
        db.query(sql, (err, result) => {
            if (err) {
                console.error("Error fetching courses:", err);
                return res.status(500).json({ error: "Database query failed" });
            }
            res.json(result); // Send as JSON
        });
    }
};

module.exports = coursecontrollers;
