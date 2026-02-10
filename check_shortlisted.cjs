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

        // Get all employers (users with userType: "Employer")
        const employers = await usersCollection.find({ userType: 'Employer' }).toArray();

        console.log('='.repeat(80));
        console.log('ACCEPTED (SHORTLISTED) APPLICATIONS BY EMPLOYER');
        console.log('='.repeat(80));
        console.log('');

        let totalAccepted = 0;

        for (const employer of employers) {
            // Get all jobs posted by this employer
            const jobs = await jobsCollection.find({ user: employer._id }).toArray();

            let employerTotal = 0;
            const jobDetails = [];

            for (const job of jobs) {
                const shortlistedCount = job.usershortlist ? job.usershortlist.length : 0;
                const appliedCount = job.userapplied ? job.userapplied.length : 0;
                employerTotal += shortlistedCount;

                if (shortlistedCount > 0 || appliedCount > 0) {
                    jobDetails.push({
                        title: job.jobTitle,
                        applied: appliedCount,
                        shortlisted: shortlistedCount
                    });
                }
            }

            if (jobs.length > 0) {
                console.log(`📧 ${employer.email || 'No email'}`);
                console.log(`   Name: ${employer.userName || 'N/A'}`);
                console.log(`   Total Jobs Posted: ${jobs.length}`);
                console.log(`   Total Accepted/Shortlisted: ${employerTotal}`);

                if (jobDetails.length > 0) {
                    console.log('   Job Breakdown:');
                    for (const jd of jobDetails) {
                        console.log(`     - "${jd.title}": ${jd.shortlisted} accepted / ${jd.applied} applied`);
                    }
                }
                console.log('');
                totalAccepted += employerTotal;
            }
        }

        console.log('='.repeat(80));
        console.log(`GRAND TOTAL ACCEPTED ACROSS ALL EMPLOYERS: ${totalAccepted}`);
        console.log('='.repeat(80));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
    }
}

main();
