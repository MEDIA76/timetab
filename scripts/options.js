chrome.storage.sync.get([
  'clocks',
  'settings'
], function(results) {
  const { clocks, settings } = results;
  const section = document.querySelector('section');
  const footer = document.querySelector('footer');
  const button = {
    'save': document.querySelector('[name="save"]'),
    'add': document.querySelector('[name="add"]')
  };

  function add(clock = {}) {
    const template = document.getElementById('clock');
    const article = template.content.cloneNode(true);

    if(clock.timeZone) {
      article.querySelector('select').value = clock.timeZone;
    }
    
    if(clock.label) {
      article.querySelector('input').value = clock.label;
    }

    section.appendChild(article);
  }
  
  section.addEventListener('click', function(event) {
    if(event.target.tagName.toLowerCase() === 'button') {
      event.target.closest('article').remove();
    }
  });

  clocks.forEach(clock => {
    add(clock);
  });

  ['hour24', 'labels'].forEach(input => {
    footer.querySelector(`[name="${input}"]`).checked = settings[input];
  });

  button.save.addEventListener('click', function() {
    let clocks = [];

    section.querySelectorAll('article').forEach(row => {
      clocks.push({
        'timeZone': row.querySelector('select').value,
        'label': row.querySelector('input').value
      });
    });

    chrome.storage.sync.set({
      'clocks': clocks,
      'settings': {
        'hour24': footer.querySelector('[name="hour24"]').checked,
        'labels': footer.querySelector('[name="labels"]').checked
      }
    }, window.close);
  });

  button.add.addEventListener('click', add);
});