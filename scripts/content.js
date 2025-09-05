console.log("Content script loaded");
// Function to handle the filtering of a post
function filterPost(postElement, isCringe) {
    if (isCringe) {
      chrome.storage.local.get(['filterMode'], (data) => {
        if (data.filterMode === 'vanish') {
          postElement.style.display = 'none';
        } else { // Blur mode is the default
          // Apply blur and a click-to-view button
          postElement.style.filter = 'blur(5px)';
          postElement.style.transition = 'filter 0.3s ease-in-out';
          postElement.style.position = 'relative';
  
          const clickButton = document.createElement('button');
          clickButton.textContent = 'Show Cringe Post';
          clickButton.style.position = 'absolute';
          clickButton.style.top = '50%';
          clickButton.style.left = '50%';
          clickButton.style.transform = 'translate(-50%, -50%)';
          clickButton.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
          clickButton.style.color = 'white';
          clickButton.style.border = 'none';
          clickButton.style.padding = '10px 15px';
          clickButton.style.borderRadius = '5px';
          clickButton.style.cursor = 'pointer';
          clickButton.style.zIndex = '10';
  
          clickButton.addEventListener('click', (event) => {
            postElement.style.filter = 'none';
            clickButton.remove();
            event.stopPropagation(); // Prevent LinkedIn's click handler
          });
  
          postElement.appendChild(clickButton);
        }
      });
    }
  }
  
  // Function to extract text and send to background script
  function analyzePost(postElement) {
    const postText = postElement.textContent;
    console.log("Posting to background");
    chrome.runtime.sendMessage({ action: "analyzePost", postText }, (response) => {
      if (response && response.isCringe) {
        filterPost(postElement, true);
      }
    });
  }
  
  // Use a MutationObserver to detect new posts
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        // Check if the added node is a post. This selector is a common
        // pattern for LinkedIn feed items, but might need to be adjusted.
        // Look for a unique data-attribute or class on a parent element.
        const postElement = node.querySelector ? node.querySelector('.feed-shared-update-v2') : null;
        if (postElement) {
          analyzePost(postElement);
        }
      });
    });
  });
  
  // Start observing the LinkedIn feed container for changes
  const feedContainer = document.querySelector('.scaffold-layout__main');
  if (feedContainer) {
    observer.observe(feedContainer, { childList: true, subtree: true });

    // Analyze all existing posts at page load
    document.querySelectorAll('.feed-shared-update-v2').forEach(analyzePost);
  }