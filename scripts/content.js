    //console.log("[LinkedInFilter] Content script loaded");
    //console.log("[LinkedInFilter] feedContainer found at top?", !!document.querySelector('#voyager-feed'));

  
    // This function applies the blur or vanish effect to a post and adds a "Show Post" button.
    // The key design choice is to apply the blur to the post's content and then
    // add a separate overlay with the button on top, which prevents the button itself from being blurred.
    function filterPost(postElement, isCringe) {
      if (isCringe) {
        chrome.storage.local.get(['filterMode'], (data) => {
          if (data.filterMode === 'vanish') {
            postElement.style.display = 'none';
          } else { // Blur mode
            const postContent = postElement.firstElementChild;
            if (!postContent) return;
    
            // Blur the post content, not the entire element
            postContent.style.filter = 'blur(5px)';
            postContent.style.transition = 'filter 0.3s ease-in-out';
            postContent.style.pointerEvents = 'none';
    
            // Set the parent post element to be the positioning context
            postElement.style.position = 'relative';
    
            // Remove old overlays if any
            const oldOverlay = postElement.querySelector('.linkedin-blur-overlay');
            if (oldOverlay) oldOverlay.remove();
    
            // Create overlay
            const overlay = document.createElement('div');
            overlay.className = 'linkedin-blur-overlay';
            overlay.style.cssText = `
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              background: rgba(32, 50, 90, 0.65);
              z-index: 100;
              border-radius: 14px;
              pointer-events: auto;
              box-sizing: border-box;
              backdrop-filter: blur(1px);
            `;
    
            // Message
            const msg = document.createElement('div');
            msg.innerText = 'Blurred by Feed Refiner';
            msg.style.cssText = `
              color: #fff;
              font-size: 1.08em;
              margin-bottom: 18px;
              font-weight: 600;
              text-align: center;
              text-shadow: 0 2px 6px rgba(0,0,0,0.14);
            `;
            overlay.appendChild(msg);
    
            // Show button
            const clickButton = document.createElement('button');
            clickButton.textContent = 'Show Post';
            clickButton.style.cssText = `
              background: linear-gradient(90deg, #1abc9c 60%, #2980b9 100%);
              color: #fff;
              font-weight: bold;
              font-size: 1.25em;
              border: none;
              padding: 16px 42px;
              border-radius: 24px;
              box-shadow: 0 4px 18px rgba(0,0,0,0.18);
              cursor: pointer;
              margin-top: 4px;
              transition: background 0.18s, transform 0.14s;
              text-shadow: 0 0 10px #000;
            `;
    
            clickButton.onmouseover = clickButton.onfocus = function() {
              clickButton.style.background = 'linear-gradient(90deg,#16a085 70%,#21618c 100%)';
              clickButton.style.transform = 'scale(1.07)';
            };
            clickButton.onmouseout = clickButton.onblur = function() {
              clickButton.style.background = 'linear-gradient(90deg, #1abc9c 60%, #2980b9 100%)';
              clickButton.style.transform = 'scale(1)';
            };
            clickButton.tabIndex = 0; // accessible
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
    console.log("[LinkedInFilter] Calling analyzePost");
    const postText = postElement.textContent;
    console.log("[LinkedInFilter] Posting to background", postText);
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
  

    function waitForFeedContainer(attempts = 15) {
      const feedContainer = document.querySelector('#voyager-feed');
      if (feedContainer) {
          //console.log("[LinkedInFilter] feedContainer found; proceeding with observer and post analysis.");
          observer.observe(feedContainer, { childList: true, subtree: true });
          const posts = document.querySelectorAll('.feed-shared-update-v2');
          //console.log("[LinkedInFilter] Posts found at startup:", posts.length);
          posts.forEach(post => {
              console.log("[LinkedInFilter] About to analyze post:", post);
              analyzePost(post);
          });
      } else if (attempts > 0) {
          //console.log("[LinkedInFilter] feedContainer not found. Retrying...");
          setTimeout(() => waitForFeedContainer(attempts - 1), 500);
      } else {
          console.warn("[LinkedInFilter] feedContainer not found after multiple retries.");
      }
  }
  
  // Call after all other function/observer definitions:
  waitForFeedContainer();
  