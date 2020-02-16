chrome.storage.local.get('options', function(results) {
  const section = document.querySelector('section');
  const footer = document.querySelector('footer');
  const button = {
    'save': document.querySelector('[name="save"]'),
    'add': document.querySelector('[name="add"]')
  };

  let options = results.options;

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

  options.clocks.forEach(clock => {
    add(clock);
  });

  ['hour24', 'labels'].forEach(input => {
    footer.querySelector(`[name="${input}"]`).checked = options[input];
  });

  button.save.addEventListener('click', function() {
    let clocks = [];

    section.querySelectorAll('article').forEach(row => {
      clocks.push({
        'timeZone': row.querySelector('select').value,
        'label': row.querySelector('input').value
      });
    });

    chrome.storage.local.set({
      'options': {
        'clocks': clocks,
        'hour24': footer.querySelector('[name="hour24"]').checked,
        'labels': footer.querySelector('[name="labels"]').checked
      }
    }, window.close);
  });

  button.add.addEventListener('click', add);
});