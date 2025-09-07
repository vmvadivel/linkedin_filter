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

// Function to extract text and send to background script
function analyzePost(postElement) {
  const postText = postElement.textContent;
  chrome.runtime.sendMessage({ action: "analyzePost", postText }, (response) => {
      if (response && response.isCringe) {
          filterPost(postElement, true);
      }
  });
}

// Use a MutationObserver to detect new posts in the feed
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