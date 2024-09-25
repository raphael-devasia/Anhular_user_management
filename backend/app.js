require("dotenv").config();
require("./config/db").connect();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const userRouter = require('./routes/userRoute')
const cookieParser = require("cookie-parser");
const router = require("./routes/userRoute");
const multer = require('multer')


const app = express();
app.use(cookieParser());
const server = http.createServer(app);
// Serve static files from the 'uploads' folder
app.use('/uploads', express.static('uploads'));

app.use(
  cors({
    origin: "http://localhost:4200", // Replace this with your frontend's URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed methods if needed
    credentials: true, // Enable if you need cookies
  })
);
app.use(bodyParser.json());


// get method
app.use('/',userRouter)
app.get("/", (req, res) => {
  res.redirect("/login");
});

const { API_PORT } = process.env;
const port = API_PORT || 3200;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`); // Corrected this line
});
