// Content script to interact with the page
(function() {
  'use strict';
  
  // Try to get the current German word from the page
  function getCurrentGermanWord() {
    // Look for the search input or main word display
    const searchInput = document.querySelector('input[type="search"], input[name="search"]');
    if (searchInput && searchInput.value) {
      return searchInput.value;
    }
    
    // Look for the main word in results
    const wordElement = document.querySelector('.lang-de, .lemma, [lang="de"]');
    if (wordElement) {
      return wordElement.textContent.trim().split(/\s+/)[0];
    }
    
    // Look in page title
    const titleMatch = document.title.match(/(\w+)\s+-\s+LEO/);
    if (titleMatch) {
      return titleMatch[1];
    }
    
    return null;
  }
  
  // Listen for messages from background script
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "getCurrentWord") {
      const word = getCurrentGermanWord();
      sendResponse({word: word});
    }
    return true;
  });
  
  // Enhance click handlers to capture audio URLs
  document.addEventListener('click', function(e) {
    const target = e.target;
    if (target.matches('[id*="audio"], .leo-audio, [onclick*="audio"], [onclick*="play"]')) {
      console.log('🎧 Audio element clicked, waiting for download...');
    }
  });
  
  console.log('🔊 Leo Audio Downloader content script loaded');
})();
