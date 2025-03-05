const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import controllers
const authController = require('./src/backend/controllers/authController');
const studentController = require('./src/backend/controllers/studentController');
const enquiryController = require('./src/backend/controllers/enquiryController');
const coursecontrollers = require("./src/backend/controllers/coursecontrollers");
const batchControllers = require("./src/backend/controllers/batchController");
const trainerController = require("./src/backend/controllers/trainerController");
const paymentscontrollers = require("./src/backend/controllers/paymentscontrollers");

// Import auth middleware
const { verifyToken } = require('./src/backend/middleware/authMiddleware');
const { get } = require('http');

const app = express();
const PORT = 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

console.log('Connected to MySQL Database.');

// Enquiry routes
app.post('/EnquiryForm', enquiryController.submitEnquiry);
app.get('/total-enquiries', enquiryController.getTotalEnquiries);
app.get('/latest-enquiries', enquiryController.getLatestEnquiries);
// Course routes dor add batch also 
app.get('/courses', coursecontrollers.getCourses);

// Trainer routes
app.post('/trainers', trainerController.addTrainer);

// Auth routes
app.post('/loginpage', authController.login);

// Protected route
app.get('/protected', verifyToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'Dashboard.html'));
});
// Student routes
app.post('/register', studentController.registerStudent);
app.get('/students', studentController.getStudents);
// fech api to the pdf /latest-student
app.get('/latest-student', studentController.getLatestStudent);
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
//**fretch api to diplay the total courses frm the coourse table */
app.get("/totalcourses", coursecontrollers.getTotalCourses);
//**FETCH THE API TO VEW THE STUNDETS WITH SAME CODE */
app.get('/getstudents', studentController.getstudents);
//**FETCH THE API TO VEW THE count of teh running course */
app.get('/batchcount', batchControllers.Activecount);
app.get('/active-courses', batchControllers.getActiveCourses);
//**get the total courses view waht we offered */
app.get('/viewtotalcourses', coursecontrollers.getviewtotalcourses);
//**fetch  the get studnets from the students table */
app.get("/search", studentController.searchStudents);
//**fetch the aoi to edit teh data of the students */
app.put("/update/:id", studentController.updateStudent);
//**fetch teh api to add the active batches */
app.post("/addBatch", batchControllers.addBatch);
// Batch routes disply only teh batches if from the batches table
app.get('/batches', batchControllers.getbatches);
//**disly the datata to view the fee pending */
app.get("/getStudents/:batchCode", studentController.getStudentsByBatch);
//**can up date the total batch fee to this api */
app.get("/getBatches", batchControllers.getBatchesdata);
app.get("/getStudentsdata", paymentscontrollers.Studentspayment);
app.post("/savePayment", paymentscontrollers.savePayment);


//**get the /dailytransactions to view the data enetry */
app.get("/dailytransactions", paymentscontrollers.getDailyTransactions);
app.get("/checkTermExists", paymentscontrollers.checkTermExists);

// Static file serving
app.use(express.static(path.join(__dirname, 'src/')));
app.use(express.static(path.join(__dirname, 'src/PAGES')));

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
