import express from 'express';
import {
  addContact,
  deleteContactById,
  getContactById,
  getContacts,
  patchContact,
} from '../controllers/contactController.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const contactRouter = express.Router();

contactRouter.get('/contacts', ctrlWrapper(getContacts));
contactRouter.get('/contacts/:contactId', ctrlWrapper(getContactById));
contactRouter.post('/contacts', ctrlWrapper(addContact));
contactRouter.patch('/contacts/:contactId', ctrlWrapper(patchContact));
contactRouter.delete('/contacts/:contactId', ctrlWrapper(deleteContactById));
export default contactRouter;
