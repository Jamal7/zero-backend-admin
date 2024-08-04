const mongoose = require('mongoose');
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
  },
  contact: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  skills: {
    type: [String], // Define skills as an array of strings
    required: true,
  }
});

// Utility function to handle comma-separated skills
userSchema.pre('save', function (next) {
  const user = this;
  if (typeof user.skills === 'string') {
    user.skills = user.skills.split(',').map(skill => skill.trim());
  }
  next();
});

// Create a Model
const User = model('User', userSchema);

module.exports = User;
