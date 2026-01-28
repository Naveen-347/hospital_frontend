
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: "AIzaSyCmB-Gg_WMLS_GIu7afipZW81_oVXguvps",
});

async function listModels() {
    try {
        console.log("Starting model list...");
        // In the new SDK, .list() might return a custom object or promise
        // We will try debugging the object structure if it fails
        const response = await ai.models.list();

        console.log("Raw response keys:", Object.keys(response || {}));

        // The response usually has a 'models' array provided by the API
        if (response && response.models) {
            console.log(`Found ${response.models.length} models.`);
            response.models.forEach(m => {
                // Check if it supports generateContent
                const methods = m.supportedGenerationMethods || [];
                if (methods.includes("generateContent")) {
                    console.log(`* ${m.name} (${m.displayName})`);
                } else {
                    console.log(`- ${m.name} [No generateContent]`);
                }
            });
        } else {
            console.log("No models property in response", response);
        }

    } catch (error) {
        console.error("LIST ERROR:", error);
        if (error.response) {
            console.error("API Error Response:", await error.response.text());
        }
    }
}

listModels();
