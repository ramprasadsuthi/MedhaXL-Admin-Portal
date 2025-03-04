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