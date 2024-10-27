"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const datasource_1 = require("../datasource");
const user_1 = require("../entity/user");
const bcrypt = require('bcrypt');
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class UserController {
    //signup
    static signup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, password, role } = req.body;
                if (!name || !email || !password) {
                    res.status(400).json({ msg: "Please enter all fields" });
                }
                else {
                    const userRepository = datasource_1.AppDataSource.getRepository(user_1.User);
                    const user = yield userRepository.findOne({ where: { email } });
                    if (user) {
                        res.status(400).json({ msg: "Email already exists" });
                    }
                    else {
                        // Create salt and hash
                        const salt = yield bcrypt.genSalt(10);
                        const hash = yield bcrypt.hash(password, salt);
                        const user = new user_1.User();
                        user.userName = name;
                        user.email = email;
                        user.password = hash;
                        user.role = role;
                        const userRepository = datasource_1.AppDataSource.getRepository(user_1.User);
                        //new user is created
                        yield userRepository.save(user);
                        //send response
                        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, // Use your secret key from .env
                        { expiresIn: '1d' } // Token expiry time set to 1 day
                        );
                        res
                            .status(201)
                            .json({ message: "User created successfully", user, token });
                    }
                }
            }
            catch (err) {
                res.json(err);
            }
        });
    }
    //login
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                // Validate input
                if (!email || !password) {
                    res.status(400).json({ msg: "Please enter all fields" });
                }
                const userRepository = datasource_1.AppDataSource.getRepository(user_1.User);
                const user = yield userRepository.findOne({ where: { email } });
                if (!user) {
                    res.status(400).json({ msg: "User doesn't exist" });
                    return;
                }
                // Check password
                const isMatch = yield bcrypt.compare(password, user.password);
                if (!isMatch) {
                    res.status(400).json({ msg: "Invalid credentials" });
                    return;
                }
                // Generate JWT token
                const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' } // Token expiry time
                );
                // Send response with token
                res.status(200).json({
                    message: "Login successful",
                    user: { id: user.id, email: user.email, role: user.role },
                    token
                });
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ msg: "Server error", error: err });
            }
        });
    }
}
exports.UserController = UserController;
