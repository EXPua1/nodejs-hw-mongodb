import express from 'express';
import { getContacts } from '../controllers/contactController.js';

const contactRouter = express.Router();

contactRouter.get('/contacts', getContacts);

export default contactRouter;
