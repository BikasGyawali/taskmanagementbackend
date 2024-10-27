import express from "express";
import { UserController } from "../controllers/user.controller";

const userRouter = express.Router();

userRouter.post("/signup", UserController.signup);
userRouter.post("/login", UserController.login);

export { userRouter };