document.addEventListener('DOMContentLoaded', function() {
  const modes = document.getElementsByName('mode');

  chrome.storage.sync.get('mode', function(data) {
      if (data.mode === 'save') {
        modes[0].checked = true;
      } else if (data.mode === 'tab') {
        modes[1].checked = true;
      }      
  });

  for (var i = 0; i < modes.length; i++) {
      modes[i].addEventListener('click', function() {
          chrome.storage.sync.set({mode: this.value}, function() {
              console.log('The extension has been ' + this.value + '.');
          });
      });
  }
});