async function test() {
    try {
        console.log("Fetching users...");
        const usersRes = await fetch('http://localhost:3000/api/get-all-users');
        const usersData = await usersRes.json();
        const users = usersData.users;

        if (!users || users.length === 0) {
            console.log("No users found.");
            return;
        }

        const seeker = users.find(u => u.userType === 'jobSeeker');
        if (!seeker) {
            console.log("No seeker found.");
        }
        const userId = seeker ? seeker._id : users[0]._id;
        console.log(`Testing with User ID: ${userId} (${seeker ? 'Seeker' : 'Unknown'})`);

        console.log(`Fetching messages for user ${userId}...`);
        const res = await fetch(`http://localhost:3000/api/user-messages?userId=${userId}`);
        const data = await res.json();

        if (data.messages) {
            console.log(`Found ${data.messages.length} messages.`);
            if (data.messages.length > 0) {
                // Filter for messages that HAVE a jobId to test population
                const msgWithJob = data.messages.find(m => m.jobId);

                if (msgWithJob) {
                    console.log("Message with Job ID:", JSON.stringify(msgWithJob, null, 2));
                    if (typeof msgWithJob.jobId === 'object' && msgWithJob.jobId.jobTitle) {
                        console.log("✅ JOB DETAILS POPULATED CORRECTLY: " + msgWithJob.jobId.jobTitle);
                    } else {
                        console.log("❌ Job details missing (jobId is ID string or null):", msgWithJob.jobId);
                    }
                } else {
                    console.log("⚠️ No messages with jobId found for this user.");
                }

                // Check for image URL
                const msgWithImage = data.messages.find(m => m.imageUrl);
                if (msgWithImage) {
                    console.log("✅ Image URL found:", msgWithImage.imageUrl);
                } else {
                    console.log("⚠️ No messages with imageUrl found.");
                }
            }
        } else {
            console.log("No messages returned structure:", data);
        }

    } catch (e) {
        console.error("Error:", e);
    }
}

test();
