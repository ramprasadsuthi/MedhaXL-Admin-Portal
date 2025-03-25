const db = require('../config/database');
const bcrypt = require('bcrypt');



const securityController = {
    // Fetch current user data
    getUserData: (req, res) => {
        const userId = req.query.userId; // Assuming userId is sent in request

        const query = 'SELECT email, username, password FROM login WHERE id = ?';
        db.query(query, [userId], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: 'Database error' });
            }
            if (result.length === 0) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            res.json(result[0]); // Send user details
        });
    },

    // Update security details
    updateSecurity: async (req, res) => {
        const { userId, email, username, password } = req.body;

        try {
            // Validate password strength
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordRegex.test(password)) {
                return res.status(400).json({ success: false, message: 'Weak password! Must contain uppercase, lowercase, number, and special character.' });
            }

            // Hash new password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Update database
            const query = 'UPDATE login SET email = ?, username = ?, password = ? WHERE id = ?';
            db.query(query, [email, username, hashedPassword, userId], (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ success: false, message: 'Failed to update security details' });
                }
                res.json({ success: true, message: 'Security details updated successfully' });
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },
};

module.exports = securityController;