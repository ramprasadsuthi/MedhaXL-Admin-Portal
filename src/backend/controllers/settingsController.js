const db = require("../config/database");

const settingsController = {
    getAdminDetails: (req, res) => {
        const userId = req.query.userId; // Get user ID from frontend

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        const query = "SELECT username, email FROM login WHERE id = ?"; // Fetch user by ID

        db.query(query, [userId], (err, result) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Database error", error: err });
            }

            if (result.length > 0) {
                res.json({ success: true, username: result[0].username, email: result[0].email });
            } else {
                res.json({ success: false, message: "User not found" });
            }
        });
    },

    updateAdminDetails: (req, res) => {
        const { userId, username, email } = req.body;

        if (!userId || !username || !email) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const query = "UPDATE login SET username = ?, email = ? WHERE id = ?";

        db.query(query, [username, email, userId], (err, result) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Database error", error: err });
            }

            if (result.affectedRows > 0) {
                res.json({ success: true, message: "Profile updated successfully" });
            } else {
                res.json({ success: false, message: "Failed to update profile" });
            }
        });
    },
};

module.exports = settingsController;
