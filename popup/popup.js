document.addEventListener('DOMContentLoaded', () => {
    const apiKeyInput = document.getElementById('apiKey');
    const saveButton = document.getElementById('saveButton');
    const filterModeSelect = document.getElementById('filterMode');
    const categoriesContainer = document.getElementById('cringeCategories');
  
    // --- New Elements for Validation Feedback ---
    const apiKeySection = document.querySelector('.api-key-section');
    const successMessage = document.createElement('p');
    successMessage.textContent = 'API Key saved!';
    successMessage.style.color = 'green';
    successMessage.style.fontSize = '0.9em';
    successMessage.style.display = 'none'; // Initially hidden
    successMessage.style.marginTop = '5px';
    apiKeySection.appendChild(successMessage);

    const errorMessage = document.createElement('p');
    errorMessage.textContent = 'Please enter a valid API Key.';
    errorMessage.style.color = 'red';
    errorMessage.style.fontSize = '0.9em';
    errorMessage.style.display = 'none'; // Initially hidden
    errorMessage.style.marginTop = '5px';
    apiKeySection.appendChild(errorMessage);
  // --- End of New Elements ---

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
        const apiKey = apiKeyInput.value.trim(); // Trim whitespace from the input
    
        // --- Validation Logic ---
        if (!apiKey) {
          // If the API key is empty, show an error and a visual cue
          errorMessage.style.display = 'block';
          successMessage.style.display = 'none';
          apiKeyInput.style.borderColor = 'red';
          setTimeout(() => {
            apiKeyInput.style.borderColor = ''; // Revert border color after 3 seconds
          }, 3000);
          return; // Stop the function here
        }
    
        // Hide any previous errors
        errorMessage.style.display = 'none';
        apiKeyInput.style.borderColor = '';
    
        // Save the valid key
        chrome.storage.local.set({ apiKey }, () => {
          console.log('API Key saved.');
          // Show success message
          successMessage.style.display = 'block';
          setTimeout(() => {
            successMessage.style.display = 'none'; // Hide after 3 seconds
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