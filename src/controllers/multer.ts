import multer, { FileFilterCallback } from 'multer';
import path from 'path';

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');// Specify the folder to save files
  },
  filename: (req, file, cb) => {
    // Use timestamp and original name to avoid name clashes
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Initialize multer
const upload = multer({
  storage,
  fileFilter: (req, file, cb: FileFilterCallback) => {
    // Accept only PDF files
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.pdf') {
      return cb(new Error('Only PDF files are allowed!')); 
    }
    cb(null, true); // Accept the file
  },
});

export default upload;
