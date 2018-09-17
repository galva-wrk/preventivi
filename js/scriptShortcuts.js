const electron = require('electron');
const remote = require('electron').remote;
const {ipcRenderer} = electron;

$('#esci').focus();

$('#esci').on('click', function() {
  var window = remote.getCurrentWindow();
  window.close();
});
// fine js