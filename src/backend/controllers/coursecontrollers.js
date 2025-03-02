const db = require('../config/database');

const coursecontrollers = {
  getCourses: (req, res) => {
    const sql = "SELECT coursename FROM courses"; // Fetch coursename
    db.query(sql, (err, result) => {
      if (err) {
        console.error("Error fetching courses:", err);
        return res.status(500).json({ error: "Database query failed" });
      }
      res.json(result); // Send as JSON
    });
  },


  //api of the view the courses offered
  getviewtotalcourses: (req, res) => {
    const sql = "SELECT CourseID, CourseName, Duration FROM courses";
    db.query(sql, (err, result) => {
      if (err) throw err;
      res.json(result);
    });
  },

  //api of the view the courses offered pop up

  getTotalCourses: (req, res) => {
    const query = "SELECT COUNT(*) AS total FROM courses";
    db.query(query, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: "Database Error" });
      } else {
        res.json(result[0]); // { total: retun}
      }
    });
  },

};

module.exports = coursecontrollers;
