const tabs = document.querySelectorAll('.tabs button');
    const contents = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab).classList.add('active');
      });
    });

    function showReEnter(type) {
      const value = document.getElementById(type).value;
      const confirmField = document.getElementById('confirm-' + type);
      if (value.trim() !== "") {
        confirmField.classList.remove('hidden');
      } else {
        confirmField.classList.add('hidden');
      }
    }

    function registerAdmin() {
      const adminUsername = document.getElementById('admin-username').value;
      alert('New Admin Registered: ' + adminUsername);
    }

    function registerStudent() {
      const studentUsername = document.getElementById('student-username').value;
      alert('New Student Registered: ' + studentUsername);
    }
    
    //  update the passwaord

    // Function to fetch current user data from the database
    async function getCurrentUserData() {
      try {
        const response = await fetch('/get-user-data'); // API endpoint to fetch user data
        if (!response.ok) throw new Error('Failed to fetch user data');
        return await response.json();
      } catch (error) {
        console.error(error);
        return null;
      }
    }

    // Function to show the re-enter fields when input changes
    function showReEnter(field) {
      const confirmField = document.getElementById(`confirm-${field}`);
      confirmField.classList.remove("hidden");
    }

    // Function to validate password strength
    function validatePassword(password) {
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return regex.test(password);
    }

    // Function to update security details
    async function updateSecurity() {
      const email = document.getElementById('email').value;
      const confirmEmail = document.getElementById('confirm-email').value;
      const username = document.getElementById('username').value;
      const confirmUsername = document.getElementById('confirm-username').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
      const error = document.getElementById('error-message');

      error.textContent = '';

      // Fetch user data from the database
      const userData = await getCurrentUserData();
      if (!userData) {
        error.textContent = 'Error fetching user data. Try again.';
        return;
      }

      // Validate if entered details match the database
      if (email === userData.email || username === userData.username || password === userData.password) {
        error.textContent = 'New details must be different from current details!';
        return;
      }

      // Validate re-entered values
      if (email !== confirmEmail) {
        error.textContent = 'Emails do not match!';
        return;
      }
      if (username !== confirmUsername) {
        error.textContent = 'Usernames do not match!';
        return;
      }
      if (password !== confirmPassword) {
        error.textContent = 'Passwords do not match!';
        return;
      }

      // Validate password strength
      if (!validatePassword(password)) {
        error.textContent = 'Password must be at least 8 characters long, contain one uppercase, one lowercase, one number, and one special character!';
        return;
      }

      // Confirm update
      if (confirm('Are you sure you want to update your security details?')) {
        alert('Security details updated successfully!');
        // Here you can send an API request to update the details in the database
        fetch('/update-security', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, username, password })
        })
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              alert('Security details updated successfully!');
            } else {
              error.textContent = data.message;
            }
          })
          .catch(err => {
            console.error(err);
            error.textContent = 'Failed to update security details.';
          });
      }
    }

