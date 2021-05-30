chrome.storage.sync.get([
  'clocks',
  'settings'
], function(results) {
  const { clocks, settings } = results;
  const section = {
    'clocks': document.querySelector('#clocks'),
    'settings': document.querySelector('#settings'),
    'customOpacity': document.querySelector('#opacityval'),
    'rval' : document.querySelector('#rval'),
    'gval' : document.querySelector('#gval'),
    'bval' : document.querySelector('#bval'),
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
 
  /// populating settings
  clocks.forEach(clock => {
    addRow(clock);
  });

  ['hour24', 'labels'].forEach(name => {
    const attribute = `[name="${name}"]`;
    const input = section.settings.querySelector(attribute);
    console.log("hey ", settings)
    input.checked = settings[name];
  });

  section.customOpacity.value = settings['customOpacity'];
  rgbArray = settings['customColor'].split(",");
  section.rval.value = rgbArray[0];
  section.gval.value = rgbArray[1];
  section.bval.value = rgbArray[2];
  

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

    //getting values
    ['hour24', 'labels'].forEach(name => {
      const attribute = `[name="${name}"]`;
      const input = section.settings.querySelector(attribute);

      object.settings[name] = input.checked;
    });

    object.settings['customOpacity'] = section.customOpacity.value;
    rgbString = `${section.rval.value},${section.gval.value},${section.bval.value}`
    object.settings['customColor'] = rgbString;


    chrome.storage.sync.set(object, window.close);
  });
  button.add.addEventListener('click', addRow);
});