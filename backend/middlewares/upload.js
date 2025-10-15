const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../pictures"));
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
    "image/jfif",
  ];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    console.warn(
      `⚠️ File ${file.originalname} skipped: unsupported type (${file.mimetype})`
    );
    cb(null, false); 
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
