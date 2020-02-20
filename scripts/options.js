chrome.storage.sync.get([
  'clocks',
  'settings'
], function(results) {
  const { clocks, settings } = results;
  const section = {
    'clocks': document.querySelector('#clocks'),
    'settings': document.querySelector('#settings')
  };
  const button = {
    'save': document.querySelector('[name="save"]'),
    'add': document.querySelector('[name="add"]')
  };

  function addRow(clock = {}) {
    const template = section.clocks.querySelector('#clock');
    const article = template.content.cloneNode(true);

    if(clock.timeZone) {
      article.querySelector('select').value = clock.timeZone;
    }
    
    if(clock.label) {
      article.querySelector('input').value = clock.label;
    }

    section.clocks.appendChild(article);
  }
  
  section.clocks.addEventListener('click', function(event) {
    if(event.target.tagName.toLowerCase() === 'button') {
      event.target.closest('article').remove();
    }
  });

  clocks.forEach(clock => {
    addRow(clock);
  });

  ['hour24', 'labels'].forEach(name => {
    const attribute = `[name="${name}"]`;
    const input = section.settings.querySelector(attribute);

    input.checked = settings[name];
  });

  button.save.addEventListener('click', function() {
    let object = {
      'clocks': [],
      'settings': {}
    };

    section.clocks.querySelectorAll('article').forEach(row => {
      object.clocks.push({
        'timeZone': row.querySelector('select').value,
        'label': row.querySelector('input').value
      });
    });

    ['hour24', 'labels'].forEach(name => {
      const attribute = `[name="${name}"]`;
      const input = section.settings.querySelector(attribute);

      object.settings[name] = input.checked;
    });

    chrome.storage.sync.set(object, window.close);
  });

  button.add.addEventListener('click', addRow);
});