// src/index.ts
import express, { Request, Response, NextFunction } from 'express';
import pool from './db';
import { errorHandler } from './middlewares/errorHandler';
import PublicRoutes from "./routes/Public.routes";

const app = express();
const port = 3000;

app.use(express.json());

// Routes
app.use(PublicRoutes);


// Error handler
app.use(errorHandler); 

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
