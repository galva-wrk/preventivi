const electron = require('electron');
const {ipcRenderer} = electron;
const formParm = document.querySelector('#formparm');
let parmComodo;

$('#esito').removeClass('esito-ok esito-ko');

// Inserimento nuovo parametro
ipcRenderer.on('nuovoParametro', function(e){
  $('#nuovoParm').show();
  $('#modificaParm').hide();
  
  $("#codParmI").prop('required',true);
  $("#desParmI").prop('required',true);
  $("#valoreI").prop('required',true);
});

// Popola tabella
ipcRenderer.on('modificaParametro', function(e, parametro){
  $('#nuovoParm').hide();
  $('#modificaParm').show();
  
  $('#modParametro').prop( "disabled", true );
  
  $("#codParmM").prop('required',true);
  $("#desParmM").prop('required',true);
  $("#valoreM").prop('required',true);
  
  $('#idM').val(parametro.id);
  $('#codParmM').val(parametro.codice);
  $('#desParmM').val(parametro.descrizione);
  $('#valoreM').val(parametro.valore);
  
  parmComodo = parametro;
  
});

$('#insParametro').on('click', function() {
  var parametro = {
    id: $('#idI').html(),
    codice: $('#codParmI').val(),
    descrizione: $('#desParmI').val(),
    valore: $('#valoreI').val()
  }
  let esito = checkSalva('ins');
  if (esito.rc == '') {
    ipcRenderer.send('confermaInsParametro', 'Conferma inserimento', "Confermi l'inserimento del parametro?", 'Inserisci', 'inserisciParametro', parametro, '', '');
  }
});

$('#modParametro').on('click', function() {
  var parametro = {
    id: $('#idM').val(),
    codice: $('#codParmM').val(),
    descrizione: $('#desParmM').val(),
    valore: $('#valoreM').val()
  }
  
  let esito = checkSalva('mod');
  if (esito.rc == '') {
    ipcRenderer.send('confermaAggParametro', 'Conferma aggiornamento', "Confermi l'aggiornamento del parametro?", 'Aggiorna', 'aggiornaParametro', parametro, '', '');
  }
});

$('#codParmM, #desParmM, #valoreM').focusout(function() {
  checkAggio();
});

function checkAggio() {
  if ($('#codParmM').val() == parmComodo.codice && $('#desParmM').val() == parmComodo.descrizione && $('#valoreM').val() == parmComodo.valore) {
    // Disabilito il bottone di salvataggio
    $('#modParametro').prop( "disabled", true );
  } else {
    // Abilito il bottone di salvataggio
    $('#modParametro').prop( "disabled", false );
  }
}

// controlla valori
function checkSalva(operazione) {
  pulisciErr();
  
  let esito = {
    rc: '',
    descErr: ''
  }
  if (operazione == 'ins') {
    if ($('#codParmI').val() === '') {
      $('#codParmI').addClass('errore');
      $('#codParmI').focus();
      esito.rc = 'KO';
      esito.descErr = 'Codice parametro obbligatorio';
    } else if ($('#desParmI').val() === '') {
      $('#desParmI').addClass('errore');
      $('#desParmI').focus();
      esito.rc = 'KO';
      esito.descErr = 'Descrizione obbligatoria';
    } else if ($('#valoreI').val() === '') {
      $('#valoreI').addClass('errore');
      $('#valoreI').focus();
      esito.rc = 'KO';
      esito.descErr = 'Valore obbligatorio';
    }
  } else {
    if ($('#codParmM').val() === '') {
      $('#codParmM').addClass('errore');
      $('#codParmM').focus();
      esito.rc = 'KO';
      esito.descErr = 'Codice parametro obbligatorio';
    } else if ($('#desParmM').val() === '') {
      $('#desParmM').addClass('errore');
      $('#desParmM').focus();
      esito.rc = 'KO';
      esito.descErr = 'Descrizione obbligatoria';
    } else if ($('#valoreM').val() === '') {
      $('#valoreM').addClass('errore');
      $('#valoreM').focus();
      esito.rc = 'KO';
      esito.descErr = 'Valore obbligatorio';
    }
  }
  
  if (esito.rc == 'KO') {
    $('#esito').addClass('esito-ko');
    $('#descEsito').text(esito.descErr);
    $('#esito').show();
  }
  
  return esito;
}

// Pulizia errori
function pulisciErr() {
  $('#codParmI').removeClass('errore');
  $('#codParmM').removeClass('errore');
  $('#desParmI').removeClass('errore');
  $('#desParmM').removeClass('errore');
  $('#valoreI').removeClass('errore');
  $('#valoreM').removeClass('errore');
  
  $('#esito').hide();
}  

// Nascondo il messaggio
$('#esito').on('click', function() {
  $('#esito').hide();
});
// fine js