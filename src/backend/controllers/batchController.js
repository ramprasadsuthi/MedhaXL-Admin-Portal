const db = require('../config/database');


const batchControllers = {
    getBatches: (req, res) => {
        const status = req.query.status;
        let sql = "SELECT batchid, coursename, duration, trainer, status FROM batches";

        if (status !== "All") {
            sql += " WHERE status = ?";
        }

        db.query(sql, status !== "All" ? [status] : [], (err, result) => {
            if (err) {
                console.error("Error fetching batches:", err);
                return res.status(500).json({ error: "Database error" });
            }
            res.json(result);
        });
    },

    updateBatchStatus: (req, res) => {
        const { batchID, status } = req.body;
        const sql = "UPDATE batches SET status = ? WHERE batchid = ?";

        db.query(sql, [status, batchID], (err, result) => {
            if (err) {
                console.error("Error updating batch status:", err);
                return res.status(500).json({ error: "Database error" });
            }
            res.json({ message: "Batch status updated successfully!" });
        });
    },

    //**for student from */
    Batcheactive: (req, res) => {
        const sql = "SELECT batchid FROM batches WHERE Status = 'Active'";
        db.query(sql, (err, result) => {
            if (err) {
                console.error("Error fetching batches:", err);
                res.status(500).json({ error: "Database error" });
            } else {
                res.json(result);
            }
        });
    },


    //**active courses count */
    Activecount: (req, res) => {
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

    //**add teh batch */
    addBatch: (req, res) => {
        const { BatchID, CourseName, Duration, Trainer, Status } = req.body;

        const query = `INSERT INTO batches (batchid, coursename, duration, trainer, status) VALUES (?, ?, ?, ?, ?)`;

        db.query(query, [BatchID, CourseName, Duration, Trainer, Status], (err, result) => {
            if (err) {
                console.error("Database Error:", err);
                res.status(500).json({ message: "Failed to Add Batch" });
            } else {
                res.status(200).json({ message: "Batch Added Successfully" });
            }
        });
    },

    //** get the active courses pop up */
    getActiveCourses: (req, res) => {
        const sql = `SELECT batchid, coursename, duration, trainer, status FROM batches WHERE status = 'Active'`;

        db.query(sql, (err, results) => {
            if (err) {
                console.error("Fetching Active Courses Error:", err);
                res.status(500).json({ message: "Database Error" });
            } else {
                res.status(200).json(results);
            }
        });
    },

    getBatchesdata: (req, res) => {
        db.query("SELECT BatchID, CourseName, Status FROM batches", (err, result) => {
            if (err) throw err;
            res.json(result);
        });
    },


};
module.exports = batchControllers;