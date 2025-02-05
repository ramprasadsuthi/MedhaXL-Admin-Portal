 // Populate year of passing dropdown
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

// Calculate age based on date of birth
function calculateAge() {
    const dobInput = document.getElementById('dob');
    const ageInput = document.getElementById('age');
    
    if (dobInput.value) {
        const dob = new Date(dobInput.value);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        
        ageInput.value = age;
    } else {
        ageInput.value = '';
    }
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
        'sc': ['A', 'B', 'C', 'D'],
        'st': ['Tribal', 'Non-Tribal'],
        'obc': ['A', 'B', 'C', 'D'],
        'general': ['EWS', 'Others']
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
                stateInput.value = location.State;
            } else {
                districtInput.value = '';
                stateInput.value = '';
                alert('Invalid PIN Code');
            }
        } catch (error) {
            console.error('Error fetching location details:', error);
            districtInput.value = '';
            stateInput.value = '';
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
        'Identity Details': ['aadhar']
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

function confirmSubmission() {
    closePreview();
    document.getElementById('previewBtn').style.display = 'none';
    document.getElementById('submitBtn').style.display = 'block';
}

// Handle form submission
function handleSubmit(event) {
    event.preventDefault();
    
    if (validateForm()) {
        const form = document.getElementById('registrationForm');
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Here you would typically send the data to your server
        console.log('Form submitted:', data);
        
        // Show success message
        alert('Dummy Registration successful!');
        
        // Reset form
        form.reset();
        document.getElementById('previewBtn').style.display = 'block';
        document.getElementById('submitBtn').style.display = 'none';
    }
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
});

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('previewModal');
    if (event.target === modal) {
        closePreview();
    } }