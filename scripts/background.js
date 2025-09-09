// Listen for messages from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "analyzePost") {
        // Retrieve API key and user settings from storage
        chrome.storage.local.get(['apiKey', 'enabledCategories'], async (data) => {
            const apiKey = data.apiKey;
            
            const enabledCategoriesValues = (data.enabledCategories || []).map(cat => cat.value);

            if (!apiKey) {
                // Return a specific error if the API key is missing
                sendResponse({ error: "API_KEY_MISSING" });
                return;
            }
            
            if (enabledCategoriesValues.length === 0) {
                 // If no categories are enabled, don't make an API call
                sendResponse({ isCringe: false });
                return;
            }

            // Construct the prompt for the AI model
            const prompt = `Your sole task is to determine if a LinkedIn post is cringe. The cringe categories are: ${enabledCategoriesValues.join('\n')}. Respond with ONLY the JSON object '{"isCringe": true}' if it matches any category, or '{"isCringe": false}' if it does not. Do not include any additional text, explanation or markdown.
            Post to analyze: "${request.postText}"`;

            try {
                const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${apiKey}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        model: "gemma2-9b-it",
                        messages: [{ role: "user", content: prompt }]
                    })
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    // Handle specific API error responses
                    if (response.status === 401) {
                         // Send a specific error for an invalid API key
                        sendResponse({ error: "INVALID_API_KEY" });
                    } else {
                        // For any other HTTP error, send a generic API failure message
                        console.error(`Groq API Error: ${response.status} ${response.statusText} - ${errorText}`);
                        sendResponse({ error: "API_CALL_FAILED" });
                    }
                    return; // Exit the function after sending the error
                }

                const result = await response.json();

                if (!result.choices || !Array.isArray(result.choices) || result.choices.length === 0) {
                    throw new Error("Groq API response did not contain the expected 'choices' array.");
                }

                const aiResponse = result.choices[0].message.content;
                const jsonStringMatch = aiResponse.match(/\{.*\}/);

                let parsedResponse = { isCringe: false };

                if (jsonStringMatch && jsonStringMatch[0]) {
                    try {
                        parsedResponse = JSON.parse(jsonStringMatch[0]);
                    } catch (parseError) {
                        console.error("Failed to parse JSON from AI response:", parseError);
                    }
                }

                sendResponse({ isCringe: parsedResponse.isCringe });

            } catch (error) {
                console.error("Network or Unexpected Error:", error);
                // For all other errors (like network failures), send a generic message
                sendResponse({ error: "NETWORK_ERROR" });
            }
        });

        return true;
    }
});