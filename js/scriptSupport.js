const electron = require('electron');
const remote = require('electron').remote;
const {ipcRenderer} = electron;

$('#log').attr('href', remote.getGlobal('sharedObj').pathLog);

// fine js