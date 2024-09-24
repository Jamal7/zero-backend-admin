import mongoose from 'mongoose';

// Define the schema for Contact
const contactSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Export the Contact model
const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);
export default Contact;
