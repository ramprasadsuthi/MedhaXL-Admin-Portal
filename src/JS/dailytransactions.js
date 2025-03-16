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