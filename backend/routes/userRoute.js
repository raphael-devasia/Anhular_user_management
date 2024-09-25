const express = require("express");
const multer = require("multer");


const router = express.Router();
const {
  getHome,
  getLogout,
  createLogin,
  createRegister,
  updateUser,
  getUser,
  getAllUsers,
} = require("../controller/user");


const path = require('path');

// Define storage options for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Directory to save the files
  },
  filename: function (req, file, cb) {
    // Get the file extension
    const ext = path.extname(file.originalname);
    
    // Create a custom file name with the original extension
    cb(null, file.fieldname + '-' + Date.now() + ext);
  }
});

// Configure multer to use the custom storage
const upload = multer({
  storage: storage
}).single('profileImage'); // 'profileImage' is the field name


router.post("/login", createLogin);

router.post("/register", createRegister);
router.post("/updateUser",upload, updateUser);
router.get("/home", getHome);
router.get("/logout", getLogout);
router.get("/getUser", getUser);
router.get("/users", getAllUsers);



module.exports = router;
