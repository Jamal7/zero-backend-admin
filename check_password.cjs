const bcrypt = require('bcrypt');

const hash = '$2b$10$hKHmv9WRKMuhGbsL4byzDOVrm6lH4sLl8CkQsFufY5mZdNFwtXU3m';
const password = 'jamal@123';

bcrypt.compare(password, hash).then(match => {
    if (match) {
        console.log('--- PASSWORD MATCHES ---');
    } else {
        console.log('--- PASSWORD DOES NOT MATCH ---');
    }
    process.exit(0);
});
