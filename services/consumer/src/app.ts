import express from 'express';
import { RegisterRoutes } from './routes';

const app = express();

RegisterRoutes(app);

export default app;
