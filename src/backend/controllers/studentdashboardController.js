const db = require("../config/database");

const studentdashboardController = {
    getProfile: (req, res) => {
        const userId = req.userId;

        const query = `
            SELECT s.FullName, st.Course, st.CourseFee, st.DiscountAppiled, st.TotalFee, st.TotalDue, 
                   ct.Certificate, ct.FileType
            FROM student_login s 
            JOIN student st ON s.can_id = st.studentid 
            LEFT JOIN certificates ct ON s.can_id = ct.StudentID
            WHERE s.id = ?

        `;

        db.query(query, [userId], (err, results) => {
            if (err) return res.status(500).json({ message: "Database error", error: err });
            if (results.length === 0) return res.status(404).json({ message: "User not found" });

            const {
                FullName, Course, CourseFee, DiscountAppiled, TotalFee, TotalDue,
                Certificate, FileType
            } = results[0];

            let base64Certificate = null;
            if (Certificate && Certificate.length > 0) {
                base64Certificate = Buffer.from(Certificate).toString("base64");
            }


            res.json({
                FullName,
                Course,
                CourseFee,
                DiscountAppiled,
                TotalFee,
                TotalDue,
                FileType,
                CertificateData: base64Certificate
            });
        });
    }
};

module.exports = studentdashboardController;
