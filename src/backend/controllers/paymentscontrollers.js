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


    //**pop oof the view the term amoutn and date */
    getTerms: (req, res) => {
        const { studentID } = req.query;
        const getTermsQuery = `SELECT Term, Name, AmountPaid, PaidDate FROM dailytransactions WHERE StudentID = ? ORDER BY Term`;
    
        db.query(getTermsQuery, [studentID], (err, result) => {
            if (err) {
                console.error("Error fetching terms:", err);
                return res.status(500).json({ message: "Failed to fetch terms" });
            }
            res.json(result);
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
        const { studentID, payAmount, term } = req.body;
        const checkTermQuery = `SELECT * FROM dailytransactions WHERE StudentID = ? AND Term = ?`;
    
        db.query(checkTermQuery, [studentID, term], (termErr, termResult) => {
            if (termErr) {
                console.error("Error checking term existence:", termErr);
                return res.status(500).json({ message: "Failed to check term existence" });
            }
    
            if (termResult.length > 0) {
                return res.status(400).json({ message: "Term already exists for this student" });
            }
    
            const updateQuery = `UPDATE student SET TotalFee = TotalFee + ?, TotalDue = CourseFee - DiscountAppiled - TotalFee WHERE StudentID = ?`;
            db.query(updateQuery, [payAmount, studentID], (updateErr) => {
                if (updateErr) {
                    console.error("Error updating student:", updateErr);
                    return res.status(500).json({ message: "Failed to update payment" });
                }
    
                const insertTransactionQuery = `INSERT INTO dailytransactions (StudentID, BatchCode, Course, Name, MobileNumber, AmountPaid, Term, PaidDate) 
                                               SELECT StudentID, BatchCode, Course, CONCAT(FirstName, ' ', LastName), MobileNumber, ?, ?, CURDATE() 
                                               FROM student WHERE StudentID = ?`;
    
                db.query(insertTransactionQuery, [payAmount, term, studentID], (insertErr) => {
                    if (insertErr) {
                        console.error("Error inserting transaction:", insertErr);
                        return res.status(500).json({ message: "Failed to store transaction" });
                    }
                    res.json({ success: true, message: "Payment saved successfully" });
                });
            });
        });
    },

    //**throw error same term num */
    checkTermExists: (req, res) => {
        const { studentID, term } = req.query;
        const query = `SELECT * FROM dailytransactions WHERE StudentID = ? AND Term = ?`;
    
        db.query(query, [studentID, term], (err, result) => {
            if (err) {
                console.error("Error checking term existence:", err);
                return res.status(500).json({ message: "Failed to check term existence" });
            }
            if (result.length > 0) {
                res.json({ exists: true });
            } else {
                res.json({ exists: false });
            }
        });
    },
    


};

module.exports = paymentscontrollers;