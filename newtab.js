chrome.storage.local.get('options', function(results) {
  const main = document.querySelector('main');
  const hr = document.createElement('hr');
  const button = document.querySelector('button');

  let options = results.options;

  button.addEventListener('click', function() {
    chrome.runtime.openOptionsPage();
  });

  options.clocks.forEach(clock => {
    const template = main.querySelector('template');
    const section = template.content.cloneNode(true);

    if(clock.timeZone.includes('/')) {
      section.querySelector('time').timeZone = clock.timeZone;
    }

    if(options.labels) {
      section.querySelector('label').textContent = clock.label;
    } else {
      section.querySelector('label').remove();
    }

    main.appendChild(section);
  });

  setInterval(function update() {
    const date = new Date;
    const seconds = date.getSeconds();
    const degree = Math.round(360 * seconds / 60);

    clocks.querySelectorAll('time').forEach(time => {
      time.innerHTML = date.toLocaleTimeString('en-US', {
        'timeZone': time.timeZone || undefined,
        'hour12': !options.hour24,
        'hour': 'numeric', 
        'minute': 'numeric'
      });
    });

    hr.style.transform = `rotate(${degree}deg)`;

    return update;
  }(), 1000);

  main.appendChild(hr);
});