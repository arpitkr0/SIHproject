require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");

//imports
const connectDB = require("./config/connectDB");
const welcomeRoute = require("./routes/welcomeRoute");
const facultyRoute = require("./routes/facultyRoute");
const instituteRoute = require("./routes/instituteRoute");

//express app
const app = express();
const PORT = process.env.PORT || 8000;

//db connection
connectDB(process.env.DB_URL);

//view engine
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

//inbuilt middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//routes
app.use("/", welcomeRoute);
app.use("/faculty", facultyRoute);
app.use("/institute", instituteRoute);

app.listen(PORT, () =>
  console.log(`Server started at http://localhost:${PORT}`)
);
