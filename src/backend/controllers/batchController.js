const db = require('../config/database');


const batchControllers = {
    getbatches: (req, res) => {
        const sql = "SELECT batchid FROM batches";
        db.query(sql, (err, result) => {
            if (err) {
                console.error("Error fetching batches:", err);
                res.status(500).json({ error: "Database error" });
            } else {
                res.json(result);
            }
        });
    }
};
module.exports = batchControllers;