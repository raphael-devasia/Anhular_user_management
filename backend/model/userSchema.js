const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const { type } = require("os");
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },

  phone: { type: String },
  email: { type: String, required: true },

  password: { type: String, required: true },
  role: { type: String },
  profileImage:{type:String}
});


// Use regular function for 'this' context
userSchema.pre('save', async function(next) {
  // Add logging to verify the hook is being called
  console.log("Pre-save hook triggered");

  // Check if the password is new or has been modified
  if (!this.isModified('password')) {
    console.log("Password not modified, moving to next middleware");
    return next();
  }

  try {
    // Generate salt
    console.log("Generating salt...");
    const salt = await bcrypt.genSalt();
    
    // Hash the password
    console.log("Hashing the password...");
    this.password = await bcrypt.hash(this.password, salt);
    console.log("Password hashed:", this.password);
    
    next(); // Proceed to the next middleware or save operation
  } catch (error) {
    console.error("Error during hashing:", error);
    next(error); // Pass any error to the next middleware
  }
});


const User = new mongoose.model("User", userSchema);
module.exports = User;
