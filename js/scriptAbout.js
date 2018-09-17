const electron = require('electron');
const remote = require('electron').remote;
const {ipcRenderer} = electron;
const format = require('../js/numberformat2.js');
const shell = require('electron').shell;

$('#versione').html(parseFloat(Math.round(remote.getGlobal('sharedObj').version * 100) / 100).toFixed(1));
$('#anno').html(remote.getGlobal('sharedObj').copyrightYear);
$('#tipoLicenza').html(remote.getGlobal('sharedObj').licenseType);
$('#esci').focus();

ipcRenderer.on('about', function(e, icon){
  $('#icona').attr('src',icon);
});

$('#esci').on('click', function() {
  var window = remote.getCurrentWindow();
  window.close();
});
// fine js