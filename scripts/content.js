// This function applies the blur or vanish effect to a post
function filterPost(postElement, isCringe) {
  if (isCringe) {
      chrome.storage.local.get(['filterMode'], (data) => {
          if (data.filterMode === 'vanish') {
              postElement.style.display = 'none';
          } else { // Blur mode
              const postContent = postElement.firstElementChild;
              if (!postContent) return;

              postContent.style.filter = 'blur(5px)';
              postContent.style.transition = 'filter 0.3s ease-in-out';
              postContent.style.pointerEvents = 'none';

              postElement.style.position = 'relative';

              const oldOverlay = postElement.querySelector('.linkedin-blur-overlay');
              if (oldOverlay) oldOverlay.remove();

              const overlay = document.createElement('div');
              overlay.className = 'linkedin-blur-overlay';

              const msg = document.createElement('div');
              msg.className = 'linkedin-blur-message';
              msg.innerText = 'Blurred by Feed Refiner';
              overlay.appendChild(msg);

              const clickButton = document.createElement('button');
              clickButton.textContent = 'Show Post';
              clickButton.className = 'linkedin-show-button';
              clickButton.tabIndex = 0;

              clickButton.addEventListener('click', (event) => {
                  postContent.style.filter = 'none';
                  postContent.style.pointerEvents = 'auto';
                  overlay.remove();
                  event.stopPropagation();
              });

              overlay.appendChild(clickButton);
              postElement.appendChild(overlay);
          }
      });
  }
}

// Function to check if a post is a sponsored ad
const isPromoted = (postElement) => {
  // Check if the post's text content includes "Promoted" or "Ad"
  return postElement.textContent.includes('Promoted') || postElement.textContent.includes('Ad');
};

// ** NEW: Function to show a temporary user notification **
function notifyUser(message, type = 'error') {
  // Check if a notification already exists to prevent duplicates
  if (document.querySelector('.feed-refiner-notification')) {
      return;
  }

  const notification = document.createElement('div');
  notification.className = `feed-refiner-notification feed-refiner-${type}`;
  notification.innerText = message;

  Object.assign(notification.style, {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      padding: '12px 20px',
      backgroundColor: type === 'error' ? 'red' : 'green',
      color: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      zIndex: '99999',
      transition: 'opacity 0.5s ease-in-out',
      opacity: '1'
  });

  document.body.appendChild(notification);

  setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => notification.remove(), 500);
  }, 5000);
}

// Function to extract text and send to background script
function analyzePost(postElement) {
  // First, check if the post is promoted
  if (isPromoted(postElement)) {
      filterPost(postElement, true);
      return;
  }

  const postText = postElement.textContent;
  chrome.runtime.sendMessage({ action: "analyzePost", postText }, (response) => {
      // check to handle the error gracefully
      if (chrome.runtime.lastError) {
          console.error("Failed to send message: " + chrome.runtime.lastError.message);
          return;
      }

      // Check if the response contains an error from the API
      if (response && response.error) {
          switch (response.error) {
              case "API_KEY_MISSING":
                  notifyUser("Please enter your API key in the extension's settings.");
                  break;
              case "INVALID_API_KEY":
                  notifyUser("Invalid Groq API key. Please check your settings.");
                  break;
              case "API_CALL_FAILED":
                  notifyUser("Groq API call failed. Please try again later.");
                  break;
              case "NETWORK_ERROR":
                  notifyUser("Network error. Please check your internet connection.");
                  break;
              default:
                  notifyUser("An unknown error occurred.");
          }
          return;
      }

      if (response && response.isCringe) {
          filterPost(postElement, true);
      }
  });
}

// Using a MutationObserver to detect new posts in the feed
const observer = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
          const postElement = node.querySelector ? node.querySelector('.feed-shared-update-v2') : null;
          if (postElement) {
              analyzePost(postElement);
          }
      });
  });
});

// Start observing the feed container once it becomes available
const feedContainer = document.querySelector('#voyager-feed');
if (feedContainer) {
  observer.observe(feedContainer, { childList: true, subtree: true });

  // Analyze existing posts on page load
  const existingPosts = document.querySelectorAll('.feed-shared-update-v2');
  existingPosts.forEach(post => {
      analyzePost(post);
  });
}