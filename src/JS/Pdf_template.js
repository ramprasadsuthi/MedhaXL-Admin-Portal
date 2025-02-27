const { jsPDF } = window.jspdf;


async function fetchLatestStudent() {

    try {
        const response = await fetch("/latest-student");
        const data = await response.json();
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

    } catch (error) {
        console.error("Error fetching trainee data:", error);
    }
}

function printPDF() {
    const downloadBtn = document.querySelector(".save-btn"); // Select the button

    downloadBtn.style.visibility = "hidden"; // Hide the button

    window.print(); // Opens the print dialog

    setTimeout(() => {
        downloadBtn.style.visibility = "visible"; // Show the button after printing
    }, 1000); // Delay to ensure button reappears after printing
}

fetchLatestStudent();
