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
toggleDropdown('.courses-menu', '.courses-submenu', '.courses-toggle');
toggleDropdown('.Batches-menu', '.Batches-submenu', '.Batches-toggle');
toggleDropdown('.trainers-menu', '.trainers-submenu', '.trainers-toggle');
toggleDropdown('.FInance-menu', '.FInance-submenu', '.FInance-toggle');
toggleDropdown('.certificate-menu', '.certificate-submenu', '.certificate-toggle');
//**endn the side bat and navbar actions */

document.addEventListener("DOMContentLoaded", function () {
    const statusFilter = document.getElementById("statusFilter");
    const batchTableBody = document.getElementById("batchTableBody");

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
                                <option value="Active" ${batch.status === "Active" ? "selected" : ""}>Active</option>
                                <option value="Inactive" ${batch.status === "Inactive" ? "selected" : ""}>Inactive</option>
                            </select>
                        </td>
                    `;
                    batchTableBody.appendChild(row);
                });

                document.querySelectorAll(".status-dropdown").forEach(select => {
                    select.addEventListener("change", function () {
                        updateBatchStatus(this.dataset.id, this.value);
                    });
                });
            })
            .catch(error => console.error("Error fetching batches:", error));
    }

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
                alert(data.message);
                fetchBatches(statusFilter.value);
            })
            .catch(error => console.error("Error updating status:", error));
    }

    statusFilter.addEventListener("change", () => fetchBatches(statusFilter.value));

    fetchBatches("Active"); // Load active batches by default
});

