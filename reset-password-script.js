const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Hardcoded URI from .env file
const MONGODB_URI = 'mongodb://localhost:27017/zero';

// Since this is a standalone script, we need to define the schema directly or require it
// Assuming we can't easily require the ES6 module schema in this CJS script, let's define a minimal one
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetCode: String,
    resetCodeExpiry: Number
}, { strict: false }); // strict: false allows us to update documents without defining the full schema

const User = mongoose.model('User', userSchema);

const connectDb = async () => {
    if (mongoose.connections[0].readyState) return;
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
};

const resetPassword = async () => {
    const email = 'mjamalnasir7-employer3@gmail.com';
    const newPassword = 'jamal@123';

    try {
        await connectDb();

        console.log(`Searching for user: ${email}...`);
        const user = await User.findOne({ email });

        if (!user) {
            console.log(`User with email ${email} not found.`);
            process.exit(1);
        }

        console.log(`Found user: ${user.email}`);

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        // Clear reset code fields if they exist
        if (user.resetCode) {
            user.resetCode = undefined;
            console.log('Cleared reset code');
        }
        if (user.resetCodeExpiry) {
            user.resetCodeExpiry = undefined;
            console.log('Cleared reset code expiry');
        }

        // Force update using updateOne to bypass any schema validation issues
        await User.updateOne(
            { _id: user._id },
            {
                $set: { password: hashedPassword },
                $unset: { resetCode: "", resetCodeExpiry: "" }
            }
        );

        console.log(`Password for ${email} has been successfully reset to: ${newPassword}`);
    } catch (error) {
        console.error('Error resetting password:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    }
};

resetPassword();
