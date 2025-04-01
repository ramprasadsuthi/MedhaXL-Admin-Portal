// Sidebar Toggle sidebar
document.querySelector('.menu-icon').addEventListener('click', function () {
    document.querySelector('.sidebar').classList.toggle('show');
    // Toggle between 'menu' and 'cancel' icon
    if (this.textContent === "menu") {
        this.textContent = "cancel";
    } else {
        this.textContent = "menu";
    }
});


// Select elements
const notificationIcon = document.querySelector('.notification-icon');
const notificationDropdown = document.querySelector('.notification-dropdown');
const profileIcon = document.querySelector('.profile-icon');
const profileDropdown = document.querySelector('.profile-dropdown');

// Toggle notification dropdown
notificationIcon.addEventListener('click', function (event) {
    notificationDropdown.classList.toggle('show');
    profileDropdown.classList.remove('show'); // Close profile if open
    event.stopPropagation();
});

// Toggle profile dropdown
profileIcon.addEventListener('click', function (event) {
    profileDropdown.classList.toggle('show');
    notificationDropdown.classList.remove('show'); // Close notifications if open
    event.stopPropagation();
});

// Close dropdowns when clicking outside
window.addEventListener('click', function () {
    notificationDropdown.classList.remove('show');
    profileDropdown.classList.remove('show');
});

// Prevent closing when clicking inside the dropdowns
notificationDropdown.addEventListener('click', function (event) {
    event.stopPropagation();
});

profileDropdown.addEventListener('click', function (event) {
    event.stopPropagation();
});

//**end profile and notification */

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
toggleDropdown('.courses-menu', '.courses-submenu', '.courses-toggle');
toggleDropdown('.Batches-menu', '.Batches-submenu', '.Batches-toggle');
toggleDropdown('.trainers-menu', '.trainers-submenu', '.trainers-toggle');
toggleDropdown('.FInance-menu', '.FInance-submenu', '.FInance-toggle');
toggleDropdown('.certificate-menu', '.certificate-submenu', '.certificate-toggle');
//**endn the side bat and navbar actions */

document.addEventListener("DOMContentLoaded", function () {
    const statusFilter = document.getElementById("statusFilter");
    const batchTableBody = document.getElementById("batchTableBody");

    // Function to fetch batches based on the status filter
    function fetchBatches(status) {
        fetch(`/batches?status=${status}`)
            .then(response => response.json())
            .then(data => {
                batchTableBody.innerHTML = ""; // Clear table
                data.forEach(batch => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${batch.batchid}</td>
                        <td>${batch.coursename}</td>
                        <td>${batch.duration}</td>
                        <td>${batch.trainer}</td>
                        <td>${batch.status}</td>
                        <td>
                            <select class="status-dropdown" data-id="${batch.batchid}">
                                <option value="ON Going" ${batch.status === "ON Going" ? "selected" : ""}>ON Going</option>
                                <option value="Completed" ${batch.status === "Completed" ? "selected" : ""}>Completed</option>
                                <option value="Up Coming" ${batch.status === "Up Coming" ? "selected" : ""}>Up Coming</option>
                            </select>
                        </td>
                    `;
                    batchTableBody.appendChild(row);
                });

                // Add event listener to the status dropdown for each batch row
                document.querySelectorAll(".status-dropdown").forEach(select => {
                    select.addEventListener("change", function () {
                        updateBatchStatus(this.dataset.id, this.value);
                    });
                });
            })
            .catch(error => console.error("Error fetching batches:", error));
    }

    // Function to update batch status
    function updateBatchStatus(batchID, newStatus) {
        fetch("/updateBatchStatus", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ batchID, status: newStatus })
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message); // Show success message
                fetchBatches(statusFilter.value); // Re-fetch batches to show the updated status
            })
            .catch(error => console.error("Error updating status:", error));
    }

    // Event listener for changing the filter status
    statusFilter.addEventListener("change", () => fetchBatches(statusFilter.value));

    // Fetch batches with "ON Going" status by default
    fetchBatches("ON Going"); // Load batches with "ON Going" status by default
});


