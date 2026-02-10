const mongoose = require('mongoose');

const connectionString = 'mongodb://localhost:27017/zero';

const userSchema = new mongoose.Schema({
    userName: String,
    email: { type: String, unique: true },
    employer: String,
    password: { type: String },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function listUsers() {
    try {
        await mongoose.connect(connectionString);
        const users = await User.find({}, 'email employer userName password');
        console.log('--- USER LIST ---');
        users.forEach(user => {
            console.log(`Email: ${user.email}`);
            console.log(`Role: ${user.employer}`);
            console.log(`User: ${user.userName}`);
            console.log(`Hash: ${user.password}`);
            console.log('-----------------');
        });
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

listUsers();
