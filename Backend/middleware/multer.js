// middleware/multer.js
const multer = require("multer");

const storage = multer.memoryStorage(); // store file in memory
const upload = multer({ storage });

module.exports = upload;
