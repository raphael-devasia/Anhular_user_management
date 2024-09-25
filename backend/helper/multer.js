const multer = require("multer");
const path = require("path");

// Configure storage for multer
const storage = multer.diskStorage({

  destination: (req, file, cb) => {
      console.log("Entered middleware");
    cb(null, "uploads/"); // Directory to store the images
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Get file extension
    cb(null, Date.now() + ext); // Use a timestamp to ensure unique filenames
  },
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  console.log("Entered middleware");
  
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"));
  }
};

const upload = multer({
  
  
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB file size limit
});

module.exports = upload