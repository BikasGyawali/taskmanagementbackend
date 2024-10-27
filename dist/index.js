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
// Import the 'express' module
const express_1 = __importDefault(require("express"));
const pg_1 = require("pg");
const user_routes_1 = require("./routes/user.routes");
const dotenv_1 = __importDefault(require("dotenv"));
const datasource_1 = require("./datasource");
const task_routes_1 = require("./routes/task.routes");
const cors = require('cors');
const path = require('path');
dotenv_1.default.config();
// Create an Express application
const app = (0, express_1.default)();
app.use(cors());
app.use(express_1.default.json());
app.use('/uploads', express_1.default.static(path.join(__dirname, './uploads')));
//route for user
app.use("/api", user_routes_1.userRouter);
app.use("/api/task", task_routes_1.taskRouter);
// Create a new PostgreSQL client
const client = new pg_1.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: Number(process.env.PG_PORT),
});
// Start the server and listen on the specified port
datasource_1.AppDataSource.initialize()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    const PORT = 4000;
    app.listen(PORT, () => {
        console.log("Server is running on http://localhost:" + PORT);
    });
    console.log("Data Source has been initialized!");
}))
    .catch((err) => console.log(err));
