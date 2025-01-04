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

const Contactrouter = Router();

Contactrouter.use(authenticate);
Contactrouter.get('/', ctrlWrapper(getContacts));
Contactrouter.get('/:contactId', isValidId, ctrlWrapper(getContactById));
Contactrouter.post('/', validateBody(contactSchema), ctrlWrapper(addContact));
Contactrouter.patch(
  '/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(patchContact),
);
Contactrouter.delete('/:contactId', ctrlWrapper(deleteContactById));
export default Contactrouter;
