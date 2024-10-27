"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskRouter = void 0;
const express_1 = __importDefault(require("express"));
const task_controller_1 = require("../controllers/task.controller");
const auth_1 = require("../middleware/auth");
const multer_1 = __importDefault(require("../controllers/multer"));
const taskRouter = express_1.default.Router();
exports.taskRouter = taskRouter;
taskRouter.post("/addTask", auth_1.authenticateToken, multer_1.default.single('attachment'), task_controller_1.TaskController.addTask);
taskRouter.get("/getAll", auth_1.authenticateToken, task_controller_1.TaskController.getAllTask);
taskRouter.post("/editTask/:id", auth_1.authenticateToken, multer_1.default.single('attachment'), task_controller_1.TaskController.editTask);
taskRouter.get("/getById/:id", auth_1.authenticateToken, task_controller_1.TaskController.getSingleTask);
taskRouter.delete("/deleteTask/:id", auth_1.authenticateToken, task_controller_1.TaskController.deleteTask);
