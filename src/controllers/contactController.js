import {
  addContactToBd,
  deleteContactFromDb,
  findContactById,
  getAllContacts,
  updateContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';

import { sortByList } from '../db/models/contact.js';

import { parseFilterContactParams } from '../utils/filters/parseFilterContactParams.js';

export const getContacts = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query, sortByList);
  const filter = parseFilterContactParams(req.query);
  filter.userId = req.user._id;

  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

  if (contacts.data.length === 0) {
    return res.status(200).json({
      status: 200,
      message: 'No contacts found for the given filter.',
      data: contacts,
      // filter: Object.keys(filter).length > 0 ? filter : undefined,
    });
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
    // filter: Object.keys(filter).length > 0 ? filter : undefined,
  });
};

export const getContactById = async (req, res) => {
  const { _id: userId } = req.user;

  const { contactId: _id } = req.params;
  const contact = await findContactById({ _id, userId });

  if (!contact) {
    throw createHttpError(404, `Contact with id ${_id} not found!`);
  }
  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${_id}!`,
    data: contact,
  });
};

export const addContact = async (req, res) => {
  const { _id: userId } = req.user;
  const contact = req.body;
  const newContact = await addContactToBd({ ...contact, userId });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

export const patchContact = async (req, res) => {
    const { contactId: _id } = req.params;
    const { _id: userId } = req.user;
  console.log({_id, userId});
  const result = await updateContact({userId, _id }, req.body);

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
  const { contactId: _id } = req.params;
  const { _id: userId } = req.user;
  const contact = await deleteContactFromDb({ _id, userId });

  if (!contact) {
    throw createHttpError(404, `Contact with id ${_id} not found!`);
  }
  res.status(204).send();
};
