"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateToken = (req, res, next) => {
    var _a;
    const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.split(" ")[1]; // Extract token from Authorization header
    if (!token) {
        res.status(401).json({ msg: "No token, authorization denied" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        req.user = decoded; // Attach decoded token to req.user
        next();
    }
    catch (err) {
        res.status(403).json({ msg: "Token is not valid" });
    }
};
exports.authenticateToken = authenticateToken;
