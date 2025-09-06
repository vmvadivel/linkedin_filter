// Listen for messages from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "analyzePost") {
      console.log("[LinkedInFilter] Background received analyzePost");
      // Retrieve API key and user settings from storage
      chrome.storage.local.get(['apiKey', 'enabledCategories'], async (data) => {
          const apiKey = data.apiKey;
          
          const enabledCategoriesValues = (data.enabledCategories || []).map(cat => cat.value);

          // Now checks enabledCategoriesValues, which is the array of strings
          if (!apiKey || enabledCategoriesValues.length === 0) {
              console.warn("API Key or cringe categories not set. Skipping analysis.");
              sendResponse({ isCringe: false });
              return;
          }

          // Construct the prompt for the AI model
          const prompt = `Your sole task is to determine if a LinkedIn post is cringe. The cringe categories are: ${enabledCategoriesValues.join('\n')}. Respond with ONLY the JSON object '{"isCringe": true}' if it matches any category, or '{"isCringe": false}' if it does not. Do not include any additional text, explanation or markdown.
          Post to analyze: "${request.postText}"`;

          try {
              // --- REAL API CALL TO GROQ ---
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

              // Check for a successful HTTP response.
              if (!response.ok) {
                  const errorText = await response.text();
                  throw new Error(`Groq API Error: ${response.status} ${response.statusText} - ${errorText}`);
              }

              const result = await response.json();

              // Check if the response contains valid data to prevent errors.
              if (!result.choices || !Array.isArray(result.choices) || result.choices.length === 0) {
                  throw new Error("Groq API response did not contain the expected 'choices' array.");
              }

              // Extract the content from the model's response
              const aiResponse = result.choices[0].message.content;

              // Use a regular expression to find and extract the JSON string.
              const jsonStringMatch = aiResponse.match(/\{.*\}/);

              let parsedResponse = { isCringe: false }; // Default value if parsing fails

              if (jsonStringMatch && jsonStringMatch[0]) {
                  try {
                      parsedResponse = JSON.parse(jsonStringMatch[0]);
                  } catch (parseError) {
                      console.error("Failed to parse JSON from AI response:", parseError);
                  }
              }

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