// Listen for messages from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "analyzePost") {
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
          // This is a placeholder for an AI API call. You must replace this with the
          // actual code for your chosen AI model (e.g., Groq, OpenAI, Gemini).
          // Example for Groq:
          /*
          const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${apiKey}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              model: "mixtral-8x7b-32768",
              messages: [{ role: "user", content: prompt }]
            })
          });
          const result = await response.json();
          const aiResponse = result.choices[0].message.content;
          const parsedResponse = JSON.parse(aiResponse);
          */
          
          // --- For now, let's use a dummy response to make it functional ---
          // In a real-world scenario, the code above would be uncommented and used.
          // For testing, this dummy response will simulate an AI response.
          const isCringe = request.postText.toLowerCase().includes("tag 3 people");
          sendResponse({ isCringe: isCringe });
  
        } catch (error) {
          console.error("AI API Error:", error);
          sendResponse({ isCringe: false });
        }
      });
  
      // Return true to indicate we will respond asynchronously
      return true;
    }
  });