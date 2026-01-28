
const https = require('https');

const API_KEY = "AIzaSyCmB-Gg_WMLS_GIu7afipZW81_oVXguvps";
const URL = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

console.log("Checking available models...");

https.get(URL, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const parsed = JSON.parse(data);
            if (parsed.error) {
                console.error("API Error:", parsed.error.message);
            } else if (parsed.models) {
                console.log("\n✅ Models available for your key:");
                parsed.models.forEach(m => {
                    const isGen = m.supportedGenerationMethods.includes("generateContent");
                    if (isGen) {
                        console.log(`- ${m.name.replace("models/", "")} (Supports content generation)`);
                    }
                });
            } else {
                console.log("Unexpected response:", data);
            }
        } catch (e) {
            console.error("Parse error:", e);
        }
    });

}).on("error", (err) => {
    console.error("Network error:", err.message);
});
