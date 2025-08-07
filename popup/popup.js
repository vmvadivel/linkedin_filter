document.addEventListener('DOMContentLoaded', () => {
    const apiKeyInput = document.getElementById('apiKey');
    const saveButton = document.getElementById('saveButton');
    const filterModeSelect = document.getElementById('filterMode');
    const categoriesContainer = document.getElementById('cringeCategories');
    
    // --- Updated: Get the new message container ---
    const messageContainer = document.getElementById('messageContainer');
    
    const successMessage = document.createElement('p');
    successMessage.textContent = 'API Key saved!';
    successMessage.style.color = 'green';
    successMessage.style.fontSize = '0.9em';
    messageContainer.appendChild(successMessage);
  
    const errorMessage = document.createElement('p');
    errorMessage.style.color = 'red';
    errorMessage.style.fontSize = '0.9em';
    messageContainer.appendChild(errorMessage);
  
    const cringeCategories = [
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
      ];
  
    cringeCategories.forEach(category => {
      const div = document.createElement('div');
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.id = category.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
      input.name = 'category';
      
      const label = document.createElement('label');
      label.htmlFor = input.id;
      label.textContent = category;
      
      div.appendChild(input);
      div.appendChild(label);
      categoriesContainer.appendChild(div);
    });
  
    // Load saved settings
    chrome.storage.local.get(['apiKey', 'filterMode', 'enabledCategories'], (data) => {
      if (data.apiKey) {
        apiKeyInput.value = data.apiKey;
      }
      if (data.filterMode) {
        filterModeSelect.value = data.filterMode;
      }
      if (data.enabledCategories) {
        data.enabledCategories.forEach(category => {
          const checkbox = document.getElementById(category.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, ''));
          if (checkbox) {
            checkbox.checked = true;
          }
        });
      }
    });
  
    saveButton.addEventListener('click', () => {
      const apiKey = apiKeyInput.value.trim();
  
      // Reset messages and styles
      errorMessage.style.display = 'none';
      successMessage.style.display = 'none';
      apiKeyInput.style.borderColor = '';
  
      // --- NEW Validation Logic ---
      if (!apiKey) {
        errorMessage.textContent = 'Please enter an API Key.';
        errorMessage.style.display = 'block';
        apiKeyInput.style.borderColor = 'red';
        return;
      }
  
      // A simple regex check for a Groq API key format (starts with gsk_ followed by 29 characters)
      // You can adjust this regex based on your chosen API provider
      const groqKeyRegex = /^gsk_[a-zA-Z0-9]{29}$/;
      if (!groqKeyRegex.test(apiKey)) {
        errorMessage.textContent = 'Invalid API Key format.';
        errorMessage.style.display = 'block';
        apiKeyInput.style.borderColor = 'red';
        return;
      }
      
      // Save the valid key
      chrome.storage.local.set({ apiKey }, () => {
        console.log('API Key saved.');
        successMessage.style.display = 'block';
        setTimeout(() => {
          successMessage.style.display = 'none';
        }, 3000);
      });
    });
  
    filterModeSelect.addEventListener('change', () => {
      const filterMode = filterModeSelect.value;
      chrome.storage.local.set({ filterMode });
    });
  
    categoriesContainer.addEventListener('change', () => {
      const enabledCategories = Array.from(document.querySelectorAll('input[name="category"]:checked'))
                                   .map(checkbox => checkbox.nextElementSibling.textContent);
      chrome.storage.local.set({ enabledCategories });
    });
  });