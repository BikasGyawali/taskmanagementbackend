// Import the 'express' module
import express from 'express';
import { Client } from 'pg';
import { userRouter } from "./routes/user.routes";
import dotenv from 'dotenv';
import { AppDataSource } from './datasource';
import { taskRouter } from './routes/task.routes';
const cors = require('cors');
const path=require('path')

dotenv.config();

// Create an Express application
const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, './uploads')));

//route for user
app.use("/api", userRouter);
app.use("/api/task", taskRouter);

// Create a new PostgreSQL client
const client = new Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: Number(process.env.PG_PORT),
  });

// Start the server and listen on the specified port
  AppDataSource.initialize()
  .then(async () => {
    const PORT = 4000 
    app.listen(PORT, () => {
      console.log("Server is running on http://localhost:" + PORT);
    });
    console.log("Data Source has been initialized!");
  })
  .catch((err) => console.log(err));