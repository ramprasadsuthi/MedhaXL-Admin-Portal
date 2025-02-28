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
    },

    getActiveCourses: (req, res) => {
        const query = "SELECT COUNT(*) AS activeCourses FROM batches WHERE status = 'Active'";
        db.query(query, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).json({ message: "Database Error" });
            } else {
                res.json(result[0]);
            }
        });
    },
};
module.exports = batchControllers;