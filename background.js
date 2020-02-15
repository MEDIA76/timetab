chrome.browserAction.onClicked.addListener(createNewTab);

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

  createNewTab();
});

function createNewTab() {
  chrome.tabs.create({
    'url': 'chrome://newtab'
  });
}