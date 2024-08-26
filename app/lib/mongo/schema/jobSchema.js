import mongoose from 'mongoose';
const { Schema, model } = mongoose;

// Define the Job schema
const jobSchema = new Schema({
  jobTitle: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'], // Example statuses
    default: 'pending',
  },
  imageUrl: {
    type: String,
    default: 'null',
  },
  videoUrl: {
    type: String,
    default: 'null',
  },
  location: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

// Create a Model
const Job = mongoose.models.Job || model('Job', jobSchema);

export default Job;
