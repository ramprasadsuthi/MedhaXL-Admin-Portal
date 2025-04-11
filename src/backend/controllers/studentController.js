const db = require('../config/database');
const ExcelJS = require('exceljs');


// Your existing endpoint to handle the registration form data
const studentController = {
    registerStudent: (req, res) => {
        const {
            campus, trainingPartner, course, batchCode, candidateName, surname, gender, dob, age, religion, category, subCategory,
            mobile, maritalStatus, bloodGroup, email, minQualification, yearPassing, highestQualification, physicallyHandicapped,
            guardianName, guardianOccupation, guardianContact, guardianIncome, doorNo, village, mandal, pincode, district, state, aadhar, CourseFee, discount, totalfee, totaldue, Status } = req.body;

        const sql =
            `INSERT INTO student (Campus, TrainingPartner, Course, BatchCode, FirstName, LastName, Gender, DateOfBirth, Age, Religion, Category, SubCategory,
             MobileNumber, MaritalStatus, BloodGroup, EmailID, MinQualification, YearOfPassingQualifyingExam, HighestQualification, PhysicallyHandicapped, GuardianName,
             GuardianOccupation, GuardianPhone, GuardianAnnualIncome, DoorNo, Town, Mandal, PinCode, District, State, AadharNumber, CourseFee, DiscountAppiled, TotalFee, TotalDue, Status) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        db.query(sql,
            [campus, trainingPartner, course, batchCode, candidateName, surname, gender, dob, age, religion, category, subCategory,
                mobile, maritalStatus, bloodGroup, email, minQualification, yearPassing, highestQualification, physicallyHandicapped,
                guardianName, guardianOccupation, guardianContact, guardianIncome, doorNo, village, mandal, pincode, district, state,
                aadhar, CourseFee, discount, totalfee, totaldue, Status], (err, result) => {
                    if (err) {
                        console.error('Error storing data:', err);
                        return res.status(500).json({ success: false, message: 'Error storing data: ' + err.message });
                    }
                    console.log('Data inserted successfully:', result);

                    const studentID = result.insertId;
                    const paidDate = new Date();
                    const term = 1;
                    const amountPaid = totalfee;
                    const name = `${candidateName} ${surname}`;

                    const dailySql = `INSERT INTO dailytransactions (StudentID, BatchCode, Course, Name, MobileNumber, AmountPaid, Term, PaidDate) 
                              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

                    db.query(dailySql, [studentID, batchCode, course, name, mobile, amountPaid, term, paidDate], (dailyErr, dailyResult) => {
                        if (dailyErr) {
                            console.error('Error inserting into dailytransactions:', dailyErr);
                            return res.status(500).json({ success: false, message: 'Error storing daily transaction: ' + dailyErr.message });
                        }
                        console.log('Daily transaction inserted successfully:', dailyResult);
                        res.json({ success: true, message: 'Student Registration successful!' });
                    });
                });
    },

    getStudents: (req, res) => {
        const sql = 'SELECT * FROM student';
        db.query(sql, (err, results) => {
            if (err) {
                console.error('Error fetching data:', err);
                return res.status(500).send('Error fetching data');
            }
            res.json(results);
        });
    },

    // API to fetch the latest inserted student data for pdf
    getLatestStudent: (req, res) => {
        const query = `SELECT * FROM student ORDER BY StudentID DESC LIMIT 1`;
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Database query failed" });
            }
            res.json(result[0]);  // Return the latest student entry
        });
    },

    //**get the pdf where student id */
    getStudentById: (req, res) => {
        const { id } = req.params;
        const sql = 'SELECT * FROM student WHERE StudentID = ?';
        db.query(sql, [id], (err, results) => {
            if (err) {
                console.error("Error fetching student data:", err);
                return res.status(500).json({ error: "Database error" });
            }
            if (results.length === 0) {
                return res.status(404).json({ message: "Student not found" });
            }
            res.json(results[0]);
        });
    },


    // API to fetch the latest 10 student registrations
    getLatestStudents: (req, res) => {
        const sql = `SELECT StudentID, BatchCode, CONCAT(FirstName, ' ', LastName) AS FullName, MobileNumber, Course, Town AS City 
                     FROM student 
                     ORDER BY StudentID DESC 
                     LIMIT 10`;

        db.query(sql, (err, results) => {
            if (err) {
                console.error("Error fetching latest students:", err);
                return res.status(500).json({ error: "Database query error" });
            }
            res.json(results);
        });
    },

    // total count
    getTotalStudents: (req, res) => {
        const sql = "SELECT COUNT(*) AS total FROM student"; // Correct table name
        db.query(sql, (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ totalStudents: result[0].total });
        });
    },

    // Get total enquiries count
    getTotalEnquiries: (req, res) => {
        db.query("SELECT COUNT(*) AS totalEnquiries FROM enroll", (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ totalEnquiries: result[0].totalEnquiries });
        });
    },

    // get the latest 10 enquries 
    getLatestEnquiries: (req, res) => {
        const sql = `SELECT id, name, phone, course, city FROM enroll ORDER BY id DESC LIMIT 10`;

        db.query(sql, (err, results) => {
            if (err) {
                console.error("Error fetching latest enquiries:", err);
                return res.status(500).json({ error: "Database query error" });
            }
            res.json(results);
        });
    },


    // **API to Fetch Batch Codes**
    getBatchCodes: (req, res) => {
        db.query("SELECT DISTINCT BatchCode FROM student", (err, results) => {
            if (err) return res.status(500).send("Database error.");
            res.json(results);
        });
    },
    //**end the  Batch Codes*/



    // **API to Export Students Data to Excel**
    exportStudents: async (req, res) => {
        const batchCode = req.query.batchCode;
        if (!batchCode) return res.status(400).send("Batch code is required.");

        const query = "SELECT * FROM student WHERE BatchCode = ?";
        db.query(query, [batchCode], async (err, results) => {
            if (err) return res.status(500).send("Database error.");
            if (results.length === 0) return res.status(404).send("No students found.");


            // Create Excel Workbook & Worksheet
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet(`Batch_${batchCode}`);

            // Define columns for Excel
            worksheet.columns = [
                { header: "Course Name", key: "Course", width: 25 },
                { header: "First Name", key: "FirstName", width: 20 },
                { header: "Last Name", key: "LastName", width: 20 },
                { header: "Gender", key: "Gender", width: 10 },
                { header: "Date of Birth", key: "DateOfBirth", width: 15 },
                { header: "Religion", key: "Religion", width: 15 },
                { header: "Category", key: "Category", width: 15 },
                { header: "Sub Category", key: "SubCategory", width: 15 },
                { header: "Trainee Mobile Number", key: "MobileNumber", width: 15 },
                { header: "Marital Status", key: "MaritalStatus", width: 15 },
                { header: "Blood Group", key: "BloodGroup", width: 25 },
                { header: "Email ID", key: "EmailID", width: 25 },
                { header: "Minimum Qualification", key: "MinQualification", width: 25 },
                { header: "Year Of Passing", key: "YearOfPassingQualifyingExam", width: 25 },
                { header: "Highest Qualification", key: "HighestQualification", width: 25 },
                { header: "Physically Challenged", key: "PhysicallyHandicapped", width: 25 },
                { header: "Father / Mother Name", key: "GuardianName", width: 25 },
                { header: "Father / Mother Occupation", key: "GuardianOccupation", width: 25 },
                { header: "Father / Mother Contact", key: "GuardianPhone", width: 25 },
                { header: "Father / Mother Annual Income", key: "GuardianAnnualIncome", width: 25 },
                { header: "DoorNo", key: "DoorNo", width: 25 },
                { header: "Village / tOWN", key: "Town", width: 25 },
                { header: "Mandal", key: "Mandal", width: 25 },
                { header: "District", key: "District", width: 20 },
                { header: "State", key: "State", width: 20 },
                { header: "Pin Code", key: "PinCode", width: 25 },
                { header: "Aadhar Number", key: "AadharNumber", width: 15 },
                { header: "Arogyasri Card", key: "ArogyasriCard", width: 15 },
                { header: "Date Of Appilication", key: "DateOfAppilication", width: 15 },
                { header: "Registration Fee", key: "RegistrationFee", width: 15 },
                { header: "Cash Receipt No", key: "CashReceiptNo", width: 15 },
                { header: "Cash Receipt Date", key: "CashReceiptDate", width: 15 },
                { header: "Hostel / Dayscholar", key: "HostelOrDayscholar", width: 15 },
                { header: "Bed No", key: "BedNo", width: 15 },
                { header: "Bank Account No", key: "BankAccountNo", width: 15 },
                { header: "Name Of Bank", key: "NameOfBank", width: 15 },
                { header: "Branch Of Bank", key: "BranchOfBank", width: 15 },
                { header: "IfscCode", key: "IfscCode", width: 15 },
                { header: "Rural / Urban", key: "RuralOrUrban", width: 15 },
                { header: "Branch / Subject", key: "BranchOrSubject", width: 15 },
            ];

            // Add student records
            results.forEach((row) => {
                worksheet.addRow(row);
            });

            // Set headers for file download
            res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            res.setHeader("Content-Disposition", `attachment; filename=students_batch_${batchCode}.xlsx`);

            // Write the Excel file and send as response
            await workbook.xlsx.write(res);
            res.end();
        });
    },

    //** excel pop up too view the data frm batch code */
    getstudents: (req, res) => {
        const batchCode = req.query.batchCode;
        if (!batchCode) return res.status(400).send("Batch code is required.");

        const query = "SELECT StudentID, FirstName, LastName, Course, MobileNumber, EmailID FROM student WHERE BatchCode = ?";
        db.query(query, [batchCode], (err, results) => {
            if (err) return res.status(500).send("Database error.");
            res.json(results);
        });
    },
    //** get the batch code and downloand ecxel code was interlinked end....... */

    // Search students by FirstName, LastName, or MobileNumber
    searchStudents: (req, res) => {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ message: "Query is required" });
        }

        const sql = `SELECT StudentID, BatchCode, Course, FirstName, LastName, MobileNumber, EmailID 
                     FROM student
                     WHERE BatchCode LIKE ? OR FirstName LIKE ? OR LastName LIKE ? OR MobileNumber LIKE ?`;
        const values = [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`];

        db.query(sql, values, (err, results) => {
            if (err) {
                console.error("Search Error:", err);
                return res.status(500).json({ message: "Database Error" });
            }
            res.status(200).json(results);
        });
    },

    updateStudent: (req, res) => {
        const id = req.params.id;
        const { StudentID, BatchCode, FirstName, LastName, MobileNumber, EmailID, Course } = req.body;

        const sql = `UPDATE student SET StudentID=?, BatchCode=?, FirstName=?, LastName=?, MobileNumber=?, EmailID=?, Course=? WHERE StudentID=?`;
        db.query(sql, [StudentID, BatchCode, FirstName, LastName, MobileNumber, EmailID, Course, id], (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: "Update failed" });
            } else {
                res.json({ message: "Student updated successfully" });
            }
        });
    },

    getStudentsByBatch: (req, res) => {
        const { batchCode } = req.params;
        const query = `SELECT StudentID, BatchCode, Course, FirstName, LastName, MobileNumber, CourseFee, DiscountAppiled, TotalFee, TotalDue, Status FROM student WHERE BatchCode = ?`;

        db.query(query, [batchCode], (err, result) => {
            if (err) {
                console.error("Database Error:", err);
                res.status(500).json({ message: "Failed to Fetch Students" });
            } else {
                res.json(result);
            }
        });
    },

    // Get distinct statuses from DB
    getStudentBatches: (req, res) => {
        const query = `SELECT DISTINCT Status FROM student WHERE Status IS NOT NULL`;

        db.query(query, (err, results) => {
            if (err) {
                console.error("DB Error (Get Statuses):", err);
                return res.status(500).json({ message: "Failed to fetch statuses" });
            }
            res.json(results);
        });
    },



    // Get Batch Codes by Status
    getBatchesByStatus: (req, res) => {
        const { status } = req.params;
        const query = `SELECT DISTINCT BatchCode FROM student WHERE Status = ?`;

        db.query(query, [status], (err, result) => {
            if (err) {
                console.error("DB Error:", err);
                res.status(500).json({ message: "Failed to fetch batches" });
            } else {
                res.json(result);
            }
        });
    },

    // Update Status for entire batch
    updateStudentStatus: (req, res) => {
        const { studentID } = req.body;

        // Fetch the BatchCode of the student
        const getBatchQuery = `SELECT BatchCode FROM student WHERE StudentID = ?`;

        db.query(getBatchQuery, [studentID], (err, result) => {
            if (err || result.length === 0) {
                console.error("DB Error (Fetch BatchCode):", err);
                return res.status(500).json({ success: false, message: "Failed to fetch batch code" });
            }

            const batchCode = result[0].BatchCode;

            // Instead of updating, return success with batchCode for redirection
            res.json({ success: true, batchCode });
        });
    },

    // Fetch all student logins with optional search
    getAllStudentLogins: (req, res) => {
        const search = req.query.search || "";
        const query = `
        SELECT can_id, fullname, email, username, password
        FROM student_login
        WHERE can_id LIKE ? OR email LIKE ? OR username LIKE ?
    `;

        db.query(query, [`%${search}%`, `%${search}%`, `%${search}%`], (err, results) => {
            if (err) {
                console.error("Error fetching student logins:", err);
                return res.status(500).json({ message: "Server error" });
            }

            res.json(results); // Send full data including username & password
        });
    },

    // Delete a student login
    deleteStudentLogin: (req, res) => {
        const { can_id } = req.params;
        const query = "DELETE FROM student_login WHERE can_id = ?";

        db.query(query, [can_id], (err, result) => {
            if (err) {
                console.error("Error deleting student login:", err);
                return res.status(500).json({ message: "Server error" });
            }
            res.json({ message: "Student login deleted successfully!" });
        });
    },

};
module.exports = studentController;
