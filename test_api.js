
const fetch = require('node-fetch'); // might not be installed, use https or built-in fetch if node 18+

async function testRegister() {
    const API_URL = "https://hospital-backend-7.onrender.com/api/users/register";
    const payload = {
        name: "Test User " + Math.floor(Math.random() * 1000),
        age: 30,
        address: "123 Test St",
        weight: 70,
        email: `test${Math.floor(Math.random() * 10000)}@example.com`,
        password: "password123"
    };

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        console.log("Status:", res.status);
        if (res.ok) {
            const data = await res.json();
            console.log("Response Data:", JSON.stringify(data, null, 2));
        } else {
            console.log("Error:", await res.text());
        }
    } catch (e) {
        console.error("Exception:", e);
    }
}

testRegister();
