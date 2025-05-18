const db = require('./../backend/config/database.js');
const bcrypt = require('bcrypt');

async function applogin(username, password) {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM student_login WHERE can_id = ?', [username], async (err, results) => {
      if (err) {
        console.error('DB error:', err);
        return reject({ success: false, message: 'Database error' });
      }

      if (results.length === 0) {
        return resolve({ success: false, message: 'User not found' });
      }

      const user = results[0];
      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return resolve({ success: false, message: 'Incorrect password' });
      }

      return resolve({ success: true, message: 'Login successful' });
    });
  });
}

module.exports = { applogin };
