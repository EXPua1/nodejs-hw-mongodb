import { Router } from 'express';
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

import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/upload.js';

const Contactrouter = Router();

Contactrouter.use(authenticate);
Contactrouter.get('/', ctrlWrapper(getContacts));
Contactrouter.get('/:contactId', isValidId, ctrlWrapper(getContactById));
Contactrouter.post(
  '/',
  upload.single('photo'),
  validateBody(contactSchema),
  ctrlWrapper(addContact),
);
Contactrouter.patch(
  '/:contactId',
  upload.single('photo'),
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(patchContact),
);
Contactrouter.delete('/:contactId', ctrlWrapper(deleteContactById));
export default Contactrouter;
