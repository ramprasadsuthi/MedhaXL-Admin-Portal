// Sidebar Toggle sidebar
document.querySelector('.menu-icon').addEventListener('click', function () {
    document.querySelector('.sidebar').classList.toggle('show');
});


// Profile Dropdown Toggle
document.querySelector('.profile-icon').addEventListener('click', function () {
    document.querySelector('.profile-dropdown').classList.toggle('show');
});

// Dropdown Toggle Function
function toggleDropdown(menuSelector, submenuSelector, iconSelector) {
    document.querySelector(menuSelector).addEventListener('click', function () {
        document.querySelector(submenuSelector).classList.toggle('show');
        document.querySelector(iconSelector).textContent =
            document.querySelector(submenuSelector).classList.contains('show') ? 'expand_less' : 'expand_more';
    });
}

// Initialize dropdowns
toggleDropdown('.students-menu', '.students-submenu', '.students-toggle');
toggleDropdown('.Batches-menu', '.Batches-submenu', '.Batches-toggle');
toggleDropdown('.trainers-menu', '.trainers-submenu', '.trainers-toggle');
toggleDropdown('.FInance-menu', '.FInance-submenu', '.FInance-toggle');
//**endn the side bat and navbar actions */

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

    const batch = {
        BatchID: batchID,
        CourseName: courseName,
        Duration: duration,
        Trainer: trainer,
        Status: status
    };

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