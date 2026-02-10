async function debugSeeker() {
    try {
        const targetEmail = "mjamalnasir7-seeker2@gmail.com";
        console.log(`Looking for user: ${targetEmail}`);

        const usersRes = await fetch('http://localhost:3000/api/get-all-users');
        const usersData = await usersRes.json();
        const user = usersData.users.find(u => u.email === targetEmail);

        if (!user) {
            console.log("User not found!");
            return;
        }

        console.log(`Found User ID: ${user._id}`);

        const messagesRes = await fetch(`http://localhost:3000/api/user-messages?userId=${user._id}`);
        const data = await messagesRes.json();

        console.log(`Total Messages: ${data.messages.length}`);

        // Analyze unique keys logic
        const mapKeys = new Set();
        const entries = [];

        data.messages.forEach(m => {
            const sender = m.senderId;
            const receiver = m.receiverId;
            const job = m.jobId;
            const jobId = job?._id || 'no-job';

            // Check keys for SENDER
            if (sender && sender._id !== user._id) {
                const key = `${sender._id}-${jobId}`;
                if (!mapKeys.has(key)) {
                    mapKeys.add(key);
                    entries.push({ type: 'SENDER', name: sender.userName || sender.email, jobId: jobId, jobTitle: job?.jobTitle, salary: job?.salary });
                }
            }

            // Check keys for RECEIVER
            if (receiver && receiver._id !== user._id) {
                const key = `${receiver._id}-${jobId}`;
                if (!mapKeys.has(key)) {
                    mapKeys.add(key);
                    entries.push({ type: 'RECEIVER', name: receiver.userName || receiver.email, jobId: jobId, jobTitle: job?.jobTitle, salary: job?.salary });
                }
            }
        });

        console.log("\n--- Generated List Entries ---");
        entries.forEach(e => console.log(JSON.stringify(e)));

        console.log("\n--- Detailed Message Sample for Job ---");
        const msgWithJob = data.messages.find(m => m.jobId);
        if (msgWithJob) {
            console.log("Job Object:", JSON.stringify(msgWithJob.jobId, null, 2));
        } else {
            console.log("No messages with Job ID found.");
        }

    } catch (e) {
        console.error("Error:", e);
    }
}

debugSeeker();
