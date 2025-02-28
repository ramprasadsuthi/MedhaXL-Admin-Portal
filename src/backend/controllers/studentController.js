const db = require('../config/database');
const ExcelJS = require('exceljs');


// Your existing endpoint to handle the registration form data
const studentController = {
    registerStudent: (req, res) => {
        const {
            campus, trainingPartner, course, batchCode, candidateName, surname, gender, dob, age, religion, category, subCategory,
            mobile, maritalStatus, bloodGroup, email, minQualification, yearPassing, highestQualification, physicallyHandicapped,
            guardianName, guardianOccupation, guardianContact, guardianIncome, doorNo, village, mandal, pincode, district, state, aadhar
        } = req.body;

        const sql = `INSERT INTO student (Campus, TrainingPartner, Course, BatchCode, FirstName, LastName, Gender, DateOfBirth, Age, Religion, Category, SubCategory, MobileNumber, MaritalStatus, BloodGroup, EmailID, MinQualification, YearOfPassingQualifyingExam, HighestQualification, PhysicallyHandicapped, GuardianName, GuardianOccupation, GuardianPhone, GuardianAnnualIncome, DoorNo, Town, Mandal, PinCode, District, State, AadharNumber) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        db.query(sql, [campus, trainingPartner, course, batchCode, candidateName, surname, gender, dob, age, religion, category, subCategory, mobile, maritalStatus, bloodGroup, email, minQualification, yearPassing, highestQualification, physicallyHandicapped, guardianName, guardianOccupation, guardianContact, guardianIncome, doorNo, village, mandal, pincode, district, state, aadhar], (err, result) => {
            if (err) {
                console.error('Error storing data:', err);
                return res.status(500).json({ success: false, message: 'Error storing data: ' + err.message });
            }
            console.log('Data inserted successfully:', result);
            res.json({ success: true, message: 'Student Registration successful!' });
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
        const sql = `SELECT StudentID, BatchCode, Course, FirstName, LastName, MobileNumber, EmailID FROM student
                     WHERE FirstName LIKE ? OR LastName LIKE ? OR MobileNumber LIKE ?`;
        const values = [`%${query}%`, `%${query}%`, `%${query}%`];

        db.query(sql, values, (err, results) => {

            if (err) {
                console.error('Search Error:', err);
                res.status(500).send('Server Error');
            } else {
                res.json(results);
            }
        });
    },

};
module.exports = studentController;
