let currentPage = 1;
const studentsPerPage = 10;
let students = [];

window.onload = async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');

    if (query) {
        document.getElementById('searchInput').value = query;

        try {
            const response = await fetch(`/search?query=${query}`);
            students = await response.json();
            if (students.length === 0) {
                alert('No data found');
            }
            displayStudents();
        } catch (error) {
            console.error('Failed to fetch students:', error);
        }
    }
};

function displayStudents() {
    const tableBody = document.getElementById('studentTableBody');
    tableBody.innerHTML = '';

    const startIndex = (currentPage - 1) * studentsPerPage;
    const endIndex = startIndex + studentsPerPage;
    const paginatedStudents = students.slice(startIndex, endIndex);

    paginatedStudents.forEach(student => {
        const row = `
            <tr>
                <td>${student.StudentID}</td>
                <td>${student.BatchCode}</td>
                <td>${student.Course}</td>
                <td>${student.FirstName}</td>
                <td>${student.LastName}</td>
                <td>${student.MobileNumber}</td>
                <td>${student.EmailID}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });

    document.getElementById('prevBtn').disabled = currentPage === 1;
    document.getElementById('nextBtn').disabled = endIndex >= students.length;
}

function nextPage() {
    currentPage++;
    displayStudents();
}

function prevPage() {
    currentPage--;
    displayStudents();
}

function redirectToSearch() {
    const query = document.getElementById('searchInput').value.trim();
    if (query) {
        window.location.href = `search.html?query=${query}`;
    }
    return false;
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        redirectToSearch();
    }
}
