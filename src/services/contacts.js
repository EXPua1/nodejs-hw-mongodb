import { contactsCollection } from '../db/models/contact.js';

export const getAllContacts = async () => {
  const contacts = await contactsCollection.find();
  return contacts;
};

export const findContactById = async (contactId) => {
  const contact = await contactsCollection.findById(contactId);
  return contact;
};

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
