// text to upper case
document.getElementById("registrationForm").addEventListener("submit", function () {
    const inputs = document.querySelectorAll("input[type='text']");
    inputs.forEach(input => {
        input.value = input.value.toUpperCase();
    });
});
// end the upper case


// Function to populate year of passing dropdown
function populateYearDropdown() {
    const yearSelect = document.getElementById('yearPassing');
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1970; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
}

// Function to validate DOB format and calculate age
function calculateAge() {
    const dobInput = document.getElementById('dob');
    const ageInput = document.getElementById('age');
    const dobError = document.getElementById('dobError');

    // Regular expression for DD-MM-YYYY format
    const dobRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(19|20)\d{2}$/;

    if (!dobRegex.test(dobInput.value)) {
        dobError.textContent = "Please enter DOB in DD-MM-YYYY format.";
        ageInput.value = "";
        return;
    } else {
        dobError.textContent = "";
    }

    // Convert DD-MM-YYYY to Date object
    const [day, month, year] = dobInput.value.split('-').map(Number);
    const dob = new Date(year, month - 1, day);
    const today = new Date();

    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
    }

    ageInput.value = age;
}


// Update sub-category based on selected category
function updateSubCategory() {
    const categorySelect = document.getElementById('category');
    const subCategorySelect = document.getElementById('subCategory');
    const category = categorySelect.value;

    // Clear existing options
    subCategorySelect.innerHTML = '<option value="">Select Sub Category</option>';

    // Add sub-categories based on selected category
    const subCategories = {
        'SC': ['SC'],
        'ST': ['ST'],
        'OBC': ['A', 'B', 'C', 'D'],
        'GENERAL': ['GENERAL']
    };

    if (subCategories[category]) {
        subCategories[category].forEach(subCat => {
            const option = document.createElement('option');
            option.value = subCat.toLowerCase();
            option.textContent = subCat;
            subCategorySelect.appendChild(option);
        });
    }
}

// Fetch location details based on pincode
async function fetchLocationDetails() {
    const pincodeInput = document.getElementById('pincode');
    const districtInput = document.getElementById('district');
    const stateInput = document.getElementById('state');
    const pincode = pincodeInput.value;

    if (pincode.length === 6) {
        try {
            const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
            const data = await response.json();

            if (data[0].Status === 'Success') {
                const location = data[0].PostOffice[0];
                districtInput.value = location.District;
                stateInput.value = location.State || 'Default State';  // Set default value if state is empty
            } else {
                districtInput.value = '';
                stateInput.value = 'Default State';
                alert('Invalid PIN Code');
            }
        } catch (error) {
            console.error('Error fetching location details:', error);
            districtInput.value = '';
            stateInput.value = 'Default State';
        }
    }
}

// Form validation
function validateForm() {
    const form = document.getElementById('registrationForm');
    const formData = new FormData(form);
    const errors = {};
    let isValid = true;

    // Validate required fields
    for (let [name, value] of formData.entries()) {
        const element = document.getElementById(name);
        if (element && element.required && !value.trim()) {
            errors[name] = 'This field is required';
            isValid = false;
        }
    }

    // Validate mobile numbers
    const mobileFields = ['mobile', 'guardianContact'];
    mobileFields.forEach(field => {
        const value = formData.get(field);
        if (value && !/^\d{10}$/.test(value)) {
            errors[field] = 'Enter a valid 10-digit mobile number';
            isValid = false;
        }
    });

    // Validate email
    const email = formData.get('email');
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors['email'] = 'Enter a valid email address';
        isValid = false;
    }

    // Validate Aadhar number
    const aadhar = formData.get('aadhar');
    if (aadhar && !/^\d{12}$/.test(aadhar)) {
        errors['aadhar'] = 'Enter a valid 12-digit Aadhar number';
        isValid = false;
    }

    // Validate pincode
    const pincode = formData.get('pincode');
    if (pincode && !/^\d{6}$/.test(pincode)) {
        errors['pincode'] = 'Enter a valid 6-digit PIN code';
        isValid = false;
    }

    // Display errors
    Object.keys(errors).forEach(field => {
        const errorElement = document.getElementById(`${field}Error`);
        if (errorElement) {
            errorElement.textContent = errors[field];
        }
    });

    return isValid;
}

function previewForm() {
    if (!validateForm()) {
        return;
    }

    const form = document.getElementById('registrationForm');
    const formData = new FormData(form);
    let previewHTML = '';

    // Group form data by sections
    const sections = {
        'Training Details': ['trainingPartner', 'course'],
        'Personal Details': ['candidateName', 'surname', 'gender', 'dob', 'age', 'religion', 'category', 'subCategory', 'mobile', 'maritalStatus', 'bloodGroup', 'email'],
        'Educational Details': ['minQualification', 'yearPassing', 'highestQualification', 'physicallyHandicapped'],
        'Guardian Details': ['guardianName', 'guardianOccupation', 'guardianContact', 'guardianIncome'],
        'Address Details': ['doorNo', 'village', 'mandal', 'pincode', 'district', 'state'],
        'Identity Details': ['aadhar'],
        'Fee': ['totalfee', 'discount']
    };

    // Generate preview HTML
    for (const [section, fields] of Object.entries(sections)) {
        previewHTML += `
            <div class="preview-section">
                <h3>${section}</h3>
                <div class="preview-grid">
        `;

        fields.forEach(field => {
            const element = document.getElementById(field);
            const value = element.type === 'select-one' ?
                element.options[element.selectedIndex]?.text :
                element.value;

            if (value) {
                previewHTML += `
                    <div class="preview-item" style="display: flex; justify-content: space-between; align-items: center;">
                        <div class="preview-label" style="flex: 1;">${element.previousElementSibling.textContent.replace(' *', '')}</div>
                        <div class="preview-value" style="flex: 2;">${value}</div>
                    </div>
                `;
            }
        });

        previewHTML += `
                </div>
            </div>
        `;
    }

    document.getElementById('previewContent').innerHTML = previewHTML;
    document.getElementById('previewModal').style.display = 'block';
}

function closePreview() {
    document.getElementById('previewModal').style.display = 'none';
}

// Function to handle form submission after confirmation
function confirmSubmission() {
    // Fetch the form data
    const form = document.getElementById('registrationForm');
    const formData = new FormData(form);

    // Convert the form data to JSON (optional, if the API accepts JSON)
    const formObject = {};
    formData.forEach((value, key) => {
        formObject[key] = value;
    });

    // Call the /register API
    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formObject), // Send data as JSON
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Registration successful!');
                form.reset();
                closePreview();

                // Ask user if they want to download the PDF
                if (confirm('Do you want to download the registration details as a PDF?')) {
                    // Redirect to Pdf_template.html and generate PDF
                    window.location.href = "/PAGES/Pdf_template.html";
                    setTimeout(() => generatePDF(), 3000); // Delay to allow data population
                } else {
                    // Redirect to Dashboard if the user clicks "Cancel"
                    window.location.href = '/PAGES/Dashboard.html';
                }
            } else {
                alert('Registration failed. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was an error submitting the registration. Please try again.');
        });
}

// Function to handle form submission
function handleSubmit(event) {
    event.preventDefault(); // Prevent the default form submission

    // Collect form data
    const formData = {
        campus: document.getElementById('campus').value,
        trainingPartner: document.getElementById('trainingPartner').value,
        course: document.getElementById('course').value,
        batchCode: document.getElementById('batchCode').value,
        candidateName: document.getElementById('candidateName').value,
        surname: document.getElementById('surname').value,
        gender: document.getElementById('gender').value,
        dob: document.getElementById('dob').value,
        age: document.getElementById('age').value,
        religion: document.getElementById('religion').value,
        category: document.getElementById('category').value,
        subCategory: document.getElementById('subCategory').value,
        mobile: document.getElementById('mobile').value,
        maritalStatus: document.getElementById('maritalStatus').value,
        bloodGroup: document.getElementById('bloodGroup').value,
        email: document.getElementById('email').value,
        minQualification: document.getElementById('minQualification').value,
        yearPassing: document.getElementById('yearPassing').value,
        highestQualification: document.getElementById('highestQualification').value,
        physicallyHandicapped: document.getElementById('physicallyHandicapped').value,
        guardianName: document.getElementById('guardianName').value,
        guardianOccupation: document.getElementById('guardianOccupation').value,
        guardianContact: document.getElementById('guardianContact').value,
        guardianIncome: document.getElementById('guardianIncome').value,
        doorNo: document.getElementById('doorNo').value,
        village: document.getElementById('village').value,
        mandal: document.getElementById('mandal').value,
        pincode: document.getElementById('pincode').value,
        district: document.getElementById('district').value,
        state: document.getElementById('state').value,
        aadhar: document.getElementById('aadhar').value,
        totalfee: document.getElementById('totalfee').value,
        discount: document.getElementById('discount').value
    };

    // Send POST request to the server
    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response => {
            if (response.ok) {
                return response.text();
            } else {
                throw new Error('Error: ' + response.statusText);
            }
        })
        .then(data => {
            alert('Registration successful: ' + data); // Show success message
            // Redirect to the home page
            window.location.href = '/PAGES/Dashboard.html'; // Ensure this points to the correct home page URL
        })
        .catch(error => {
            alert('Registration failed: ' + error.message); // Show error message
        });
}

// Initialize form
document.addEventListener('DOMContentLoaded', () => {
    populateYearDropdown();

    // Add input event listeners to clear errors
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            const errorElement = document.getElementById(`${input.name}Error`);
            if (errorElement) {
                errorElement.textContent = '';
            }
        });
    });

    // Attach handleSubmit to form submit event
    const form = document.getElementById('registrationForm');
    form.addEventListener('submit', handleSubmit);
});

// Close modal when clicking outside
window.onclick = function (event) {
    const modal = document.getElementById('previewModal');
    if (event.target === modal) {
        closePreview();
    }
}

// get courses list dropdown list
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


// get the batch id = batch code which is the diplay from the batches table
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