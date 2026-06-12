const path = require("path");
const multer = require("multer");

// In-memory storage so the controller can read req.file.buffer reliably
// (diskStorage would require reading file contents; your controller expects buffer).
const storage = multer.memoryStorage();

const allowedMimeTypes = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
  "application/msword", // doc
]);

const allowedExtensions = new Set([".pdf", ".docx", ".doc"]);

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname || "").toLowerCase();
  const mimeOk = allowedMimeTypes.has(file.mimetype);
  const extOk = allowedExtensions.has(ext);

  // Allow if MIME OR extension is allowed (some browsers send inconsistent mime types)
  if (mimeOk || extOk) {
    return cb(null, true);
  }

  return cb(
    new Error("Only PDF and DOC/DOCX resume formats are allowed"),
    false
  );
};

const uploadResume = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 8 * 1024 * 1024, // 8MB
  },
});

module.exports = uploadResume;

