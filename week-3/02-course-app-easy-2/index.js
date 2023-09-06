const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const adminSecretKey = "@dm!nS3cr3t";
const userSecretKey = "U$erS3cr3t";

const generateAdminJwt = ({ username, password }) => {
  const payload = { username, password };
  return jwt.sign(payload, adminSecretKey, { expiresIn: "1h" });
};

const generateUserJwt = ({ username, password }) => {
  const payload = { username, password };
  return jwt.sign(payload, userSecretKey, { expiresIn: "1h" });
};

function authenticateAdminJwt(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, adminSecretKey, (err, admin) => {
      if (err) {
        return res.sendStatus(401);
      }

      req.admin = admin;
      next();
    });
  } else {
    res.sendStatus(400);
  }
}

// Admin routes
app.post("/admin/signup", (req, res) => {
  // logic to sign up admin
  const admin = req.body;
  const existingAdmin = ADMINS.find((e) => e.username === admin.username);
  if (existingAdmin) {
    res.status(403).json({ mesage: "Admin already exists!" });
  } else {
    ADMINS.push(admin);
    const token = generateAdminJwt(admin);
    res.json({ mesage: "Admin created successfully", token: token });
  }
});

app.post("/admin/login", (req, res) => {
  // logic to log in admin
  const { username, password } = req.body;
  const admin = ADMINS.find(
    (e) => e.username === username && e.password === password
  );

  if (admin) {
    const token = generateAdminJwt(admin);
    res.json({ mesage: "Logged in successfully", token: token });
  } else {
    res.status(401).json({ mesage: "Admin authentication failed!" });
  }
});

app.post("/admin/courses", authenticateAdminJwt, (req, res) => {
  // logic to create a course
  const course = req.body;
  course.id = COURSES.length + 1;
  COURSES.push(course);
  res.json({ message: "Course created successfully", courseId: course.id });
});

app.put("/admin/courses/:courseId", authenticateAdminJwt, (req, res) => {
  // logic to edit a course
  const course = req.body;
  const courseId = parseInt(req.params.courseId);
  const courseIndex = COURSES.findIndex((e) => e.id === courseId);
  if (courseIndex > -1) {
    const updatedCourse = { ...COURSES[courseIndex], ...course };
    COURSES[courseIndex] = updatedCourse;
    res.status(200).json({ message: "Course updated successfully" });
  } else {
    res.sendStatus(404).send("Course not found!");
  }
});

app.get("/admin/courses", authenticateAdminJwt, (req, res) => {
  // logic to get all courses
  res.status(200).json({ courses: COURSES });
});

// User routes
app.post("/users/signup", (req, res) => {
  // logic to sign up user
});

app.post("/users/login", (req, res) => {
  // logic to log in user
});

app.get("/users/courses", (req, res) => {
  // logic to list all courses
});

app.post("/users/courses/:courseId", (req, res) => {
  // logic to purchase a course
});

app.get("/users/purchasedCourses", (req, res) => {
  // logic to view purchased courses
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
