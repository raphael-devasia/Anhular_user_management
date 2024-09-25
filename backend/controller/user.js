const User = require("../model/userSchema");
const Admin = require("../model/adminSchema");
const bcrypt = require("bcrypt");
const fs = require('fs')

var jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;





const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: maxAge });
};


const createLogin = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    let checkUser;
    // Check if email exists in database
    if (role === "user") {
      checkUser = await User.findOne({
        email: email,
      });
    } else {
      checkUser = await Admin.findOne({
        email: email,
      });
    }

    if (!checkUser) {
      return res.status(400).json({
        success: false,
        message: "User is not Registered",
      });
    } else {
      const auth = await bcrypt.compare(password, checkUser.password);
      console.log(auth);

      if (auth) {
        let token = createToken(checkUser._id);

        res.status(201).json({
          success: true,
          message: "Login successful.",
          token: token,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Incorrect Password",
        });
      }
    }
  } catch (error) {
    console.error("Error while Loggin user:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error. Please try again later.",
    });
  }
};
const createRegister = async (req, res) => {
  const userData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phone: req.body.phone,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
    operator:req.body.operator
  };
  console.log(userData.operator);

  try {
    let existingphone;
    let existingemail;
    if (userData.role === "user") {
      existingphone = await User.findOne({ phone: userData.phone });
      existingemail = await User.findOne({ email: userData.email });
    } else if (userData.role === "admin" && userData.operator === "adduser") {
      existingphone = await User.findOne({ phone: userData.phone });
      existingemail = await User.findOne({ email: userData.email });
    } else {
      existingphone = await Admin.findOne({ phone: userData.phone });
      existingemail = await Admin.findOne({ email: userData.email });
    }

    console.log(existingphone);
    console.log(existingemail);

    if (existingphone) {
      return res.status(400).json({
        success: false,
        message: "Phone number already exists. Try with a new phone number.",
      });
    } else if (existingemail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists. Try with a new email address.",
      });
    } else {
      console.log("step 1");

      if (
        userData.role === "user" ||
        (userData.role === "admin" && userData.operator === "adduser")
      ) {
        console.log("step 2");
        const registerData = await User.create(userData);
        console.log("Data inserted successfully", userData);
        return res.status(201).json({
          success: true,
          message: "Registration successful.",
          data: registerData,
        });
      } else {
        console.log("step 3");
        const registerData = await Admin.create(userData);
        console.log("Data inserted successfully", userData);
        return res.status(201).json({
          success: true,
          message: "Registration successful.",
          data: registerData,
        });
      }
    }
  } catch (error) {
    console.error("Error while registering user:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error. Please try again later.",
    });
  }
};

const getHome = async (req, res) => {
  const isAdmin = false;

  const userDetails = await User.findOne({
    email: req.session.user,
  });
  if (userDetails) {
    if (req.session.user) {
      return res.render("profile", { data: userDetails });
    }

    res.redirect("/login");
  } else {
    req.session.destroy();
    res.redirect("/login");
  }
};
const updateUser = async (req, res, next) => {
  console.log(req.body);
  
  try {
    // Authorization Header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "Authorization header is missing" });
    }

    const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"
    const isVerified = jwt.verify(token, JWT_SECRET); // Verify token
    console.log("Verified Token Payload:", isVerified.id);

    // Handle profile image
    
    
       const profileImage = req.file ? req.file.path : null;
    

    // Update user fields (firstName, lastName, and profileImage if present)
    const updateData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      ...(profileImage && { profileImage: profileImage }), // Only add if profileImage exists
    };

    // Find and update the user in the database
    const updatedUser = await User.findByIdAndUpdate(
      isVerified.id,
      updateData,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with the updated user data
    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getLogout = (req, res) => {
  const isAdmin = false;
  req.session.destroy();

  res.redirect("/");
};
const getUser = async(req,res)=>{
  const userId = req.query.id;
  console.log(req.query);
  
 try {
    // Authorization Header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "Authorization header is missing" });
    }

    const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"
    const isVerified = jwt.verify(token, JWT_SECRET); // Verify token
    console.log("Verified Token Payload:", isVerified.id);

    
    const user = await User.findById(
      isVerified.id,
      
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with the updated user data
    res.status(200).json({
      message: "User updated successfully",
      user: user,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
const getAllUsers = async (req, res) => {
  try {
    // Authorization Header
    const authHeader = req.headers.authorization;
   
    
    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "Authorization header is missing" });
    }

    const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"
    
    
    const isVerified = jwt.verify(token, JWT_SECRET); // Verify token
    

    const user = await User.find();

    if (!user.length) {
      return res.status(404).json({ message: "Users not found" });
    }

    // Respond with the updated user data
    res.status(200).json({
      
      user: user,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {
  getHome,
  getLogout,
  createLogin,
  createRegister,
  updateUser,
  getUser,
  getAllUsers,
};
