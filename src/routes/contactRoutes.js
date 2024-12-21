import express from 'express';
import {
  addContact,
  deleteContactById,
  getContactById,
  getContacts,
  patchContact,
} from '../controllers/contactController.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { contactSchema, updateContactSchema } from '../validation/contacts.js';
import { isValidId } from '../middlewares/isValidId .js';


const contactRouter = express.Router();

contactRouter.get('/contacts', ctrlWrapper(getContacts));
contactRouter.get(
  '/contacts/:contactId',
  isValidId,
  ctrlWrapper(getContactById),
);
contactRouter.post(
  '/contacts',
  validateBody(contactSchema),
  ctrlWrapper(addContact),
);
contactRouter.patch('/contacts/:contactId',isValidId, validateBody(updateContactSchema), ctrlWrapper(patchContact));
contactRouter.delete('/contacts/:contactId', ctrlWrapper(deleteContactById));
export default contactRouter;
