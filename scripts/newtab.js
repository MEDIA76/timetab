chrome.storage.local.get([
  'scheme'
], function(storage) {
  const query = window.matchMedia('(prefers-color-scheme: dark)');
  const mode = query.matches ? 'dark' : 'light';

  if(storage.scheme !== mode) {
    chrome.browserAction.setIcon({
      'path': `icons/${mode}/38.png`
    });

    chrome.storage.local.set({
      'scheme': mode
    });
  }
});

chrome.storage.sync.get([
  'clocks',
  'settings'
], function(storage) {
  const clocksElement = document.querySelector('#clocks');
  const clockTemplate = document.querySelector('#clock');
  const optionsButton = document.querySelector('[name="options"]');
  const handElement = document.createElement('hr');

  window.storage = storage;

  optionsButton.addEventListener('click', function() {
    this.parentElement.classList.toggle('open');
  });

  clocksElement.appendChild(handElement);

  (function createClocks() {
    clocksElement.querySelectorAll('section').forEach(clock => {
      clock.remove();
    });

    storage.clocks.forEach(clock => {
      const clockClone = clockTemplate.content.cloneNode(true);
      const timeElement = clockClone.querySelector('time');
      const labelElement = clockClone.querySelector('label');

      if(clock.timeZone.includes('/')) {
        timeElement.timeZone = clock.timeZone;
      }

      if(storage.settings.labels) {
        labelElement.textContent = clock.label;
      } else {
        labelElement.remove();
      }

      handElement.before(clockClone);
    });
  })();

  setInterval(function update() {
    const date = new Date;
    const degree = Math.round(360 * date.getSeconds() / 60);

    clocksElement.querySelectorAll('time').forEach(time => {
      time.innerHTML = date.toLocaleTimeString('en-US', {
        'timeZone': time.timeZone || undefined,
        'hour12': !storage.settings.hour24,
        'hour': 'numeric', 
        'minute': 'numeric'
      });
    });

    handElement.style.transform = `rotate(${degree}deg)`;

    return update;
  }(), 1000);
});