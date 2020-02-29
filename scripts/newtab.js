const body = document.body;

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
  'widgets'
], function(storage) {
  const clocks = body.querySelector('#clocks');
  const widgets = body.querySelector('#widgets');
  const templates = body.querySelector('#templates');
  const hand = document.createElement('hr');

  const create = {
    'checkbox': function(element) {
      let checkbox = create.clone('checkbox');
      let input = checkbox.querySelector('input');
      let dfn = checkbox.querySelector('dfn');

      input.name = element.name;
      input.checked = element.checked;
      dfn.textContent = element.label;

      if('change' in element) {
        input.addEventListener('change', element.change);
      }

      return checkbox;
    },

    'clock': function(element) {
      let clock = create.clone('clock');
      let time = clock.querySelector('time');
      let label = clock.querySelector('label');

      if(element.timeZone.includes('/')) {
        time.timeZone = element.timeZone;
      }

      label.textContent = element.label;

      return clock;
    },

    'clone': function(name) {
      let attribute = `[for="${name}"]`;
      let template = templates.querySelector(attribute);
      let clone = template.content.cloneNode(true);

      return clone;
    },

    'options': function(section, number) {
      const options = section.querySelector('.options');
      const button = section.querySelector('#options');

      [{
        'name': 'hour24',
        'label': 'Use 24 Hour',
        // 'change': update.time
      },{
        'name': 'labels',
        'label': 'Show Labels',
        // 'change': update.labels
      }].forEach(object => {
        object.checked = read.widget(number)[object.name];
        object.change = function() {
          update.widget(number, {
            [object.name]: this.checked
          });
        };

        options.appendChild(create.checkbox(object));
      });

      button.addEventListener('click', function() {
        this.parentElement.classList.toggle('open');
      });
    },

    'zone': function(element) {
      let zone = create.clone('zone');

      return zone;
    }
  };

  const read = {
    'widget': function(number) {
      return storage.widgets[number];
    }
  };

  const update = {
    'labels': function() {
      let action = !read.widget(3).labels ? 'add' : 'remove';

      clocks.querySelectorAll('label').forEach(label => {
        label.classList[action]('hide');
      });
    },

    'time': function() {
      let date = new Date;
      let degree = Math.round(360 * date.getSeconds() / 60);

      clocks.querySelectorAll('time').forEach(time => {
        time.innerHTML = date.toLocaleTimeString('en-US', {
          'timeZone': time.timeZone || undefined,
          'hour12': !read.widget(3).hour24,
          'hour': 'numeric',
          'minute': 'numeric'
        });
      });

      hand.style.transform = `rotate(${degree}deg)`;
    },

    'widget': function(number, object = {}) {
      for(value in object) {
        storage.widgets[number][value] = object[value];
      }

      chrome.storage.sync.set({
        'widgets': storage.widgets
      });
    }
  };

  (function() {
    clocks.appendChild(hand);

    storage.clocks.forEach(object => {
      hand.before(create.clock(object));
    });

    update.time(); update.labels();

    [...widgets.children].forEach((section, index) => {
      let widget = storage.widgets[index = ++index];

      if(widget) create[widget.type](section, index);
    });

    setInterval(update.time, 1000);
  })();
});