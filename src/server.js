import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { env } from './utils/env.js';
import { getContacts } from './controllers/contactController.js';
import { getAllContacts } from './services/contacts.js';
import contactRouter from './routes/contactRoutes.js';

const PORT = Number(env('PORT', '3000'));

export const setupServer = () => {
  const app = express();
  const router = express.Router();
  app.use(express.json());
  app.use(cors());
  app.get('/', (req, res) => {
    res.status(200).json({
      message: 'hello3333333',
    });
  });

  app.use(contactRouter);

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use('*', (req, res, next) => {
    res.status(404).json({
      message: 'Not Found',
    });
  });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};
