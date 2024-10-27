import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { AppDataSource } from "../datasource";
import { Task } from "../entity/task";
import { User } from "../entity/user";
const path=require('path');

export class TaskController {
  // Add task
  static async addTask(req: AuthenticatedRequest, res: Response) {
    try {
      const { title, description, dueDate, completed } = req.body;

      // Validate required fields
      if (!title || !description || !dueDate) {
         res.status(400).json({ msg: "Fields are incomplete" });
         return
      }

      // Get the authenticated user from the request (set by middleware)
      const userId = (req as any).user.id;
      const userRepo = AppDataSource.getRepository(User);
      const user = await userRepo.findOneBy({ id: userId });

      if (!user) {
         res.status(404).json({ msg: "User not found" });
         return
      }

      const attachment= req.file?.filename;

      // Create the new task and link to the user
      const taskRepo = AppDataSource.getRepository(Task);
      const newTask = taskRepo.create({
        title,
        description,
        dueDate,
        attachment,
        completed,
        user, // linked task to authenticated user
      });

      await taskRepo.save(newTask);

      // Send response
      res.status(201).json({ message: "Task created successfully", task: newTask });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Server error", error: err });
    }
  }

  //get all task logic
  static async getAllTask(req: AuthenticatedRequest, res: Response) {
    try {

      // Get the authenticated user from the request (set by middleware)
      const userId = (req as any).user.id;
      const userRepo = AppDataSource.getRepository(User);
      const user = await userRepo.findOneBy({ id: userId });

      if (!user) {
         res.status(404).json({ msg: "User not found" });
         return
      }

      // Create the new task and link to the user
      const taskRepo = AppDataSource.getRepository(Task);
      const tasks = await taskRepo.find({ where: { user: { id: userId } } });

      // Send response
      res.status(201).json({ message: "Task fetched successfully", task: tasks });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Server error", error: err });
    }
  }

   //get single task logic
   static async getSingleTask(req: AuthenticatedRequest, res: Response) {
    try {

     const id = parseInt(req.params.id); 

      // Get the authenticated user from the request (set by middleware)
      const userId = (req as any).user.id;
      const userRepo = AppDataSource.getRepository(User);
      const user = await userRepo.findOneBy({ id: userId });

      if (!user) {
         res.status(404).json({ msg: "User not found" });
         return
      }

      // Create the new task and link to the user
      const taskRepo = AppDataSource.getRepository(Task);
      const task = await taskRepo.findOne({ where: { id: id } });

      // Send response
      res.status(201).json({ message: "Task fetched successfully", task });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Server error", error: err });
    }
  }


  //edit the task
  static async editTask(req: AuthenticatedRequest, res: Response) {
    try {
      const taskId = parseInt(req.params.id); 
      const { title, description, dueDate } = req.body;

      // Validate required fields
      if (!title || !description || !dueDate) {
         res.status(400).json({ msg: "Fields are incomplete" });
         return
      }

      // Get the authenticated user from the request (set by middleware)
      const userId = (req as any).user.id;
      const userRepo = AppDataSource.getRepository(User);
      const user = await userRepo.findOneBy({ id: userId });

      if (!user) {
         res.status(404).json({ msg: "User not found" });
         return
      }

      const attachmentPath = req.file && req.file.filename;

      // find the task in repo
      const taskRepo = AppDataSource.getRepository(Task);
      const task=  await taskRepo.findOneBy({ id: taskId });
      if (!task) {
         res.status(404).json({ msg: "Task not found" });
         return
      }

      // Update the task properties
      task.title = title;
      task.description = description;
      task.dueDate = new Date(dueDate); // Ensure dueDate is a Date object
      task.attachment = attachmentPath || task.attachment;
      task.user = user; // Link the task to the authenticated user
      task.completed=req.body.completed ? JSON.parse(req.body.completed) : task.completed;


      // Save the updated task
      await taskRepo.save(task);

      // Send response
      res.status(201).json({ message: "Task updated successfully", task });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Server error", error: err });
    }
  }

   //delete task
   static async deleteTask(req: AuthenticatedRequest, res: Response) {
    try {

     const id = parseInt(req.params.id); 

      // Get the authenticated user from the request (set by middleware)
      const userId = (req as any).user.id;
      const userRepo = AppDataSource.getRepository(User);
      const user = await userRepo.findOneBy({ id: userId });

      if (!user) {
         res.status(404).json({ msg: "User not found" });
         return
      }

      // Find the task to delete
    const taskRepo = AppDataSource.getRepository(Task);
    const task = await taskRepo.findOne({ where: { id } });

    if (!task) {
       res.status(404).json({ msg: "Task not found" });
       return
    }

    // Delete the task by id
    await taskRepo.delete({ id }); 

      // Send response
      res.status(201).json({ message: "Task deleted successfully"});
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Server error", error: err });
    }
  }
}
