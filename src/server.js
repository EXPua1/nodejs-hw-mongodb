import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { env } from './utils/env.js';
import { getContacts } from './controllers/contactController.js';
import { getAllContacts } from './services/contacts.js';
import contactRouter from './routes/contactRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

const PORT = Number(env('PORT', '3000'));

export const setupServer = () => {
  const app = express();

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
  app.use(errorHandler);
  app.use(notFoundHandler);

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};
