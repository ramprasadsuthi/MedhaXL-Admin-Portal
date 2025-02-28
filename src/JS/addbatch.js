

//**course dropdown list */
document.addEventListener("DOMContentLoaded", function () {
    fetch("/courses") // API Call to fetch courses
        .then(response => response.json())
        .then(data => {
            const courseDropdown = document.getElementById("course"); // Match ID
            data.forEach(course => {
                let option = document.createElement("option");
                option.value = course.coursename; // Set coursename as value
                option.textContent = course.coursename; // Display coursename
                courseDropdown.appendChild(option);
            });
        })
        .catch(error => console.error("Error fetching courses:", error));
});

//**!course dropdown */
//**add batches */
async function addBatch() {
    const batchID = document.getElementById("BatchID").value;
    const courseName = document.getElementById("courseDropdown").value;
    const duration = document.getElementById("Duration").value;
    const trainer = document.getElementById("Trainer").value;
    const status = document.getElementById("Status").value;

    const batch = { BatchID: batchID, CourseName: courseName, Duration: duration, Trainer: trainer, Status: status };

    try {
        const response = await fetch("/addBatch", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(batch)
        });

        if (response.ok) {
            alert("Batch Added Successfully!");
            window.location.reload();
        } else {
            alert("Failed to Add Batch");
        }
    } catch (error) {
        console.error("Error adding batch:", error);
    }
    return false;
}
//**!add batche */