chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
  chrome.tabs.executeScript(null, { file: 'content.js' });
});