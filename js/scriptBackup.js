const electron = require('electron');
const {ipcRenderer} = electron;

$('#esito').removeClass('esito-ok esito-ko');

$('#salvaBackup').click(function() {
  if ($('#fileBackup').get(0).files.length === 0) {
    alert("Selezionare il percorso dove salvare il backup");
  } else {
    let x = confirm("Sei sicuro di voler creare il backup?");
    if (x) {
      let file = $('#fileBackup').prop('files')[0];
      ipcRenderer.send('salvaBackup', file.path);
    }
  }
});

ipcRenderer.on('esitoBackup', function(e, esito){
  $('#esito').removeClass('esito-ok esito-ko');
  
  console.log(esito);
  if (esito.esito == 'OK') {
    $('#esito').addClass('esito-ok');
  } else {
    $('#esito').addClass('esito-ko');
  }

  $('#descEsito').text(esito.descErr);
  $('#esito').show();
});

// Nascondo il messaggio
$('#esito').click(function() {
  $('#esito').hide("slow");
});
// fine js