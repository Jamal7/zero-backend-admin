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
  pushToken: {
    type: String,
    default: null,
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
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'hired'],
    default: 'active',
  },
  jobIds: [{
    type: Schema.Types.ObjectId,
    ref: 'Job',
  }],
  resetCode: {
    type: String,
  },
  resetCodeExpiry: {
    type: Date,
  },
  interestKeywords: [{
    type: String,
  }],
  jobapllied: [{
    type: Schema.Types.ObjectId,
    ref: 'Job'
  }],
  jobshortlist: [{
    type: Schema.Types.ObjectId,
    ref: 'Job'
  }],
  subscription: {
    isActive: { type: Boolean, default: false },
    plan: { type: String, default: null },
    subscriptionId: { type: String, default: null },
    startDate: { type: Date, default: null },
    expiresAt: { type: Date, default: null },
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  paymentMethods: [{
    id: String,
    brand: String,
    last4: String,
    expiryMonth: String,
    expiryYear: String,
    isDefault: { type: Boolean, default: false }
  }]
});

// Create a Model
if (mongoose.models.User) {
  delete mongoose.models.User;
}
const User = model('User', userSchema);

export default User;
