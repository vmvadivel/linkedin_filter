    document.addEventListener('DOMContentLoaded', async () => {
      const apiKeyInput = document.getElementById('apiKey');
      const saveButton = document.getElementById('saveButton');
      const filterModeSelect = document.getElementById('filterMode');
      const categoriesContainer = document.getElementById('cringeCategories');
      
      // --- Updated: Get the new message container ---
      const messageContainer = document.getElementById('messageContainer');
      
      const successMessage = document.createElement('p');
      successMessage.textContent = 'Settings saved!'; // Updated message for clarity
      successMessage.style.color = 'green';
      successMessage.style.fontSize = '0.9em';
      
      const errorMessage = document.createElement('p');
      errorMessage.style.color = 'red';
      errorMessage.style.fontSize = '0.9em';
      
      // Append once to the container
      messageContainer.appendChild(successMessage);
      messageContainer.appendChild(errorMessage);
  
    /* const cringeCategories = [
        "Selling a course with an emotional story",
        "Overly emotional/clickbait stories",
        "Generic motivational quotes",
        "Non-tech political/social commentary",
        "Purely personal content without a professional context",
        "Engagement bait (e.g., 'Comment interested')",
        "Generalized or redundant content",
        "Brand promotional content/Ads",
        "Excessive self-promotion",
        "Inappropriate emotional display",
        "Misleading information"
      ]; */



      const cringeCategories = [
        { name: "Overly Emotional Stories", value: "Overly emotional or clickbait stories (e.g., 'I got laid off and it was the best thing that ever happened')" },
        { name: "Personal Content (Non-Professional)", value: "Posts that are purely personal (e.g., vacation photos, family news) without a professional context" },
        { name: "Generic Motivational Content", value: "Using 'life lessons' or motivational quotes that are not tied to professional growth" },
        { name: "Engagement Bait", value: "Engagement bait (e.g., 'Comment 'yes' if you agree', 'Comment 'interested' if you want to get the job')" },
        { name: "Excessive Self-Promotion", value: "Excessive self-promotion or humblebrags (e.g., listing multiple awards or accomplishments without a deeper message)" },
        { name: "Sponsored & Promoted Content", value: "Sponsored or promoted content" },
        { name: "AI-Generated Content", value: "Content that is written by an LLM (AI-generated text that lacks originality)" },
        { name: "Misleading Information", value: "Misleading or out-of-context information" },
        { name: "Inappropriate Emotional Display", value: "Inappropriate emotional display for a professional setting" },
        { name: "Generalized & Redundant Content", value: "Generalized or redundant content (e.g., 'The cloud is the future of business')" }
      ];
  
      // Load saved settings
      const savedSettings = await chrome.storage.local.get(['apiKey', 'filterMode', 'enabledCategories']);
      const enabledCategories = savedSettings.enabledCategories || [];
  
      // --- UPDATED: Generate and populate checkboxes from the object array ---
      cringeCategories.forEach(category => {
          const checkboxId = `category-${category.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '')}`;
          const isChecked = enabledCategories.some(c => c.value === category.value);
  
          const div = document.createElement('div');
          const input = document.createElement('input');
          input.type = 'checkbox';
          input.id = checkboxId;
          input.checked = isChecked;
          input.value = category.value; // Store the full descriptive value
  
          const label = document.createElement('label');
          label.htmlFor = checkboxId;
          label.textContent = category.name; // Display the professional name
  
          div.appendChild(input);
          div.appendChild(label);
          categoriesContainer.appendChild(div);
      });
  
      // --- EXISTING CODE ---
      if (savedSettings.apiKey) {
        apiKeyInput.value = savedSettings.apiKey;
      }
      if (savedSettings.filterMode) {
        filterModeSelect.value = savedSettings.filterMode;
      }
  
      // --- UPDATED: Event listener to save objects, not just strings ---
      saveButton.addEventListener('click', () => {
          const apiKey = apiKeyInput.value.trim();
          const filterMode = filterModeSelect.value;
          const selectedCategories = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
              .map(checkbox => cringeCategories.find(c => c.value === checkbox.value));
  
          // Reset messages and styles
          errorMessage.style.display = 'none';
          successMessage.style.display = 'none';
          apiKeyInput.style.borderColor = '';
  
          if (!apiKey) {
              errorMessage.textContent = 'Please enter an API Key.';
              errorMessage.style.display = 'block';
              apiKeyInput.style.borderColor = 'red';
              return;
          }
  
          const groqKeyRegex = /^gsk_[a-zA-Z0-9]+$/;
          if (!groqKeyRegex.test(apiKey)) {
              errorMessage.textContent = 'Invalid API Key format.';
              errorMessage.style.display = 'block';
              apiKeyInput.style.borderColor = 'red';
              return;
          }
  
          chrome.storage.local.set({ apiKey, filterMode, enabledCategories: selectedCategories }, () => {
              console.log('Settings saved.');
              successMessage.style.display = 'block';
              setTimeout(() => {
                  successMessage.style.display = 'none';
              }, 3000);
          });
      });
  });