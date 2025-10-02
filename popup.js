// Popup script for UI interactions
document.addEventListener('DOMContentLoaded', function() {
  // Check if extension is active
  chrome.storage.local.get(['isActive'], function(result) {
    const status = document.getElementById('status');
    if (result.isActive !== false) {
      status.textContent = '✅ Active - Audio files will auto-download';
      status.className = 'status active';
    } else {
      status.textContent = '❌ Paused - Click to enable';
      status.className = 'status';
    }
  });
  
  // Toggle active state
  document.getElementById('status').addEventListener('click', function() {
    chrome.storage.local.get(['isActive'], function(result) {
      const newState = result.isActive === false;
      chrome.storage.local.set({isActive: newState}, function() {
        location.reload();
      });
    });
  });
});
