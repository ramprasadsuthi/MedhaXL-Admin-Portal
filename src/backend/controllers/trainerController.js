const db = require("../config/database");

// Trainer Controller
const trainerController = {
    // Add Trainer
    addTrainer: (req, res) => {
        const { trainerId, trainerName, phone, skill1, skill2, skill3, status } = req.body;

        // SQL Query to Insert Data
        const sql = "INSERT INTO trainers (trainerId, trainerName, phone, skill1, skill2, skill3, status) VALUES (?, ?, ?, ?, ?, ?, ?)";

        db.query(sql, [trainerId, trainerName, phone, skill1, skill2, skill3, status], (err, result) => {
            if (err) {
                console.error("Error inserting trainer:", err);
                res.status(500).json({ message: "Failed to add trainer" });
            } else {
                res.status(200).json({ message: "Trainer added successfully" });
            }
        });
    }
};

module.exports = trainerController;
