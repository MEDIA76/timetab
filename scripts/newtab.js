chrome.storage.local.get([
  'scheme'
], function(storage) {
  const feature = '(prefers-color-scheme: dark)';
  const query = window.matchMedia(feature);
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
  'options'
], function(storage) {
  const widgets = document.querySelector('#widgets');
  const clocks = document.querySelector('#clocks');
  const templates = document.querySelector('#templates');
  const hand = document.createElement('hr');

  function createClock(element) {
    let template = templates.querySelector('#clock');
    let clock = template.content.cloneNode(true);
    let time = clock.querySelector('time');
    let label = clock.querySelector('label');

    if(element.timeZone.includes('/')) {
      time.timeZone = element.timeZone;
    }

    label.textContent = element.label;

    return clock;
  }

  function createCheckbox(element) {
    let template = templates.querySelector('#checkbox');
    let checkbox = template.content.cloneNode(true);
    let input = checkbox.querySelector('input');
    let dfn = checkbox.querySelector('dfn');

    input.name = element.option;
    input.checked = storage.options[element.option];
    dfn.textContent = element.label;

    input.addEventListener('change', function() {
      updateStorage('options', {
        [element.option]: this.checked
      });

      if('change' in element) element.change();
    });

    return checkbox;
  }

  function updateTime() {
    let date = new Date;
    let degree = Math.round(360 * date.getSeconds() / 60);

    clocks.querySelectorAll('time').forEach(time => {
      time.innerHTML = date.toLocaleTimeString('en-US', {
        'timeZone': time.timeZone || undefined,
        'hour12': !storage.options.hour24,
        'hour': 'numeric',
        'minute': 'numeric'
      });
    });

    hand.style.transform = `rotate(${degree}deg)`;
  }

  function updateLabels() {
    let action = !storage.options.labels ? 'add' : 'remove';

    clocks.querySelectorAll('label').forEach(label => {
      label.classList[action]('hide');
    });
  }

  function updateStorage(key, object) {
    for(value in object) {
      storage[key][value] = object[value];
    }

    chrome.storage.sync.set({
      [key]: storage[key]
    });
  }

  (function buildOptions() {
    const options = widgets.querySelector('.options');
    const widget = options.closest('.widget');
    const button = widget.querySelector('[name="options"]');

    [{
      'option': 'hour24',
      'label': 'Use 24 Hour',
      'change': updateTime
    },{
      'option': 'labels',
      'label': 'Show Labels',
      'change': updateLabels
    }].forEach(checkbox => {
      options.appendChild(createCheckbox(checkbox));
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