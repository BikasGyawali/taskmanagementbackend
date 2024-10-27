"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Set up multer for file storage
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the folder to save files
    },
    filename: (req, file, cb) => {
        // Use timestamp and original name to avoid name clashes
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
// Initialize multer
const upload = (0, multer_1.default)({
    storage,
    fileFilter: (req, file, cb) => {
        // Accept only PDF files
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        if (ext !== '.pdf') {
            return cb(new Error('Only PDF files are allowed!'));
        }
        cb(null, true); // Accept the file
    },
});
exports.default = upload;
