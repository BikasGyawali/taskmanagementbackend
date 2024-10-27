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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const datasource_1 = require("../datasource");
const task_1 = require("../entity/task");
const user_1 = require("../entity/user");
const path = require('path');
class TaskController {
    // Add task
    static addTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { title, description, dueDate, completed } = req.body;
                // Validate required fields
                if (!title || !description || !dueDate) {
                    res.status(400).json({ msg: "Fields are incomplete" });
                    return;
                }
                // Get the authenticated user from the request (set by middleware)
                const userId = req.user.id;
                const userRepo = datasource_1.AppDataSource.getRepository(user_1.User);
                const user = yield userRepo.findOneBy({ id: userId });
                if (!user) {
                    res.status(404).json({ msg: "User not found" });
                    return;
                }
                const attachment = (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename;
                // Create the new task and link to the user
                const taskRepo = datasource_1.AppDataSource.getRepository(task_1.Task);
                const newTask = taskRepo.create({
                    title,
                    description,
                    dueDate,
                    attachment,
                    completed,
                    user, // linked task to authenticated user
                });
                yield taskRepo.save(newTask);
                // Send response
                res.status(201).json({ message: "Task created successfully", task: newTask });
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ msg: "Server error", error: err });
            }
        });
    }
    //get all task logic
    static getAllTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get the authenticated user from the request (set by middleware)
                const userId = req.user.id;
                const userRepo = datasource_1.AppDataSource.getRepository(user_1.User);
                const user = yield userRepo.findOneBy({ id: userId });
                if (!user) {
                    res.status(404).json({ msg: "User not found" });
                    return;
                }
                // Create the new task and link to the user
                const taskRepo = datasource_1.AppDataSource.getRepository(task_1.Task);
                const tasks = yield taskRepo.find({ where: { user: { id: userId } } });
                // Send response
                res.status(201).json({ message: "Task fetched successfully", task: tasks });
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ msg: "Server error", error: err });
            }
        });
    }
    //get single task logic
    static getSingleTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                // Get the authenticated user from the request (set by middleware)
                const userId = req.user.id;
                const userRepo = datasource_1.AppDataSource.getRepository(user_1.User);
                const user = yield userRepo.findOneBy({ id: userId });
                if (!user) {
                    res.status(404).json({ msg: "User not found" });
                    return;
                }
                // Create the new task and link to the user
                const taskRepo = datasource_1.AppDataSource.getRepository(task_1.Task);
                const task = yield taskRepo.findOne({ where: { id: id } });
                // Send response
                res.status(201).json({ message: "Task fetched successfully", task });
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ msg: "Server error", error: err });
            }
        });
    }
    //edit the task
    static editTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const taskId = parseInt(req.params.id);
                const { title, description, dueDate } = req.body;
                // Validate required fields
                if (!title || !description || !dueDate) {
                    res.status(400).json({ msg: "Fields are incomplete" });
                    return;
                }
                // Get the authenticated user from the request (set by middleware)
                const userId = req.user.id;
                const userRepo = datasource_1.AppDataSource.getRepository(user_1.User);
                const user = yield userRepo.findOneBy({ id: userId });
                if (!user) {
                    res.status(404).json({ msg: "User not found" });
                    return;
                }
                const attachmentPath = req.file && req.file.filename;
                // find the task in repo
                const taskRepo = datasource_1.AppDataSource.getRepository(task_1.Task);
                const task = yield taskRepo.findOneBy({ id: taskId });
                if (!task) {
                    res.status(404).json({ msg: "Task not found" });
                    return;
                }
                // Update the task properties
                task.title = title;
                task.description = description;
                task.dueDate = new Date(dueDate); // Ensure dueDate is a Date object
                task.attachment = attachmentPath;
                task.user = user; // Link the task to the authenticated user
                task.completed = req.body.completed ? JSON.parse(req.body.completed) : task.completed;
                // Save the updated task
                yield taskRepo.save(task);
                // Send response
                res.status(201).json({ message: "Task updated successfully", task });
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ msg: "Server error", error: err });
            }
        });
    }
    //delete task
    static deleteTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                // Get the authenticated user from the request (set by middleware)
                const userId = req.user.id;
                const userRepo = datasource_1.AppDataSource.getRepository(user_1.User);
                const user = yield userRepo.findOneBy({ id: userId });
                if (!user) {
                    res.status(404).json({ msg: "User not found" });
                    return;
                }
                // Find the task to delete
                const taskRepo = datasource_1.AppDataSource.getRepository(task_1.Task);
                const task = yield taskRepo.findOne({ where: { id } });
                if (!task) {
                    res.status(404).json({ msg: "Task not found" });
                    return;
                }
                // Delete the task by id
                yield taskRepo.delete({ id });
                // Send response
                res.status(201).json({ message: "Task deleted successfully" });
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ msg: "Server error", error: err });
            }
        });
    }
}
exports.TaskController = TaskController;
