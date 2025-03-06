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

document.addEventListener("DOMContentLoaded", function () {
    fetch("/batches") // API call to backend
        .then(response => response.json())
        .then(data => {
            const batchDropdown = document.getElementById("batchCode");
            data.forEach(batch => {
                let option = document.createElement("option");
                option.value = batch.batchid;
                option.textContent = batch.batchid;
                batchDropdown.appendChild(option);
            });
        })
        .catch(error => console.error("Error fetching batches:", error));
});