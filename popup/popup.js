document.addEventListener('DOMContentLoaded', async () => {
    const apiKeyInput = document.getElementById('apiKey');
    const saveButton = document.getElementById('saveButton');
    const filterModeSelect = document.getElementById('filterMode');
    const categoriesContainer = document.getElementById('cringeCategories');
    const messageContainer = document.getElementById('messageContainer');

    const cringeCategories = [
        { id: "emotional-stories", name: "Overly Emotional Stories", value: "Overly emotional or clickbait stories (e.g., 'I got laid off and it was the best thing that ever happened')" },
        { id: "personal-content", name: "Personal Content (Non-Professional)", value: "Posts that are purely personal (e.g., vacation photos, family news) without a professional context" },
        { id: "motivational-content", name: "Generic Motivational Content", value: "Using 'life lessons' or motivational quotes that are not tied to professional growth" },
        { id: "engagement-bait", name: "Engagement Bait", value: "Engagement bait (e.g., 'Comment 'yes' if you agree', 'Comment 'interested' if you want to get the job')" },
        { id: "self-promotion", name: "Excessive Self-Promotion", value: "Excessive self-promotion or humblebrags (e.g., listing multiple awards or accomplishments without a deeper message)" },
        { id: "sponsored-content", name: "Sponsored & Promoted Content", value: "Sponsored or promoted content" },
        { id: "ai-generated", name: "AI-Generated Content", value: "Content that is written by an LLM (AI-generated text that lacks originality)" },
        { id: "misleading-info", name: "Misleading Information", value: "Misleading or out-of-context information" },
        { id: "inappropriate-display", name: "Inappropriate Emotional Display", value: "Inappropriate emotional display for a professional setting" },
        { id: "generalized-content", name: "Generalized & Redundant Content", value: "Generalized or redundant content (e.g., 'The cloud is the future of business')" },
        { id: "memes-humor", name: "Memes & Generic Humor", value: "Posts that are low effort, generic memes, or are purely for humor without providing professional insight." }
    ];

    // Load saved settings
    const savedSettings = await chrome.storage.local.get(['apiKey', 'filterMode', 'enabledCategories']);
    const enabledCategories = savedSettings.enabledCategories || [];

    // Generate and populate checkboxes from the object array
    cringeCategories.forEach(category => {
        const checkboxId = `category-${category.id}`; 
        const isChecked = enabledCategories.some(c => c.id === category.id);

        const div = document.createElement('div');
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.id = checkboxId;
        input.checked = isChecked;
        input.value = category.id; 

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
        const selectedCheckboxes = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'));
        
        const selectedCategories = selectedCheckboxes
            .map(checkbox => cringeCategories.find(c => c.id === checkbox.value));

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