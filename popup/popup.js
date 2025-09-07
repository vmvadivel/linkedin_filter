document.addEventListener('DOMContentLoaded', async () => {
  const apiKeyInput = document.getElementById('apiKey');
  const saveButton = document.getElementById('saveButton');
  const filterModeSelect = document.getElementById('filterMode');
  const categoriesContainer = document.getElementById('cringeCategories');
  const messageContainer = document.getElementById('messageContainer');

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
      { name: "Generalized & Redundant Content", value: "Generalized or redundant content (e.g., 'The cloud is the future of business')" },
      { name: "Memes & Generic Humor", value: "Posts that are low effort, generic memes, or are purely for humor without providing professional insight." }
  ];

  // Load saved settings
  const savedSettings = await chrome.storage.local.get(['apiKey', 'filterMode', 'enabledCategories']);
  const enabledCategories = savedSettings.enabledCategories || [];

  // Generate and populate checkboxes from the object array
  cringeCategories.forEach(category => {
      const checkboxId = `category-${category.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '')}`;
      const isChecked = enabledCategories.some(c => c.value === category.value);

      const div = document.createElement('div');
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.id = checkboxId;
      input.checked = isChecked;
      input.value = category.value;
      
      const label = document.createElement('label');
      label.htmlFor = checkboxId;
      label.textContent = category.name;

      div.appendChild(input);
      div.appendChild(label);
      categoriesContainer.appendChild(div);
  });

  if (savedSettings.apiKey) {
      apiKeyInput.value = savedSettings.apiKey;
  }
  if (savedSettings.filterMode) {
      filterModeSelect.value = savedSettings.filterMode;
  }

  saveButton.addEventListener('click', () => {
      const apiKey = apiKeyInput.value.trim();
      const filterMode = filterModeSelect.value;
      const selectedCategories = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
          .map(checkbox => cringeCategories.find(c => c.value === checkbox.value));

      // Clear previous messages by removing classes instead of inline styles
      messageContainer.className = '';
      messageContainer.textContent = '';
      apiKeyInput.style.borderColor = '';

      if (!apiKey) {
          messageContainer.textContent = 'Please enter an API Key.';
          messageContainer.classList.add('error-message');
          apiKeyInput.style.borderColor = 'red';
          return;
      }

      const groqKeyRegex = /^gsk_[a-zA-Z0-9]+$/;
      if (!groqKeyRegex.test(apiKey)) {
          messageContainer.textContent = 'Invalid API Key format.';
          messageContainer.classList.add('error-message');
          apiKeyInput.style.borderColor = 'red';
          return;
      }

      chrome.storage.local.set({ apiKey, filterMode, enabledCategories: selectedCategories }, () => {
          messageContainer.textContent = 'Settings saved!';
          messageContainer.classList.add('success-message');
          setTimeout(() => {
              messageContainer.textContent = '';
              messageContainer.className = '';
          }, 3000);
      });
  });
});