chrome.browserAction.onClicked.addListener(function() {
  chrome.tabs.create({'url': 'chrome://newtab'})
});

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.local.set({
    'options': {
      'clocks': [{
        'timeZone': 'Local',
        'label': 'Local',
      }],
      'hour24': false,
      'labels': true
    }
  });
});