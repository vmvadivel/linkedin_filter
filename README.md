# Feed Refiner

Feed Refiner is an AI-powered Chrome extension that curates your LinkedIn feed by removing unprofessional, low-quality, and distracting content, helping you focus on what truly matters.

### How It Works

* **AI-Powered Analysis (Groq API)**: The extension uses the Groq API for lightning-fast AI analysis. It sends the text of each new post to a large language model (LLM), which determines if the content matches your selected filter categories.
* **Real-time Detection**: The extension uses a **MutationObserver** to detect new posts as they load on your LinkedIn feed, ensuring that content is analyzed as soon as it appears.
* **Customizable Filtering**: You have complete control over what gets filtered. In the extension's popup, you can select specific categories of content you want to block. You can also save your API key and choose a filter mode.
* **Blur vs. Vanish**:
    * **Blur Mode**: This mode blurs the content of a matched post but keeps the post visible on the feed, allowing you to see that it has been filtered.
    * **Vanish Mode**: This mode completely removes the post from your feed, creating a cleaner, distraction-free scrolling experience.

---

### Demo Video

[Link to your demo video here]

---

### How to Run the Extension Locally

1.  **Clone the Repository**: Clone or download the source code for this project from GitHub.
2.  **Open Extension Management**: In Google Chrome, navigate to `chrome://extensions`.
3.  **Enable Developer Mode**: In the top-right corner, toggle on "Developer mode."
4.  **Load Unpacked**: Click the "Load unpacked" button.
5.  **Select Project Folder**: Select the folder containing your extension's files.
6.  **Set Your API Key**: Click on the extension icon, and enter your Groq API key in the popup to start using the filter.

---

### Built by Vadivel

* **Developer**: Vadivel Mohanakrishnan
* **Project**: Feed Refiner
* **Contact**: https://www.linkedin.com/in/vmvadivel