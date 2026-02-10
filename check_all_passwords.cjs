const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const connectionString = 'mongodb://localhost:27017/zero';

const userSchema = new mongoose.Schema({
    email: String,
    password: { type: String },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function checkPassAll() {
    try {
        await mongoose.connect(connectionString);
        const users = await User.find({});
        const passwordToTest = 'jamal@123';

        console.log(`Checking password "${passwordToTest}" against all users...`);

        for (const user of users) {
            const match = await bcrypt.compare(passwordToTest, user.password);
            if (match) {
                console.log(`[MATCH] Found user: ${user.email}`);
            }
        }
        console.log('Check complete.');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

checkPassAll();
