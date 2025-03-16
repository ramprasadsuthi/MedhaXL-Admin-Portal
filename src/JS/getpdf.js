const { jsPDF } = window.jspdf;

// Function to fetch student data by ID
async function fetchStudentById(studentId) {
    try {
        const response = await fetch(`/student/${studentId}`);
        const data = await response.json();

        // Populate data into the fields
        document.getElementById("Campus").innerText = data.Campus;
        document.getElementById("TrainingPartner").innerText = data.TrainingPartner;
        document.getElementById("Course").innerText = data.Course;
        document.getElementById("FirstName").innerText = data.FirstName;
        document.getElementById("LastName").innerText = data.LastName;
        document.getElementById("Gender").innerText = data.Gender;
        document.getElementById("DateOfBirth").innerText = data.DateOfBirth;
        document.getElementById("Age").innerText = data.Age;
        document.getElementById("Religion").innerText = data.Religion;
        document.getElementById("Category").innerText = data.Category;
        document.getElementById("SubCategory").innerText = data.SubCategory;
        document.getElementById("MobileNumber").innerText = data.MobileNumber;
        document.getElementById("MaritalStatus").innerText = data.MaritalStatus;
        document.getElementById("BloodGroup").innerText = data.BloodGroup;
        document.getElementById("EmailID").innerText = data.EmailID;
        document.getElementById("MinQualification").innerText = data.MinQualification;
        document.getElementById("YearOfPassingQualifyingExam").innerText = data.YearOfPassingQualifyingExam;
        document.getElementById("HighestQualification").innerText = data.HighestQualification;
        document.getElementById("PhysicallyHandicapped").innerText = data.PhysicallyHandicapped;
        document.getElementById("GuardianName").innerText = data.GuardianName;
        document.getElementById("GuardianOccupation").innerText = data.GuardianOccupation;
        document.getElementById("GuardianPhone").innerText = data.GuardianPhone;
        document.getElementById("GuardianAnnualIncome").innerText = data.GuardianAnnualIncome;
        document.getElementById("DoorNo").innerText = data.DoorNo;
        document.getElementById("Town").innerText = data.Town;
        document.getElementById("Mandal").innerText = data.Mandal;
        document.getElementById("PinCode").innerText = data.PinCode;
        document.getElementById("District").innerText = data.District;
        document.getElementById("State").innerText = data.State;
        document.getElementById("AadharNumber").innerText = data.AadharNumber;

        // Enable Print Button
        document.querySelector(".save-btn").disabled = false;

    } catch (error) {
        console.error("Error fetching student data:", error);
        alert("Error fetching student details.");
    }
}

// Function to extract studentID from URL
function getStudentIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('studentID');
}

// Print the page as PDF using browser print
function printPDF() {
    const downloadBtn = document.querySelector(".save-btn");
    downloadBtn.style.visibility = "hidden"; // Hide the print button before print

    window.print(); // Open the print dialog

    setTimeout(() => {
        downloadBtn.style.visibility = "visible"; // Show the button again after printing
    }, 1000);
}

// MAIN EXECUTION
const studentID = getStudentIdFromUrl();
if (studentID) {
    fetchStudentById(studentID);
} else {
    alert("No Student ID found in the URL!");
}
