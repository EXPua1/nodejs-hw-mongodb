import { findContactById, getAllContacts } from '../services/contacts.js';

export const getContacts = async (req, res) => {
  try {
    const contacts = await getAllContacts();
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch some contacts',
    });
  }
};

export const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const contact = await findContactById(contactId);

  if (!contact) {
    res.status(404).json({
      status: 404,
      message: 'Contact not found',
    });
    return;
  }
  res.status(200).json({
    status: 200,
    data: contact,
  });
};
