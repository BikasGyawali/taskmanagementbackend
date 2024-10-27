
# Task Management System

This project is a Task Management System, allowing users to sign up, log in, and manage tasks with features like creating tasks, attaching files, setting due dates, and marking tasks as complete or incomplete.

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)

## Features
- User Authentication (Signup, Login)
- Create, view, and manage tasks
- Task attributes: title, description, attachment, due date, status (complete/incomplete)
- Toggle task completion status

## Prerequisites
- Node.js (version >= 14)
- PostgresQL
- Git (for cloning the repository)

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/BikasGyawali/taskmanagement.git
   cd taskmanagement

2.Install dependencies 
For backend: cd backend
npm install

For frontend: cd frontend
npm install

For backend in .env file set JWT_SECRET=your_jwt_secret
For frontend set .env as REACT_APP_API_URL=http://localhost:5000/api

Running server: 
npm run build
npm start

Running client: 
npm start

Technologies Used
Frontend: React,TypeScript, TailwindCSS
Backend: Node.js, Express, TypeScript
Database: PostgresQL
Authentication: JWT (JSON Web Tokens)
