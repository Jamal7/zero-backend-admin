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
    enum: ['active', 'inactive'], // Example statuses
    default: 'inactive',
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
  },
  userapplied: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  usershortlist: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

// Create a Model
const Job = mongoose.models.Job || model('Job', jobSchema);

export default Job;
