chrome.storage.local.get([
  'scheme'
], function(storage) {
  const query = window.matchMedia('(prefers-color-scheme: dark)');
  const mode = query.matches ? 'dark' : 'light';

  if(storage.scheme != mode) {
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
  const widgets = document.querySelector('#widgets');
  const clocks = document.querySelector('#clocks');
  const hand = document.createElement('hr');

  function createClock(clock) {
    let template = clocks.querySelector('#clock');
    let clone = template.content.cloneNode(true);

    if(clock.timeZone.includes('/')) {
      clone.querySelector('time').timeZone = clock.timeZone;
    }

    clone.querySelector('label').textContent = clock.label;

    return clone;
  }

  function updateTime() {
    let date = new Date;
    let degree = Math.round(360 * date.getSeconds() / 60);

    clocks.querySelectorAll('time').forEach(time => {
      time.innerHTML = date.toLocaleTimeString('en-US', {
        'timeZone': time.timeZone || undefined,
        'hour12': !storage.settings.hour24,
        'hour': 'numeric',
        'minute': 'numeric'
      });
    });

    hand.style.transform = `rotate(${degree}deg)`;
  }

  function updateLabels() {
    let labels = storage.settings.labels;

    clocks.querySelectorAll('label').forEach(label => {
      label.classList[!labels ? 'add' : 'remove']('hide');
    });
  }

  (function buildOptions() {
    const options = widgets.querySelector('article.options');
    const button = widgets.querySelector('[name="options"]');
    const inputs = options.querySelectorAll('input');

    inputs.forEach(input => {
      input.checked = storage.settings[input.name];

      input.addEventListener('change', function() {
        storage.settings[input.name] = this.checked;

        if(input.name == 'hour24') updateTime();
        if(input.name == 'labels') updateLabels();

        chrome.storage.sync.set({
          'settings': storage.settings
        });
      });
    });

    button.addEventListener('click', function() {
      this.parentElement.classList.toggle('open');
    });
  })();

  (function buildClocks() {
    clocks.appendChild(hand);

    storage.clocks.forEach(clock => {
      hand.before(createClock(clock));
    });

    updateTime(); updateLabels();

    setInterval(updateTime, 1000);
  })();
});