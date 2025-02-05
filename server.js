const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const PORT = 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mysql',
    database: 'mdb'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Database.');
});

// Your existing endpoint to handle the registration form data
app.post('/register', (req, res) => {
    const {
        trainingPartner, course, candidateName, surname, gender, dob, age, religion, category, subCategory,
        mobile, maritalStatus, bloodGroup, email, minQualification, yearPassing, highestQualification,
        physicallyHandicapped, guardianName, guardianOccupation, guardianContact, guardianIncome,
        doorNo, village, mandal, pincode, district, state, aadhar
    } = req.body;

    const sql = `INSERT INTO student (TrainingPartner, Course, FirstName, LastName, Gender, DateOfBirth, Age, Religion, Category, SubCategory, MobileNumber, MaritalStatus, BloodGroup, EmailID, MinQualification, YearOfPassingQualifyingExam, HighestQualification, PhysicallyHandicapped, GuardianName, GuardianOccupation, GuardianPhone, GuardianAnnualIncome, DoorNo, Town, Mandal, PinCode, District, State, AadharNumber) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [trainingPartner, course, candidateName, surname, gender, dob, age, religion, category, subCategory, mobile, maritalStatus, bloodGroup, email, minQualification, yearPassing, highestQualification, physicallyHandicapped, guardianName, guardianOccupation, guardianContact, guardianIncome, doorNo, village, mandal, pincode, district, state, aadhar], (err, result) => {
        if (err) {
            console.error('Error storing data:', err);
            return res.status(500).json({ success: false, message: 'Error storing data: ' + err.message });
        }
        console.log('Data inserted successfully:', result);
        res.json({ success: true, message: 'Student Registration successful!' });
    });
});

app.get('/students', (req, res) => {
    const sql = 'SELECT * FROM student';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            return res.status(500).send('Error fetching data');
        }
        res.json(results);
    });
});

app.use(express.static(path.join(__dirname, 'src')));

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
