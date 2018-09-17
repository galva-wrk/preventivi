const electron = require('electron');
const remote = require('electron').remote;
const {ipcRenderer} = electron;

$(document).ready(function() {
  $('#anno').html(remote.getGlobal('sharedObj').copyrightYear);
  $('#tipoLicenza').html(remote.getGlobal('sharedObj').licenseType);
  $('#esci').focus();
});

$('#esci').on('click', function() {
  var window = remote.getCurrentWindow();
  window.close();
});
// fine js