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

async function updateBatchStatus() {
    const batchID = document.getElementById("batchCode").value;
    const status = document.getElementById("Status").value;

    if (!batchID || !status) {
        alert("Please fill out all fields");
        return false;
    }

    const batch = {
        BatchID: batchID,
        Status: status
    };

    try {
        const response = await fetch("/updateBatchStatus", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(batch)
        });

        if (response.ok) {
            alert("Batch Status Updated Successfully!");
            window.location.reload();
        } else {
            alert("Failed to Update Batch Status");
        }
    } catch (error) {
        console.error("Error updating batch status:", error);
    }
    return false;
}

function loadBatches() {
    const isActive = document.getElementById("activeStatus").checked;
    const isInactive = document.getElementById("inactiveStatus").checked;
    let endpoint = "/batches";

    if (isActive && !isInactive) {
        endpoint = "/batches?status=Active";
    } else if (isInactive && !isActive) {
        endpoint = "/batches?status=Inactive";
    }

    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            const batchDropdown = document.getElementById("batchCode");
            batchDropdown.innerHTML = '<option value="">Select Batch</option>';
            data.forEach(batch => {
                let option = document.createElement("option");
                option.value = batch.batchid;
                option.textContent = batch.batchid;
                batchDropdown.appendChild(option);
            });
        })
        .catch(error => console.error("Error fetching batches:", error));
}

document.addEventListener("DOMContentLoaded", loadBatches);