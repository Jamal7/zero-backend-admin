import mongoose from 'mongoose';
const { Schema, model } = mongoose;

// Define the User schema
const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  employer: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: 'null',
  },
  imageUrl: {
    type: String,
    default: 'null',
  }
});

// Create a Model
const User = mongoose.models.User || model('User', userSchema);

export default User;
