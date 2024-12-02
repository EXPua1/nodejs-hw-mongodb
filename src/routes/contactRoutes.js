import express from 'express';
import {
  getContactById,
  getContacts,
} from '../controllers/contactController.js';

const contactRouter = express.Router();

contactRouter.get('/contacts', getContacts);
contactRouter.get('/contacts/:contactId', getContactById);

export default contactRouter;
