const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();


// Import auth middleware
const { verifyToken } = require('./src/backend/middleware/authMiddleware');
const { get } = require('https');

const app = express();
const PORT = 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

console.log('Connected to MySQL Database.');


// Import controllers
const authController = require('./src/backend/controllers/authController');
const studentController = require('./src/backend/controllers/studentController');
const enquiryController = require('./src/backend/controllers/enquiryController');
const coursecontrollers = require("./src/backend/controllers/coursecontrollers");
const batchControllers = require("./src/backend/controllers/batchController");
const trainerController = require("./src/backend/controllers/trainerController");
const paymentscontrollers = require("./src/backend/controllers/paymentscontrollers");
const certificateController = require("./src/backend/controllers/certificateController");
const securityController = require("./src/backend/controllers/securityController");
const settingsController = require("./src/backend/controllers/settingsController");


// << AUTH ROUTES >>
app.post('/loginpage', authController.login);
app.post("/new-register-student", authController.registerStudent);
app.post("/studentlogin", authController.loginStudent);

// <<< SECURITY ROUTS>>
app.post("/check-email", securityController.checkEmail);
app.post("/check-username", securityController.checkUsername);
app.post("/check-password", securityController.checkPassword);
app.post("/update-security", securityController.updateSecurity);

// << SETTINGS >>
app.get("/getAdminDetails", settingsController.getAdminDetails);
app.post("/updateAdminDetails", settingsController.updateAdminDetails);


// << ENQUIRY ROUTES >>>
app.post('/EnquiryForm', enquiryController.submitEnquiry);
app.get('/total-enquiries', enquiryController.getTotalEnquiries);
app.get('/latest-enquiries', enquiryController.getLatestEnquiries);

// << COURSE ROUTES >>
// Course routes dor add batch also 
app.get('/courses', coursecontrollers.getCourses);
//**fretch api to diplay the total courses frm the coourse table */
app.get("/totalcourses", coursecontrollers.getTotalCourses);
//**get the total courses view waht we offered */
app.get('/viewtotalcourses', coursecontrollers.getviewtotalcourses);
app.post("/addcourse", coursecontrollers.addCourse);
app.get('/getAllcourses', coursecontrollers.getAllCourses);
app.delete("/deletecourse/:courseid", coursecontrollers.deleteCourse);


// <<< TRAINER ROUTES >>
// Trainer routes
app.post('/trainers', trainerController.addTrainer);

// << STUDENT ROUTES >>
// Student routes
app.post('/register', studentController.registerStudent);
app.get('/students', studentController.getStudents);
// fech api to the pdf /latest-student
app.get('/latest-student', studentController.getLatestStudent);
// GET THE PDF the studentid = student data
app.get('/student/:id', studentController.getStudentById);
//fech api to the /latest-students latest 10 student registrations
app.get('/latest-students', studentController.getLatestStudents);
// fech api to the /total-students total count of registrations
app.get('/total-students', studentController.getTotalStudents);
// fech api to the /total-enquiries total enquiries count
app.get('/total-enquiries', studentController.getTotalEnquiries);
//**FECH API TO THE /latest-enquiries LATEST 10 ENQUIRES */
app.get('/latest-enquiries', studentController.getLatestEnquiries);
//**FECH API RO THE /get-batch-codes TO GET THE STUDENT TABLE */
app.get('/get-batch-codes', studentController.getBatchCodes);
//**fetch the /export-students api to dwnload the excel sheet */
app.get('/export-students', studentController.exportStudents);
//**FETCH THE API TO VEW THE STUNDETS WITH SAME CODE */
app.get('/getstudents', studentController.getstudents);
//**fetch  the get studnets from the students table */
app.get("/search", studentController.searchStudents);
//**fetch the aoi to edit teh data of the students */
app.put("/update/:id", studentController.updateStudent);
//**disly the datata to view the fee pending */
app.get("/getStudents/:batchCode", studentController.getStudentsByBatch);
app.get("/getBatchesByStatus/:status", studentController.getBatchesByStatus);
app.post("/updateStudentStatus", studentController.updateStudentStatus);
app.get("/getStudentBatches", studentController.getStudentBatches);

// << BATCH ROUTES >>
//**FETCH THE API TO VEW THE count of teh running course */
app.get('/batchcount', batchControllers.Activecount);
app.get('/active-courses', batchControllers.getActiveCourses);
//**fetch teh api to add the active batches */
app.post("/addBatch", batchControllers.addBatch);
// Batch routes disply only teh batches if from the batches table
app.get('/batches', batchControllers.getBatches);
app.get("/batchecode", batchControllers.Batcheactive);
//**can up date the total batch fee to this api */
app.get("/getBatches", batchControllers.getBatchesdata);
//**set inactive batch status */
app.post("/updateBatchStatus", batchControllers.updateBatchStatus);

// <<< PAYMENTS ROUTES >>>
//**disply teh data */
app.get("/getStudentsdata", paymentscontrollers.Studentspayment);
//**to done successfully teh payment */
app.post("/savePayment", paymentscontrollers.savePayment);
//**get the /dailytransactions to view the data enetry */
app.get("/dailytransactions", paymentscontrollers.getDailyTransactions);
//**error check */
app.get("/checkTermExists", paymentscontrollers.checkTermExists);
//**get the pop up of the term date and amout */
app.get("/getTerms", paymentscontrollers.getTerms);

// ===== CERTIFICATE ROUTES =====
app.post("/upload", certificateController.uploadCertificate); // Route for uploading certificates
app.get("/certificate/:id", certificateController.getCertificate); // Route for retrieving certificates by Student ID



// Protected route
app.get('/protected', verifyToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'Dashboard.html'));
});
// Static file serving
app.use(express.static(path.join(__dirname, 'src'))); // Serve all static files from the src directory


// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});