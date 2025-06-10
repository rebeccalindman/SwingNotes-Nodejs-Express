// src/index.ts
import handleProcessEvents from './startup/handleProcessEvents';
handleProcessEvents();
import express from 'express';
import { errorHandler } from './middleware/errorHandler';
import { setupSwagger } from './swagger';
import PublicRoutes from "./routes/Public.routes";
import ProtectedRoutes from './routes/Protected.routes';
import { requestLogger } from './middleware/requestLogger';
import { authorizeAdmin, verifyJWT } from './middleware/auth';
import AdminRoutes from './routes/Admin.routes';

const app = express();

app.use(requestLogger); // logs API requests

const port = 3000;

app.use(express.json());

setupSwagger(app);
// Routes
app.use(PublicRoutes);
app.use(verifyJWT, ProtectedRoutes); // requires JWT authentication
app.use('/admin', verifyJWT, authorizeAdmin, AdminRoutes); // requires admin role

// Error handler
app.use(errorHandler); 


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
