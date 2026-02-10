const mongoose = require('mongoose');

const connectionString = 'mongodb://localhost:27017/zero';

const jobSchema = new mongoose.Schema({
    jobTitle: String,
    description: String,
    location: String,
    imageUrl: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userapplied: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { strict: false });

const userSchema = new mongoose.Schema({
    userName: String,
    email: String,
});

const Job = mongoose.models.Job || mongoose.model('Job', jobSchema);
const User = mongoose.models.User || mongoose.model('User', userSchema);

async function findJob() {
    try {
        await mongoose.connect(connectionString);

        // Search for job with title containing "jib new2" (case insensitive)
        const jobs = await Job.find({
            jobTitle: { $regex: /jib new2/i }
        }).populate('user', 'userName email').populate('userapplied', 'userName email');

        console.log('--- JOB SEARCH RESULTS ---');
        console.log(`Found ${jobs.length} job(s)\n`);

        jobs.forEach(job => {
            console.log('=== JOB DETAILS ===');
            console.log(`ID: ${job._id}`);
            console.log(`Title: ${job.jobTitle}`);
            console.log(`Description: ${job.description}`);
            console.log(`Location: ${job.location}`);
            console.log(`Image URL: ${job.imageUrl}`);
            console.log(`Posted by: ${job.user ? `${job.user.userName} (${job.user.email})` : 'Unknown'}`);
            console.log(`Applied users (${job.userapplied?.length || 0}):`);
            if (job.userapplied && job.userapplied.length > 0) {
                job.userapplied.forEach((user, i) => {
                    console.log(`  ${i + 1}. ${user.userName} (${user.email})`);
                });
            } else {
                console.log('  No applications yet');
            }
            console.log('\n--- Full Document ---');
            console.log(JSON.stringify(job.toObject(), null, 2));
            console.log('====================\n');
        });
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

findJob();
