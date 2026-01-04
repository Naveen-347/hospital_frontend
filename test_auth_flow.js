
const fetch = require('node-fetch');

async function testAuth() {
    const REG_URL = "https://hospital-backend-7.onrender.com/api/users/register";
    const LOGIN_URL = "https://hospital-backend-7.onrender.com/api/users/login";

    const email = `test_flow_${Math.floor(Math.random() * 100000)}@example.com`;
    const password = "password123";
    const payload = {
        name: "Flow User",
        age: 25,
        address: "Flow City",
        weight: 60,
        email: email,
        password: password
    };

    console.log("Registering...", email);
    try {
        // REGISTER
        const regRes = await fetch(REG_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!regRes.ok) {
            console.log("Reg failed:", await regRes.text());
            return;
        }
        const regData = await regRes.json();
        console.log("Reg Data:", JSON.stringify(regData, null, 2));

        // LOGIN
        console.log("Logging in...");
        const loginRes = await fetch(LOGIN_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        if (!loginRes.ok) {
            console.log("Login failed:", await loginRes.text());
            return;
        }
        const loginData = await loginRes.json();
        console.log("Login Data:", JSON.stringify(loginData, null, 2));

    } catch (e) {
        console.error("Exception:", e);
    }
}

testAuth();
