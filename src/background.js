chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.create({ url: chrome.extension.getURL("index.html") });
});

chrome.runtime.onInstalled.addListener((reason) => {
  chrome.tabs.create({ url: chrome.extension.getURL("index.html") });
});
