import { model, Schema } from 'mongoose';

const contactsSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  isFavourite: {
    type: Boolean,
    default: false,
  },
  contactType: {
    type: String,
    required: true,
    enum: ['work', 'home', 'personal'],
    default: 'personal',
  },
});

export const contactsCollection = model('contacts', contactsSchema);
