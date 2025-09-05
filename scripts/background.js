console.log("Background loaded");

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "analyzePost") {
      console.log("Background received analyzePost");
      // Retrieve API key and user settings from storage
      chrome.storage.local.get(['apiKey', 'enabledCategories'], async (data) => {
        const apiKey = data.apiKey;
        const enabledCategories = data.enabledCategories || [];
  
        if (!apiKey || enabledCategories.length === 0) {
          console.warn("API Key or cringe categories not set. Skipping analysis.");
          sendResponse({ isCringe: false });
          return;
        }
  
        // Construct the prompt for the AI model
        const prompt = `You are a LinkedIn content moderation AI. Analyze the following post to determine if it is cringe based on these categories: ${enabledCategories.join(', ')}. If it matches any, respond with JSON '{"isCringe": true}'. Otherwise, respond with '{"isCringe": false}'.
        Post: "${request.postText}"`;
  
        try {
          // --- REAL API CALL TO GROQ ---
          const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${apiKey}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              model: "gemma2-9b-it", // Using the recommended model
              messages: [{ role: "user", content: prompt }]
            })
          });
  
          const result = await response.json();
          
          // Extract the content from the model's response
          const aiResponse = result.choices[0].message.content;
          
          // Parse the JSON response from the model
          const parsedResponse = JSON.parse(aiResponse);
          
          // Send the result back to the content script
          sendResponse({ isCringe: parsedResponse.isCringe });
  
        } catch (error) {
          console.error("AI API Error:", error);
          // Fallback to not filtering the post if an error occurs
          sendResponse({ isCringe: false });
        }
      });
  
      // Return true to indicate we will respond asynchronously
      return true;
    }
  });