const db = require("../config/database");
const multer = require("multer");

// Multer Storage Configuration (Memory Storage)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("Certificate");

const certificateController = {
    uploadCertificate: (req, res) => {
        upload(req, res, (err) => {
            if (err) {
                console.error("Upload Error:", err);
                return res.status(500).send("Upload Failed");
            }

            if (!req.file) {
                return res.status(400).send("No File Uploaded");
            }

            const { StudentID, StudentName } = req.body;
            const Certificate = req.file.buffer;
            const FileType = req.file.mimetype;

            if (!StudentID || !StudentName) {
                return res.status(400).send("All Fields are Required");
            }

            const query = `INSERT INTO certificates (StudentID, StudentName, Certificate, FileType) VALUES (?, ?, ?, ?)`;
            db.query(query, [StudentID, StudentName, Certificate, FileType], (err, result) => {
                if (err) {
                    console.error("Database Error:", err);
                    return res.status(500).send("Failed to Upload Certificate");
                }
                console.log("Certificate Uploaded Successfully");
                return res.status(200).send("Certificate Uploaded Successfully");
            });
        });
    },

    getCertificate: (req, res) => {
        const { id } = req.params;
        const query = `SELECT Certificate, FileType FROM certificates WHERE StudentID = ?`;
        db.query(query, [id], (err, result) => {
            if (err) {
                console.error("Database Error:", err);
                return res.status(500).send("Database Error");
            }

            if (result.length > 0) {
                res.contentType(result[0].FileType);
                res.send(result[0].Certificate);
            } else {
                return res.status(404).send("No Certificate Found");
            }
        });
    },
};

module.exports = certificateController;