# Feed Refiner

**Feed Refiner** is a Chrome extension that uses an AI model to filter your LinkedIn feed. Its purpose is to provide users with a more focused and relevant browsing experience.

This project is open source and currently intended for developers and users who want to run and test it locally.

---

### How It Works

* **AI Powered Analysis (Groq API)**: The extension uses the **Groq API** for AI analysis. It sends the text of each new post to a large language model (LLM), which determines if the content matches your selected filter categories.

* **Real-time Detection**: Thanks to a **MutationObserver**, the extension works in real-time, analyzing new posts as they load on your feed without a page refresh.
* **Customizable Control**: You have complete control over what gets filtered. The extension's popup allows you to select specific categories of content you want to block.
* **Two Filter Modes**:
    * **Blur Mode**: Keeps the filtered post visible but blurs its content, showing you that it has been filtered.
    * **Vanish Mode**: Completely removes the post from your feed for a clean, distraction-free scrolling experience.

---

**User Privacy & Data Handling:**

Here's a transparent look at how this extension handles your data:

  - **No Data Collection:** The extension does not collect or store any of your personal information, browsing history, or LinkedIn activity.
  - **Local Storage:** Your API key and filter preferences are stored securely on your machine using your browser's local storage. This data is never transmitted elsewhere.
  - **Minimal Data Sent for Analysis:** The extension **only** sends the visible text of LinkedIn posts to the Groq API for analysis. It doesn't send your profile information, connections, or other personal data.
  - **Third-Party Policy:** Please review the [Groq Privacy Policy](https://groq.com/privacy-policy) to understand their privacy and data-handling policies. We are not responsible for the data practices of third-party API providers.

---

### How to Run the Extension Locally

This is a fun project for developers and tech enthusiasts. While it is not yet published on the Chrome Web Store, you can easily test it by running it locally on your machine.

Prerequisites: You must have a Groq API Key to use this extension. You can get one for free at https://console.groq.com/keys.

1.  **Clone the Repository**: Clone or download the source code for this project from GitHub.
2.  **Open Extension Management**: In Google Chrome, navigate to `chrome://extensions`.
3.  **Enable Developer Mode**: In the top-right corner, toggle on "Developer mode."
4.  **Load Unpacked**: Click the "Load unpacked" button.
5.  **Select Project Folder**: Select the folder containing your extension's files.
6.  **Set Your API Key**: Click on the extension icon, and enter your Groq API key in the popup to start using the filter.

---

### License

This project is licensed under the MIT License - see the LICENSE file for details.

---

### Built by Vadivel

* **Developer**: Vadivel Mohanakrishnan
* **Project**: Feed Refiner