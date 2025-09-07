# Feed Refiner

Feed Refiner is a Chrome extension that uses an AI model to filter your LinkedIn feed. Its purpose is to provide users with a more focused and relevant browsing experience.

This project is not yet published on the Chrome Web Store. It is intended for developers and users who want to run and test it locally.

### How It Works

* **AI Powered Analysis (Groq API)**: The extension uses the Groq API for AI analysis. It sends the text of each new post to a large language model (LLM), which determines if the content matches your selected filter categories.

**User Privacy & Data Handling:**
  - **No Data Collection:** The extension does not collect or store any of your personal information, browsing history, or LinkedIn activity.
  - **Local Storage:** Your API key and filter preferences are stored securely on your machine using your browser's local storage. This data is never transmitted elsewhere.
  - **Minimal Data Sent for Analysis:** The extension **only** sends the visible text of LinkedIn posts to the Groq API for analysis. It doesn't send your profile information, connections, or other personal data.
  - **Third-Party Policy:** Please review the [Groq Privacy Policy](https://groq.com/privacy-policy) to understand their privacy and data-handling policies. We are not responsible for the data practices of third-party API providers.


* **Real-time Detection**: The extension uses a **MutationObserver** to detect new posts as they load on your LinkedIn feed, ensuring that content is analyzed as soon as it appears.
* **Customizable Filtering**: You have complete control over what gets filtered. In the extension's popup, you can select specific categories of content you want to block. You can also save your API key and choose a filter mode.
* **Blur vs. Vanish**:
    * **Blur Mode**: This mode blurs the content of a matched post but keeps the post visible on the feed, allowing you to see that it has been filtered.
    * **Vanish Mode**: This mode completely removes the post from your feed, creating a cleaner, distraction-free scrolling experience.


---

### How to Run the Extension Locally

This is a fun project for developers and tech enthusiasts. While it is not yet published on the Chrome Web Store, you can easily test it by running it locally on your machine.

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