import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-min-32-characters-change-in-production';

async function main() {
    console.log('--- Auth Verification Script (Offline) ---');
    try {
        // Known User ID from previous career-service diagnostic
        const userId = '51127987-4545-4080-af00-aedd28cd62a5';
        const email = 'nikhil@example.com';

        console.log(`Generating token for known User ID: ${userId}`);

        const token = jwt.sign(
            { userId: userId, email: email, role: 'USER' },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        console.log('\n--- Generated Token ---');
        console.log(token);
        console.log('-----------------------\n');

        console.log(`Run this curl command to test Career Service directly:`);
        console.log(`curl -v -H "Authorization: Bearer ${token}" -H "x-user-id: ${userId}" http://localhost:3003/roadmaps`);

        console.log(`\nRun this curl command to test via Gateway:`);
        console.log(`curl -v -H "Authorization: Bearer ${token}" http://localhost:3000/api/v1/careers/roadmaps`);

    } catch (error) {
        console.error('Error:', error);
    }
}

main();
