const db = require("../config/database");
const multer = require("multer");

// Multer Storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("Certificate");

const certificateController = {
    uploadCertificate: (req, res) => {
        upload(req, res, (err) => {
            if (err) {
                console.log("Upload Error:", err);
                res.status(500).send("Upload Failed");
            } else {
                const { StudentID, StudentName } = req.body;
                const Certificate = req.file.buffer;
                const FileType = req.file.mimetype;

                const query = `INSERT INTO certificates (StudentID, StudentName, Certificate, FileType) VALUES (?, ?, ?, ?)`;
                db.query(query, [StudentID, StudentName, Certificate, FileType], (err, result) => {
                    if (err) {
                        console.log("Database Error:", err);
                        res.status(500).send("Failed to Upload Certificate");
                    } else {
                        console.log("Certificate Uploaded Successfully");
                        res.status(200).send("Certificate Uploaded Successfully");
                    }
                });
            }
        });
    },

};

module.exports = certificateController;