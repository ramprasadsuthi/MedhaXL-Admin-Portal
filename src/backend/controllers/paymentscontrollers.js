const db = require('../config/database');



const paymentscontrollers = {


    getDailyTransactions: (req, res) => {
        const { page } = req.query;
        const limit = 10;
        const offset = (page - 1) * limit;

        const query = `SELECT TransactionID, StudentID, BatchCode, Course, Name, MobileNumber, AmountPaid, Term, PaidDate FROM dailytransactions LIMIT ? OFFSET ?`;

        db.query(query, [limit, offset], (err, results) => {
            if (err) {
                console.error("Database Error:", err);
                res.status(500).json({ message: "Failed to Fetch Transactions" });
            } else {
                res.json(results);
            }
        });
    },


    //**view the data for teh payments by the batchcode */
    Studentspayment: (req, res) => {
        const { batchID } = req.query;
        db.query("SELECT * FROM student WHERE BatchCode = ?", [batchID], (err, result) => {
            if (err) throw err;
            res.json(result);
        });
    },

    //**update only the total fee in the batch payments */
    savePayment: (req, res) => {
        const { studentID, totalFee } = req.body;
        const getTermQuery = `SELECT IFNULL(MAX(Term), 0) AS LastTerm FROM dailytransactions WHERE StudentID = ?`;

        db.query(getTermQuery, [studentID], (err, termResult) => {
            if (err) {
                console.error("Error fetching last term:", err);
                return res.status(500).json({ message: "Failed to fetch term" });
            }
            const lastTerm = termResult[0].LastTerm;
            console.log("Last Term:", lastTerm); // Debugging log
            const newTerm = lastTerm + 1; // Increment term correctly

            const updateQuery = `UPDATE student SET TotalFee = ?, TotalDue = CourseFee - DiscountAppiled - ? WHERE StudentID = ?`;
            db.query(updateQuery, [totalFee, totalFee, studentID], (updateErr) => {
                if (updateErr) {
                    console.error("Error updating student:", updateErr);
                    return res.status(500).json({ message: "Failed to update payment" });
                }

                const insertTransactionQuery = `INSERT INTO dailytransactions (StudentID, BatchCode, Course, Name, MobileNumber, AmountPaid, Term, PaidDate) 
                                               SELECT StudentID, BatchCode, Course, CONCAT(FirstName, ' ', LastName), MobileNumber, ?, ?, CURDATE() 
                                               FROM student WHERE StudentID = ?`;

                db.query(insertTransactionQuery, [totalFee, newTerm, studentID], (insertErr) => {
                    if (insertErr) {
                        console.error("Error inserting transaction:", insertErr);
                        return res.status(500).json({ message: "Failed to store transaction" });
                    }
                    res.json({ success: true, message: "Payment saved successfully" });
                });
            });
        });
    },

};

module.exports = paymentscontrollers;