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




let page = 1;

function fetchTransactions(direction) {
    if (direction === 'next') {
        page++;
    } else if (direction === 'prev' && page > 1) {
        page--;
    }

    fetch(`/dailytransactions?page=${page}`)
        .then(response => response.json())
        .then(data => {
            const table = document.getElementById('transactionTable');
            table.innerHTML = '';

            data.forEach(transaction => {
                const row = `<tr>
                    <td>${transaction.TransactionID}</td>
                    <td>${transaction.StudentID}</td>
                    <td>${transaction.BatchCode}</td>
                    <td>${transaction.Course}</td>
                    <td>${transaction.Name}</td>
                    <td>${transaction.MobileNumber}</td>
                    <td>${transaction.AmountPaid}</td>
                    <td>${transaction.Term}</td>
                    <td>${transaction.PaidDate}</td>
                </tr>`;
                table.innerHTML += row;
            });
        });
}

window.onload = () => fetchTransactions();