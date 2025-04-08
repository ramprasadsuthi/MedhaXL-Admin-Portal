const db = require("../config/database");

const studentdashboardController = {
    getProfile: (req, res) => {
        const userId = req.userId;
        db.query("SELECT FullName FROM student_login WHERE id = ?", [userId], (err, results) => {
            if (err) return res.status(500).json({ message: "Database error" });
            if (results.length === 0) return res.status(404).json({ message: "User not found" });

            const { FullName } = results[0];
            res.json({ FullName });
        });
    },


};
module.exports = studentdashboardController;