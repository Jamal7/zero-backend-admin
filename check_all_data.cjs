const { MongoClient } = require('mongodb');

async function main() {
    const uri = 'mongodb://localhost:27017/zero';
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Connected to MongoDB\n');

        const db = client.db('zero');
        const jobsCollection = db.collection('jobs');
        const usersCollection = db.collection('users');

        // Count all users by type
        const allUsers = await usersCollection.find({}).toArray();
        const employers = allUsers.filter(u => u.userType === 'Employer');
        const jobSeekers = allUsers.filter(u => u.userType === 'Job Seeker' || u.userType === 'JobSeeker');

        console.log('='.repeat(80));
        console.log('DATABASE SUMMARY');
        console.log('='.repeat(80));
        console.log(`\nTotal Users: ${allUsers.length}`);
        console.log(`  - Employers: ${employers.length}`);
        console.log(`  - Job Seekers: ${jobSeekers.length}`);
        console.log(`  - Other/Unknown: ${allUsers.length - employers.length - jobSeekers.length}`);

        // Get all jobs
        const allJobs = await jobsCollection.find({}).toArray();
        console.log(`\nTotal Jobs: ${allJobs.length}`);

        // Count applications
        let totalApplied = 0;
        let totalShortlisted = 0;

        console.log('\n' + '='.repeat(80));
        console.log('JOBS DETAILS WITH APPLICATIONS');
        console.log('='.repeat(80));

        for (const job of allJobs) {
            const appliedCount = job.userapplied ? job.userapplied.length : 0;
            const shortlistedCount = job.usershortlist ? job.usershortlist.length : 0;

            totalApplied += appliedCount;
            totalShortlisted += shortlistedCount;

            // Find employer
            const employer = await usersCollection.findOne({ _id: job.user });

            console.log(`\n📋 Job: "${job.jobTitle}"`);
            console.log(`   Posted by: ${employer ? employer.email : 'Unknown'}`);
            console.log(`   Applied: ${appliedCount}`);
            console.log(`   Shortlisted/Accepted: ${shortlistedCount}`);
        }

        console.log('\n' + '='.repeat(80));
        console.log('TOTALS');
        console.log('='.repeat(80));
        console.log(`Total Applications across all jobs: ${totalApplied}`);
        console.log(`Total Shortlisted/Accepted across all jobs: ${totalShortlisted}`);

        // Show unique user types
        const userTypes = [...new Set(allUsers.map(u => u.userType))];
        console.log(`\nUnique User Types in DB: ${userTypes.join(', ')}`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
    }
}

main();
