const electron = require('electron');
const {ipcRenderer} = electron;
const formCli = document.querySelector('#formparm');
var preventivo = false; // Se TRUE significa che sono stato richiamato durante la creazione di un nuovo preventivo
let clienteComodo;

$('#esito').removeClass('esito-ok esito-ko');
// Inserimento nuovo cliente
ipcRenderer.on('nuovoCliente', function(e, indice){
  nuovoCli(indice);
});

// Chiamata durante la creazione di un nuovo preventivo
ipcRenderer.on('nuovoClientePrev', function(e, indice){
  nuovoCli(indice);
  
  preventivo = true;
});

// Popola tabella
ipcRenderer.on('modificaCliente', function(e, cliente){
  modificaCli(cliente);
  
  clienteComodo = cliente;
  
  // Disabilito il bottone di salvataggio
  $('#salvaMod').prop( "disabled", true );
});

$('#salvaIns').click(function() {
  var tipoCli = '';
  if ($('#insBtnPriv').hasClass('btn-success')) {
    tipoCli = 'P';
  } else {
    tipoCli = 'S';
  }
  
  var cliente = {
    id: $('#idI').html(),
    nome: $('#nomeI').val(),
    cognome: $('#cognomeI').val(),
    ragSoc: $('#ragSocI').val(),
    cdFis: $('#cdFisI').val(),
    pIva: $('#pIvaI').val(),
    indirizzo: $('#indirI').val(),
    numCiv: $('#numCivI').val(),
    cap: $('#capI').val(),
    comune: $('#comuneI').val(),
    provincia: $('#provI').val(),
    tipoCli: tipoCli
  }
  
  let esito = checkSalva('ins', tipoCli);
  if (esito.rc == '') {
    if (preventivo) {
      ipcRenderer.send('confermaInsCli', 'Conferma inserimento', "Confermi l'inserimento del cliente?", 'Inserisci', 'inserisciClientePrev', cliente, '', '', '', '', '');
    } else {
      ipcRenderer.send('confermaInsCli', 'Conferma inserimento', "Confermi l'inserimento del cliente?", 'Inserisci', 'inserisciCliente', cliente, '', '', '', '', '');
    }
  }
});

$('#salvaMod').click(function() {
  var tipoCli = '';
  if ($('#modBtnPriv').hasClass('btn-success')) {
    tipoCli = 'P';
  } else {
    tipoCli = 'S';
  }
  
  var cliente = {
    id: $('#idM').html(),
    nome: $('#nomeM').val(),
    cognome: $('#cognomeM').val(),
    ragSoc: $('#ragSocM').val(),
    cdFis: $('#cdFisM').val(),
    pIva: $('#pIvaM').val(),
    indirizzo: $('#indirM').val(),
    numCiv: $('#numCivM').val(),
    cap: $('#capM').val(),
    comune: $('#comuneM').val(),
    provincia: $('#provM').val(),
    tipoCli: tipoCli
  }
  
  let esito = checkSalva('mod', tipoCli);
  if (esito.rc == '') {
    ipcRenderer.send('confermaAggCli', 'Conferma aggiornamento', "Confermi l'aggiornamento dei dati del cliente?", 'Aggiorna', 'aggiornaCliente', cliente, '', '', '', '', '');
  }
});

$('#nomeM, #cognomeM, #ragSocM, #cdFisM, #pIvaM, #indirM, #numCivM, #capM, #comuneM, #provM').focusout(function() {
  checkAggio();
});

function checkAggio() {
  let tipoCli;
  if ($('#modBtnPriv').hasClass('btn-success')) {
    tipoCli = 'P';
  } else {
    tipoCli = 'S';
  }
  
  if ($('#nomeM').val() == clienteComodo.nome && $('#cognomeM').val() == clienteComodo.cognome && $('#ragSocM').val() == clienteComodo.ragSoc
  &&  $('#cdFisM').val() == clienteComodo.cdFis && $('#pIvaM').val() == clienteComodo.pIva && $('#indirM').val() == clienteComodo.indirizzo 
  &&  $('#numCivM').val() == clienteComodo.numCiv && $('#capM').val() == clienteComodo.cap && $('#comuneM').val() == clienteComodo.comune
  &&  $('#provM').val() == clienteComodo.provincia && tipoCli == clienteComodo.tipoCli) {
    // Disabilito il bottone di salvataggio
    $('#salvaMod').prop( "disabled", true );
  } else {
    // Abilito il bottone di salvataggio
    $('#salvaMod').prop( "disabled", false );
  }
}

function changePrivato(tipo) {
  if (tipo == 'ins') {
    if (document.getElementById("insBtnPriv").classList.contains("btn-default")) {
      setPrivato();
    }
  } else if (tipo == 'mod') {
    if (document.getElementById("modBtnPriv").classList.contains("btn-default")) {
      setPrivato();
      checkAggio();
    }
  }
}

function setPrivato() {
  // Inserisci
  $('#rowNomeIns').show();
  $('#rowCognomeIns').show();
  $('#rowCdFisIns').show();
  $('#rowRagSocIns').hide();
  $('#rowPIvaIns').hide();
  $('#fillerIns').hide();
  $('#insBtnPriv').removeClass('btn-default');
  $('#insBtnSoc').removeClass('btn-success');
  $('#insBtnPriv').addClass('btn-success');
  $('#insBtnSoc').addClass('btn-default');
  
  $("#nomeI").prop('required',true);
  $("#cognomeI").prop('required',true);
  $("#cdFisI").prop('required',true);
  $("#indirI").prop('required',true);
  $("#numCivI").prop('required',true);
  $("#capI").prop('required',true);
  $("#comuneI").prop('required',true);
  $("#provI").prop('required',true);
  $("#ragSocI").prop('required',false);
  $("#pIvaI").prop('required',false);
  
  // Modifica
  $('#rowNomeMod').show();
  $('#rowCognomeMod').show();
  $('#rowCdFisMod').show();
  $('#rowRagSocMod').hide();
  $('#rowPIvaMod').hide();
  $('#fillerMod').hide();
  $('#modBtnPriv').removeClass('btn-default');
  $('#modBtnSoc').removeClass('btn-success');
  $('#modBtnPriv').addClass('btn-success');
  $('#modBtnSoc').addClass('btn-default');
  
  $("#nomeM").prop('required',true);
  $("#cognomeM").prop('required',true);
  $("#cdFisM").prop('required',true);
  $("#indirM").prop('required',true);
  $("#numCivM").prop('required',true);
  $("#capM").prop('required',true);
  $("#comuneM").prop('required',true);
  $("#provM").prop('required',true);
  $("#ragSocM").prop('required',false);
  $("#pIvaM").prop('required',false);
}

function changeSocieta(tipo) {
  if (tipo == 'ins') {
    if (document.getElementById("insBtnSoc").classList.contains("btn-default")) {
      setSocieta();
    }
  } else if (tipo == 'mod') {
    if (document.getElementById("modBtnSoc").classList.contains("btn-default")) {
      setSocieta();
      checkAggio();
    }
  }
}

function setSocieta() {
  // Inserisci
  $('#rowNomeIns').hide();
  $('#rowCognomeIns').hide();
  $('#rowCdFisIns').hide();
  $('#rowRagSocIns').show();
  $('#rowPIvaIns').show();
  $('#fillerIns').show();
  $('#insBtnSoc').removeClass('btn-default');
  $('#insBtnPriv').removeClass('btn-success');
  $('#insBtnSoc').addClass('btn-success');
  $('#insBtnPriv').addClass('btn-default');
  
  $("#ragSocI").prop('required',true);
  $("#pIvaI").prop('required',true);
  $("#indirI").prop('required',true);
  $("#numCivI").prop('required',true);
  $("#capI").prop('required',true);
  $("#comuneI").prop('required',true);
  $("#provI").prop('required',true);
  $("#nomeI").prop('required',false);
  $("#cognomeI").prop('required',false);
  $("#cdFisI").prop('required',false);
  
  // Modifica
  $('#rowNomeMod').hide();
  $('#rowCognomeMod').hide();
  $('#rowCdFisMod').hide();
  $('#rowRagSocMod').show();
  $('#rowPIvaMod').show();
  $('#fillerMod').show();
  $('#modBtnSoc').removeClass('btn-default');
  $('#modBtnPriv').removeClass('btn-success');
  $('#modBtnSoc').addClass('btn-success');
  $('#modBtnPriv').addClass('btn-default');
  
  $("#ragSocM").prop('required',true);
  $("#pIvaM").prop('required',true);
  $("#indirM").prop('required',true);
  $("#numCivM").prop('required',true);
  $("#capM").prop('required',true);
  $("#comuneM").prop('required',true);
  $("#provM").prop('required',true);
  $("#nomeM").prop('required',false);
  $("#cognomeM").prop('required',false);
  $("#cdFisM").prop('required',false);
}

function nuovoCli(indice) {
  $('#nuovoCli').show();
  $('#modificaCli').hide();
  
  $('#idI').html(indice);
  
  setPrivato();
}

function modificaCli(cliente) {
  $('#nuovoCli').hide();
  $('#modificaCli').show();

  $('#idM').html(cliente.id);
  $('#nomeM').val(cliente.nome);
  $('#cognomeM').val(cliente.cognome);
  $('#ragSocM').val(cliente.ragSoc);
  $('#cdFisM').val(cliente.cdFis);
  $('#pIvaM').val(cliente.pIva);
  $('#indirM').val(cliente.indirizzo);
  $('#numCivM').val(cliente.numCiv);
  $('#capM').val(cliente.cap);
  $('#comuneM').val(cliente.comune);
  $('#provM').val(cliente.provincia);

  if (cliente.tipoCli == 'P') {
    setPrivato();
  } else {
    setSocieta();
  }
}

// controlla valori
function checkSalva(operazione, tipoCli) {
  pulisciErr();
  
  let esito = {
    rc: '',
    descErr: ''
  }
  if (operazione == 'ins') {
    if (tipoCli == 'S') {
      if ($('#ragSocI').val() === '') {
        $('#ragSocI').addClass('errore');
        $('#ragSocI').focus();
        esito.rc = 'KO';
        esito.descErr = 'Ragione sociale obbligatoria';
      } else if ($('#pIvaI').val() === '') {
        $('#pIvaI').addClass('errore');
        $('#pIvaI').focus();
        esito.rc = 'KO';
        esito.descErr = 'Partita IVA obbligatoria';
      } else if (!$.isNumeric($('#pIvaI').val())) {
        $('#pIvaI').addClass('errore');
        $('#pIvaI').focus();
        esito.rc = 'KO';
        esito.descErr = 'Partita IVA non numerica';
      } else if ($('#pIvaI').val().length !== 11) {
        $('#pIvaI').addClass('errore');
        $('#pIvaI').focus();
        esito.rc = 'KO';
        esito.descErr = 'Partita IVA deve avere 11 cifre';
      } else if ($('#indirI').val() === '') {
        $('#indirI').addClass('errore');
        $('#indirI').focus();
        esito.rc = 'KO';
        esito.descErr = 'Indirizzo obbligatorio';
      } else if ($('#numCivI').val() === '') {
        $('#numCivI').addClass('errore');
        $('#numCivI').focus();
        esito.rc = 'KO';
        esito.descErr = 'Numero civico obbligatorio';
      } else if ($('#capI').val() === '') {
        $('#capI').addClass('errore');
        $('#capI').focus();
        esito.rc = 'KO';
        esito.descErr = 'CAP obbligatorio';
      } else if (!$.isNumeric($('#capI').val())) {
        $('#capI').addClass('errore');
        $('#capI').focus();
        esito.rc = 'KO';
        esito.descErr = 'CAP non numerico';
      } else if ($('#capI').val().length !== 5) {
        $('#capI').addClass('errore');
        $('#capI').focus();
        esito.rc = 'KO';
        esito.descErr = 'CAP deve avere 5 cifre';
      } else if ($('#comuneI').val() === '') {
        $('#comuneI').addClass('errore');
        $('#comuneI').focus();
        esito.rc = 'KO';
        esito.descErr = 'Comune obbligatorio';
      } else if ($('#provI').val() === '') {
        $('#provI').addClass('errore');
        $('#provI').focus();
        esito.rc = 'KO';
        esito.descErr = 'Provincia obbligatoria';
      } 
    } else {
      if ($('#nomeI').val() === '') {
        $('#nomeI').addClass('errore');
        $('#nomeI').focus();
        esito.rc = 'KO';
        esito.descErr = 'Nome obbligatorio';
      } else if ($('#cognomeI').val() === '') {
        $('#cognomeI').addClass('errore');
        $('#cognomeI').focus();
        esito.rc = 'KO';
        esito.descErr = 'Cognome obbligatorio';
      } else if ($('#cdFis').val() === '') {
        $('#cdFis').addClass('errore');
        $('#cdFis').focus();
        esito.rc = 'KO';
        esito.descErr = 'Codice fiscale obbligatorio';
      } else if ($('#cdFisI').val().length !== 16) {
        $('#cdFisI').addClass('errore');
        $('#cdFisI').focus();
        esito.rc = 'KO';
        esito.descErr = 'Codice fiscale deve avere 16 caratteri';
      } else if ($('#indirI').val() === '') {
        $('#indirI').addClass('errore');
        $('#indirI').focus();
        esito.rc = 'KO';
        esito.descErr = 'Indirizzo obbligatorio';
      } else if ($('#numCivI').val() === '') {
        $('#numCivI').addClass('errore');
        $('#numCivI').focus();
        esito.rc = 'KO';
        esito.descErr = 'Numero civico obbligatorio';
      } else if ($('#capI').val() === '') {
        $('#capI').addClass('errore');
        $('#capI').focus();
        esito.rc = 'KO';
        esito.descErr = 'CAP obbligatorio';
      } else if (!$.isNumeric($('#capI').val())) {
        $('#capI').addClass('errore');
        $('#capI').focus();
        esito.rc = 'KO';
        esito.descErr = 'CAP non numerico';
      } else if ($('#capI').val().length !== 5) {
        $('#capI').addClass('errore');
        $('#capI').focus();
        esito.rc = 'KO';
        esito.descErr = 'CAP deve avere 5 cifre';
      } else if ($('#comuneI').val() === '') {
        $('#comuneI').addClass('errore');
        $('#comuneI').focus();
        esito.rc = 'KO';
        esito.descErr = 'Comune obbligatorio';
      } else if ($('#provI').val() === '') {
        $('#provI').addClass('errore');
        $('#provI').focus();
        esito.rc = 'KO';
        esito.descErr = 'Provincia obbligatoria';
      } 
    }
    
  } else {
    if (tipoCli == 'S') {
      if ($('#ragSocM').val() === '') {
        $('#ragSocM').addClass('errore');
        $('#ragSocM').focus();
        esito.rc = 'KO';
        esito.descErr = 'Ragione sociale obbligatoria';
      } else if ($('#pIvaM').val() === '') {
        $('#pIvaM').addClass('errore');
        $('#pIvaM').focus();
        esito.rc = 'KO';
        esito.descErr = 'Partita IVA obbligatoria';
      } else if (!$.isNumeric($('#pivaM').val())) {
        $('#pIvaM').addClass('errore');
        $('#pIvaM').focus();
        esito.rc = 'KO';
        esito.descErr = 'Partita IVA non numerica';
      } else if ($('#pIvaM').val().length !== 11) {
        $('#pIvaM').addClass('errore');
        $('#pIvaM').focus();
        esito.rc = 'KO';
        esito.descErr = 'Partita IVA deve avere 11 cifre';
      } else if ($('#indirM').val() === '') {
        $('#indirM').addClass('errore');
        $('#indirM').focus();
        esito.rc = 'KO';
        esito.descErr = 'Indirizzo obbligatorio';
      } else if ($('#numCivM').val() === '') {
        $('#numCivM').addClass('errore');
        $('#numCivM').focus();
        esito.rc = 'KO';
        esito.descErr = 'Numero civico obbligatorio';
      } else if ($('#capM').val() === '') {
        $('#capM').addClass('errore');
        $('#capM').focus();
        esito.rc = 'KO';
        esito.descErr = 'CAP obbligatorio';
      } else if (!$.isNumeric($('#capM').val())) {
        $('#capM').addClass('errore');
        $('#capM').focus();
        esito.rc = 'KO';
        esito.descErr = 'CAP non numerico';
      } else if ($('#capM').val().length !== 5) {
        $('#capM').addClass('errore');
        $('#capM').focus();
        esito.rc = 'KO';
        esito.descErr = 'CAP deve avere 5 cifre';
      } else if ($('#comuneM').val() === '') {
        $('#comuneM').addClass('errore');
        $('#comuneM').focus();
        esito.rc = 'KO';
        esito.descErr = 'Comune obbligatorio';
      } else if ($('#provM').val() === '') {
        $('#provM').addClass('errore');
        $('#provM').focus();
        esito.rc = 'KO';
        esito.descErr = 'Provincia obbligatoria';
      } 
    } else {
      if ($('#nomeM').val() === '') {
        $('#nomeM').addClass('errore');
        $('#nomeM').focus();
        esito.rc = 'KO';
        esito.descErr = 'Nome obbligatorio';
      } else if ($('#cognomeM').val() === '') {
        $('#cognomeM').addClass('errore');
        $('#cognomeM').focus();
        esito.rc = 'KO';
        esito.descErr = 'Cognome obbligatorio';
      } else if ($('#cdFis').val() === '') {
        $('#cdFis').addClass('errore');
        $('#cdFis').focus();
        esito.rc = 'KO';
        esito.descErr = 'Codice fiscale obbligatorio';
      } else if ($('#cdFisM').val().length !== 16) {
        $('#cdFisM').addClass('errore');
        $('#cdFisM').focus();
        esito.rc = 'KO';
        esito.descErr = 'Codice fiscale deve avere 16 caratteri';
      } else if ($('#indirM').val() === '') {
        $('#indirM').addClass('errore');
        $('#indirM').focus();
        esito.rc = 'KO';
        esito.descErr = 'Indirizzo obbligatorio';
      } else if ($('#numCivM').val() === '') {
        $('#numCivM').addClass('errore');
        $('#numCivM').focus();
        esito.rc = 'KO';
        esito.descErr = 'Numero civico obbligatorio';
      } else if ($('#capM').val() === '') {
        $('#capM').addClass('errore');
        $('#capM').focus();
        esito.rc = 'KO';
        esito.descErr = 'CAP non numerico';
      } else if ($('#capM').val().length !== 5) {
        $('#capM').addClass('errore');
        $('#capM').focus();
        esito.rc = 'KO';
        esito.descErr = 'CAP deve avere 5 cifre';
      } else if ($('#comuneM').val() === '') {
        $('#comuneM').addClass('errore');
        $('#comuneM').focus();
        esito.rc = 'KO';
        esito.descErr = 'Comune obbligatorio';
      } else if ($('#provM').val() === '') {
        $('#provM').addClass('errore');
        $('#provM').focus();
        esito.rc = 'KO';
        esito.descErr = 'Provincia obbligatoria';
      } 
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
  $('#nomeI').removeClass('errore');
  $('#nomeM').removeClass('errore');
  $('#cognomeI').removeClass('errore');
  $('#cognomeM').removeClass('errore');
  $('#ragSocI').removeClass('errore');
  $('#ragSocM').removeClass('errore');
  $('#cdFisI').removeClass('errore');
  $('#cdFisM').removeClass('errore');
  $('#pIvaI').removeClass('errore');
  $('#pIvaM').removeClass('errore');
  $('#indirI').removeClass('errore');
  $('#indirM').removeClass('errore');
  $('#numCivI').removeClass('errore');
  $('#numCivM').removeClass('errore');
  $('#capI').removeClass('errore');
  $('#capM').removeClass('errore');
  $('#comuneI').removeClass('errore');
  $('#comuneM').removeClass('errore');
  $('#provI').removeClass('errore');
  $('#provM').removeClass('errore');
  
  $('#esito').hide();
}  

// Nascondo il messaggio
$('#esito').on('click', function() {
  $('#esito').hide();
});
// fine js