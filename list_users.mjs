import { connectDb, disconnectDb } from './app/lib/mongo/conectDB.js';
import User from './app/lib/mongo/schema/userSchema.js';

const connectionString = 'mongodb://localhost:27017/zero';
process.env.MONGODB_URI = connectionString;

async function listUsers() {
    try {
        await connectDb();
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
        try {
            await disconnectDb();
        } catch (e) { }
        process.exit(0);
    }
}

listUsers();
