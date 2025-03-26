const db = require("../config/database");
const bcrypt = require("bcrypt");

const securityController = {
    // Validate email
    checkEmail: async (req, res) => {
        const { email } = req.body;
        try {
            const [rows] = await db.promise().query("SELECT * FROM login WHERE email = ?", [email]);
            if (rows.length > 0) {
                res.json({ success: true });
            } else {
                res.json({ success: false });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: "Database error" });
        }
    },

    // Validate username
    checkUsername: async (req, res) => {
        const { email, username } = req.body;
        try {
            const [rows] = await db.promise().query("SELECT * FROM login WHERE email = ? AND username = ?", [email, username]);
            if (rows.length > 0) {
                res.json({ success: true });
            } else {
                res.json({ success: false });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: "Database error" });
        }
    },

    // Verify password

    checkPassword: async (req, res) => {
        const { email, password } = req.body;
        try {
            const [rows] = await db.promise().query("SELECT password FROM login WHERE email = ?", [email]);
            if (rows.length === 0) return res.json({ success: false });

            const match = await bcrypt.compare(password, rows[0].password);
            res.json({ success: match });
        } catch (error) {
            res.status(500).json({ success: false, message: "Database error" });
        }
    },


    // Update Security Settings
    updateSecurity: async (req, res) => {
        const { email, newPassword } = req.body;
        try {
            const hashedPassword = await bcrypt.hash(newPassword, 12);
            await db.promise().query("UPDATE login SET password = ? WHERE email = ?", [hashedPassword, email]);
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ success: false, message: "Database error" });
        }
    },
};

module.exports = securityController;
