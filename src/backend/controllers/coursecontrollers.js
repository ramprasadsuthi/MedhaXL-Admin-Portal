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

  //**add the courses */
  addCourse: (req, res) => {
    const { courseid, coursename, duration } = req.body;

    if (!courseid || !coursename || isNaN(duration)) {
      return res.status(400).json({ message: "All fields are required and duration must be a number" });
    }

    const query = "INSERT INTO courses (courseid, coursename, duration) VALUES (?, ?, ?)";
    db.query(query, [courseid, coursename, parseInt(duration, 10)], (err, result) => {
      if (err) {
        console.error("Database Error:", err.sqlMessage);
        return res.status(500).json({ message: "Database error", details: err.sqlMessage });
      }
      res.json({ message: "Course added successfully!" });
    });
  },


  // Get Courses
  getAllCourses: (req, res) => {
    db.query("SELECT courseid, coursename, duration FROM courses", (err, results) => {
      if (err) return res.status(500).json({ message: "Database error", details: err.sqlMessage });
      res.json(results);
    });
  },

  // Delete Course
  deleteCourse: (req, res) => {
    const { courseid } = req.params;
    db.query("DELETE FROM courses WHERE courseid = ?", [courseid], (err, result) => {
      if (err) return res.status(500).json({ message: "Database error", details: err.sqlMessage });
      res.json({ message: "Course deleted successfully!" });
    });
  },


};

module.exports = coursecontrollers;
