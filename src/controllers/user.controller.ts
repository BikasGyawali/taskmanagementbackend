import { Request, Response } from "express";
import { AppDataSource } from "../datasource";
import { User } from "../entity/user";
const bcrypt = require('bcrypt');
import jwt from "jsonwebtoken";

export class UserController {
  //signup
  static async signup(req: Request, res: Response){
    try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        res.status(400).json({ msg: "Please enter all fields" });
      } else {
        const userRepository= AppDataSource.getRepository(User);
        const user = await userRepository.findOne({where: { email }});
      if (user) {
        res.status(400).json({ msg: "Email already exists" });
      } else {
     // Create salt and hash
     const salt = await bcrypt.genSalt(10);
     const hash = await bcrypt.hash(password, salt);

    const user = new User();
    user.userName = name;
    user.email = email;
    user.password = hash;
    user.role=role;

    const userRepository = AppDataSource.getRepository(User);
    //new user is created
    await userRepository.save(user);
    //send response

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string, // Use your secret key from .env
      { expiresIn: '1d' } // Token expiry time set to 1 day
    );
     res
      .status(201)
      .json({ message: "User created successfully", user, token});
  }
 }
} catch (err){
  res.json(err);
}}

//login
static async login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
       res.status(400).json({ msg: "Please enter all fields" });
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
       res.status(400).json({ msg: "User doesn't exist" });
       return;
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
       res.status(400).json({ msg: "Invalid credentials" });
       return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' } // Token expiry time
    );

    // Send response with token
    res.status(200).json({
      message: "Login successful",
      user: { id: user.id, email: user.email, role: user.role },
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err });
  }
}
}