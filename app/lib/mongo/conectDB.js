import mongoose from 'mongoose';
import printStatement from '../apiCommonUtils/printStatement';

const connectionString = process.env.MONGODB_URI;

if (!connectionString) {
  printStatement('MONGODB_URI not found in environment variables');
  process.exit(1);
}

export const connectDb = async () => {
  await mongoose.connect(connectionString).then(() => {
    printStatement("DB Connected Successfully")
  }).catch((error) => {
    printStatement("Error Connecting DB", error)
    process.exit(1);
  });
};

export const disconnectDb = async () => {
  await mongoose.disconnect().then(() => {
    printStatement("DB Disconnected Successfully")
  }).catch((error) => {
    printStatement("Error Disconnecting DB", error)
    process.exit(1);
  });
};
