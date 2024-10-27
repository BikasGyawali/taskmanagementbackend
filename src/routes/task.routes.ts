import express from "express";
import { TaskController } from "../controllers/task.controller";
import { authenticateToken } from "../middleware/auth";
import upload from "../controllers/multer";

const taskRouter = express.Router();

taskRouter.post("/addTask", authenticateToken, upload.single('attachment'), TaskController.addTask);
taskRouter.get("/getAll", authenticateToken, TaskController.getAllTask);
taskRouter.post("/editTask/:id", authenticateToken, upload.single('attachment'), TaskController.editTask);
taskRouter.get("/getById/:id", authenticateToken, TaskController.getSingleTask);
taskRouter.delete("/deleteTask/:id", authenticateToken, TaskController.deleteTask);

export { taskRouter };