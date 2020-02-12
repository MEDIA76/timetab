let tab = {
  'page': document.getElementById('tab'),
  'hand': document.createElement('hr'),
  'timezones': [
    'America/Chicago',
    'Europe/Luxembourg'
  ]
}

function getTime(timezone) {
  let date = new Date;
  let options = {
    'hour12': false, 
    'hour': 'numeric', 
    'minute': 'numeric'
  };

  if(timezone) {
    options['timeZone'] = timezone;
  }

  return date.toLocaleTimeString('en-US', options);
}

tab.timezones.forEach(timezone => {
  let zone = {
    'section': document.createElement('section'),
    'time': document.createElement('time')
  }

  setInterval(function replaceTime() {
    zone.time.innerHTML = getTime(timezone);

    return replaceTime;
  }(), 1000);

  zone.section.appendChild(zone.time);
  tab.page.appendChild(zone.section);
});

setInterval(function replaceStyle() {
  let seconds = new Date().getSeconds();
  let degree = Math.round(360 * seconds / 60);

  tab.hand.style.transform = `rotate(${degree}deg)`;

  return replaceStyle;
}(), 1000);

tab.page.appendChild(tab.hand);