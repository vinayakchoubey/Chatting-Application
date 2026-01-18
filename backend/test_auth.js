

const BASE_URL = 'http://localhost:5001/api/auth';

const rand = Math.floor(Math.random() * 10000);
const phone = `123456${rand}`; // Unique phone
const email = `test${rand}@example.com`;

async function testPhoneSignup() {
    console.log("--- Testing Phone Signup ---");
    console.log(`Using phone: ${phone}`);

    // 1. Send OTP (Signup)
    console.log("\n1. Sending OTP (Signup)...");
    const sendRes = await fetch(`${BASE_URL}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            fullName: "Test User",
            phone: phone
        })
    });
    const sendData = await sendRes.json();
    console.log("Status:", sendRes.status);
    console.log("Response:", sendData);

    if (sendRes.status !== 200) return;

    // 2. We can't easily read the console for OTP, but since I am the dev...
    // Wait, I can't read the OTP from here unless I query DB.
    // I will just test if it returns 200.
    // If I want to test verify, I need the OTP. 
    // I'll make a tool call to read the user from DB to get the OTP.
}

testPhoneSignup();
