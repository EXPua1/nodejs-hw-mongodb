import {
  addContactToBd,
  deleteContactFromDb,
  findContactById,
  getAllContacts,
  updateContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';

export const getContacts = async (req, res) => {
  const contacts = await getAllContacts();
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const contact = await findContactById(contactId);

  if (!contact) {
    throw createHttpError(404, `Contact with id ${contactId} not found!`);
  }
  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const addContact = async (req, res) => {
  const contact = req.body;
  const newContact = await addContactToBd(contact);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

export const patchContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await updateContact(contactId, req.body);

  if (!result) {
    throw createHttpError(404, `Contact with id ${contactId} not found!`);
  }
  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result.contact,
  });
};

export const deleteContactById = async (req, res) => {
  const { contactId } = req.params;
  const contact = await deleteContactFromDb(contactId);

  if (!contact) {
    throw createHttpError(404, `Contact with id ${contactId} not found!`);
  }
  res.status(204).send();
};
