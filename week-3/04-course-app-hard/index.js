const express = require("express");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const app = express();

app.use(express.json());

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
});

const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imageLink: String,
  published: Boolean,
});

const User = mongoose.model("User", userSchema);
const Admin = mongoose.model("Admin", adminSchema);
const Course = mongoose.model("Course", courseSchema);

mongoose.connect(
  "mongodb+srv://Meet:dd43eU3DRIQyVZhc@cluster0.mik5rfn.mongodb.net/",
  { useNewUrlParser: true, useUnifiedTopology: true, dbName: "courses" }
);

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

function authenticateUserJwt(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, userSecretKey, (err, user) => {
      if (err) {
        return res.sendStatus(401);
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(400);
  }
}

// Admin routes
app.post("/admin/signup", async (req, res) => {
  // logic to sign up admin
  const { username, password } = req.body;
  const existingAdmin = await Admin.findOne({ username });
  if (existingAdmin) {
    res.status(403).json({ mesage: "Admin already exists!" });
  } else {
    const newAdmin = new Admin({ username, password });
    await newAdmin.save();
    const token = generateAdminJwt(newAdmin);
    res.json({ mesage: "Admin created successfully", token: token });
  }
});

app.post("/admin/login", async (req, res) => {
  // logic to log in admin
  const { username, password } = req.headers;
  const admin = await Admin.findOne({ username, password });
  if (admin) {
    const token = generateAdminJwt(admin);
    res.json({ mesage: "Logged in successfully", token: token });
  } else {
    res.status(401).json({ mesage: "Admin authentication failed!" });
  }
});

app.post("/admin/courses", authenticateAdminJwt, async (req, res) => {
  // logic to create a course
  const course = new Course(req.body);
  await course.save();
  res.json({ message: "Course created successfully", courseId: course.id });
});

app.put("/admin/courses/:courseId", authenticateAdminJwt, async (req, res) => {
  // logic to edit a course
  const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, {
    new: true, // to get updated object
  });
  if (course) {
    res.status(200).json({ message: "Course updated successfully" });
  } else {
    res.sendStatus(404).send("Course not found!");
  }
});

app.get("/admin/courses", authenticateAdminJwt, async (req, res) => {
  // logic to get all courses
  const courses = await Course.find({});
  res.status(200).json({ courses });
});

// User routes
app.post("/users/signup", async (req, res) => {
  // logic to sign up user
  const { username, password } = req.body;
  const existinUser = await User.findOne({ username });
  if (existinUser) {
    res.status(403).json({ mesage: "User already exists!" });
  } else {
    const newUser = new User({ username, password });
    await newUser.save();
    const token = generateUserJwt(newUser);
    res.json({ mesage: "User created successfully", token: token });
  }
});

app.post("/users/login", async (req, res) => {
  // logic to log in user
  const { username, password } = req.headers;
  const user = await User.findOne({ username, password });
  if (user) {
    const token = generateUserJwt(user);
    res.json({ mesage: "Logged in successfully", token: token });
  } else {
    res.status(401).json({ mesage: "User authentication failed!" });
  }
});

app.get("/users/courses", authenticateUserJwt, async (req, res) => {
  // logic to list all courses
  const courses = await Course.find({ published: true });
  res.status(200).json({ courses });
});

app.post("/users/courses/:courseId", authenticateUserJwt, async (req, res) => {
  // logic to purchase a course
  const course = await Course.findById(req.params.courseId);
  if (course) {
    const userObj = await User.findOne({ username: req.user.username });
    if (userObj) {
      userObj.purchasedCourses.push(course);
      await userObj.save();
      res.json({ message: "Course purchased successfylly!" });
    } else {
      res.status(403).json({ message: "User not found!" });
    }
  } else {
    res.status(403).json({ message: "Course not found!" });
  }
});

app.get("/users/purchasedCourses", authenticateUserJwt, async (req, res) => {
  // logic to view purchased courses\
  const user = await User.findOne({ username: req.user.username }).populate(
    "purchasedCourses" // to get whole obect of course not just id
  );
  if (user) {
    res.status(200).json({ purchasedCourses: user.purchasedCourses || [] });
  } else {
    res.status(403).json({ message: "User not found!" });
  }
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
