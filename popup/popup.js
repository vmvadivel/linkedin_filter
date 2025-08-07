document.addEventListener('DOMContentLoaded', () => {
    const apiKeyInput = document.getElementById('apiKey');
    const saveButton = document.getElementById('saveButton');
    const filterModeSelect = document.getElementById('filterMode');
    const categoriesContainer = document.getElementById('cringeCategories');
  
    // List of cringe categories
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
  
    // Dynamically create checkboxes for each cringe category
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
  
    // Load saved settings from Chrome's local storage
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
  
    // Save API key when the button is clicked
    saveButton.addEventListener('click', () => {
      const apiKey = apiKeyInput.value;
      if (apiKey) {
        chrome.storage.local.set({ apiKey }, () => {
          console.log('API Key saved.');
          // Optional: Provide visual feedback to the user
        });
      }
    });
  
    // Save filter mode when the selection changes
    filterModeSelect.addEventListener('change', () => {
      const filterMode = filterModeSelect.value;
      chrome.storage.local.set({ filterMode });
    });
  
    // Save enabled cringe categories when a checkbox changes
    categoriesContainer.addEventListener('change', () => {
      const enabledCategories = Array.from(document.querySelectorAll('input[name="category"]:checked'))
                                   .map(checkbox => checkbox.nextElementSibling.textContent);
      chrome.storage.local.set({ enabledCategories });
    });
  });