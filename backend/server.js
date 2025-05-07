import express from "express";
import connectDB from "./daabase/db.js";
import dotenv from "dotenv";
import cors from "cors";
import todoRoutes from './routes/todos.js';

dotenv.config();

const app = express(); // ✅ Move this up

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/todos', todoRoutes); // ✅ Now this works

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
