// src/index.ts
import handleProcessEvents from './startup/handleProcessEvents';
handleProcessEvents();
import express, { Request, Response, NextFunction } from 'express';
import pool from './db';
import { errorHandler } from './middleware/errorHandler';
import { setupSwagger } from './swagger';
import PublicRoutes from "./routes/Public.routes";
import { requestLogger } from './middleware/requestLogger';

const app = express();

app.use(requestLogger); // logs API requests

const port = 3000;

app.use(express.json());

// Routes
app.use(PublicRoutes);


// Error handler
app.use(errorHandler); 

setupSwagger(app);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
