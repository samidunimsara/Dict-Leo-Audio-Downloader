// Listen for audio requests and auto-download them
chrome.webRequest.onCompleted.addListener(
  function(details) {
    // Check if it's an audio file from Leo.org
    if (details.url.includes('/media/audio/') && 
        (details.url.endsWith('.ogg') || details.url.endsWith('.mp3'))) {
      
      console.log('🎧 Leo audio detected:', details.url);
      
      // Extract filename from URL or use timestamp
      const urlParts = details.url.split('/');
      let filename = urlParts[urlParts.length - 1];
      
      // Get the German word from the page if possible
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, {action: "getCurrentWord"}, function(response) {
            const finalFilename = response && response.word ? 
              `${response.word}_${filename}` : 
              `leo_audio_${Date.now()}.ogg`;
            
            // Download the file
            chrome.downloads.download({
              url: details.url,
              filename: `german_pronunciation/${finalFilename}`,
              saveAs: false
            }, function(downloadId) {
              if (chrome.runtime.lastError) {
                console.error('Download failed:', chrome.runtime.lastError);
              } else {
                console.log('✅ Audio downloaded:', finalFilename);
              }
            });
          });
        }
      });
    }
  },
  {urls: ["https://dict.leo.org/media/audio/*"]},
  ["responseHeaders"]
);

// Optional: Listen for messages from content script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "downloadAudio" && request.url) {
    chrome.downloads.download({
      url: request.url,
      filename: request.filename || `german_pronunciation/${Date.now()}.ogg`,
      saveAs: false
    });
  }
});
