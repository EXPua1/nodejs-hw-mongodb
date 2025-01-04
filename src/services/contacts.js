import { contactsCollection } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = '_id',
  sortOrder = 'asc',
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = contactsCollection.find();
  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }
  if (filter.isFavourite) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }
  if (filter.userId) {
    contactsQuery.where('userId').equals(filter.userId);
   }

  const contactsCount = await contactsCollection
    .find()
    .merge(contactsQuery)
    .countDocuments();

  const contacts = await contactsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder });

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const findContactById = async (contactId) => {
  const contact = await contactsCollection.findById(contactId);
  return contact;
};

export const getContactById = filter => contactsCollection.findOne(filter);

export const addContactToBd = async (contact) => {
  const newContact = await contactsCollection.create(contact);
  return newContact;
};

export const updateContact = async (contactId, contact, options = {}) => {
  const rawResult = await contactsCollection.findByIdAndUpdate(
    { _id: contactId },
    contact,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );
  if (!rawResult || !rawResult.value) return null;
  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

export const deleteContactFromDb = async (contactId) => {
  const contact = await contactsCollection.findByIdAndDelete({
    _id: contactId,
  });
  return contact;
};
