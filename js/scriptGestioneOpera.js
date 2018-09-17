const electron = require('electron');
const {ipcRenderer, globalShortcut} = electron;
const formParm = document.querySelector('#formparm');
const format = require('../js/numberformat.js');
const tbodyI = document.querySelector('#tbodyI');
const tbodyM = document.querySelector('#tbodyM');
let operaComodo;
let operaPrevSel = false;
let indicePrevSel;
let inserimento = true;
var preventivo = false; // Se TRUE significa che sono stato richiamato durante la creazione di un nuovo preventivo
let i = 0;

$('#esito').removeClass('esito-ok esito-ko');

// Inserimento nuovo opera
ipcRenderer.on('nuovaOpera', function(e, indice){
  inserimento = true;
  $('#nuovaOpera').show();
  $('#modificaOpera').hide();

  $('#codOperaI').html(indice);
  
  // inserisco una nuova descrizione vuota
  newDescr();
  
  $('#desBrevI').focus();
  
  $("#desBrevI").prop('required',true);
  $("#desOperaI").prop('required',true);
  $("#importoI").prop('required',true);
  $("#desBrevM").prop('required',false);
  $("#desOperaM").prop('required',false);
  $("#importoM").prop('required',false);
  
  $('#addDescrI').click(function() {
    newDescr('');
  });
  
  creaShortcut();
});

// Inserimento nuovo opera dal preventivo
ipcRenderer.on('nuovaOperaPrev', function(e, indice){
  inserimento = true;
  preventivo = true;
  $('#nuovaOpera').show();
  $('#modificaOpera').hide();

  $('#codOperaI').html(indice);
  
  // inserisco una nuova descrizione vuota
  newDescr();
  
  $('#desBrevI').focus();
  
  $("#desBrevI").prop('required',true);
  $("#desOperaI").prop('required',true);
  $("#importoI").prop('required',true);
  $("#desBrevM").prop('required',false);
  $("#desOperaM").prop('required',false);
  $("#importoM").prop('required',false);
  
  $('#addDescrI').click(function() {
    newDescr('');
  });
  
  creaShortcut();
});

// Popola tabella
ipcRenderer.on('modificaOpera', function(e, opera){
  inserimento = false;
  $('#nuovaOpera').hide();
  $('#modificaOpera').show();

  $("#desBrevI").prop('required',false);
  $("#desOperaI").prop('required',false);
  $("#importoI").prop('required',false);
  $("#desBrevM").prop('required',true);
  $("#desOperaM").prop('required',true);
  $("#importoM").prop('required',true);

  $('#codOperaM').html(opera.id);
  $('#desBrevM').val(opera.opera);
  $('#importoM').val(format.number_format(opera.importo.toString().replace('.',','), 2, ',', '.'));
  
  for (let i = 0; i < opera.descrizioni.length; i++) {
    newDescr(opera.descrizioni[i].descrizione);
  }
  
  $('#desBrevM').focus();
  
  operaComodo = opera;
  
  // Disabilito il bottone di salvataggio
  $('#modOpera').prop( "disabled", true );
  
  $('#addDescrM').click(function() {
    newDescr('');
  });
  
  creaShortcut();
  
  $("[id^='descrizione']").focusout(function() {
    if (!preventivo) {
      checkAggio();
    }
  });
});

// Popola tabella
ipcRenderer.on('modificaOperaPrev', function(e, opera, indice){
  inserimento = false;
  $('#nuovaOpera').hide();
  $('#modificaOpera').show();
  
  preventivo = true;
  operaPrevSel = false;
  indicePrevSel = indice;

  $("#desBrevI").prop('required',false);
  $("#desOperaI").prop('required',false);
  $("#importoI").prop('required',false);
  $("#desBrevM").prop('required',true);
  $("#desOperaM").prop('required',true);
  $("#importoM").prop('required',true);

  $('#codOperaM').html(opera.id);
  $('#desBrevM').val(opera.opera);
  $('#importoM').val(format.number_format(opera.importo.toString().replace('.',','), 2, ',', '.'));
  
  operaComodo = opera;
  
  for (let i = 0; i < opera.descrizioni.length; i++) {
    newDescr(opera.descrizioni[i].descrizione);
  }
  
  $('#desBrevM').focus();
  
  $('#addDescrM').click(function() {
    newDescr('');
  });
  
  creaShortcut();
});

// Popola tabella
ipcRenderer.on('selezionaOpera', function(e, opera){
  inserimento = false;
  $('#nuovaOpera').hide();
  $('#modificaOpera').show();
  
  preventivo = true;
  operaPrevSel = true;

  $("#desBrevI").prop('required',false);
  $("#desOperaI").prop('required',false);
  $("#importoI").prop('required',false);
  $("#desBrevM").prop('required',true);
  $("#desOperaM").prop('required',true);
  $("#importoM").prop('required',true);

  $('#codOperaM').html(opera.id);
  $('#desBrevM').val(opera.opera);
  $('#importoM').val(format.number_format(opera.importo.toString().replace('.',','), 2, ',', '.'));
  
  operaComodo = opera;
  
  for (let i = 0; i < opera.descrizioni.length; i++) {
    newDescr(opera.descrizioni[i].descrizione);
  }
  
  $('#addDescrM').click(function() {
    newDescr('');
  });
  
  $('#desBrevM').focus();
  
  creaShortcut();
});

$('#importoI').focusout(function() {
  if (isNaN(format.number_format($('#importoI').val(), 2, '.', ''))) {
    $('#importoI').val(format.number_format(0, 2, ',', '.'));
  } else {
    $('#importoI').val(format.number_format($('#importoI').val(), 2, ',', '.'))
  }
});

$('#importoM').focusout(function() {
  if (isNaN(format.number_format($('#importoM').val(), 2, '.', ''))) {
    $('#importoM').val(format.number_format(0, 2, ',', '.'));
  } else {
    $('#importoM').val(format.number_format($('#importoM').val(), 2, ',', '.'))
  }
});

$("#desBrevM, #importoM").focusout(function() {
  if (!preventivo) {
    checkAggio();
  }
});

$('#insOpera').on('click', function() {
  let descr = $("[id^='descrizione']");
  let descrComodo = [];
  
  for (var i = 0; i < descr.length; i++) {
    descrComodo[i] = {descrizione: descr[i].value};
  }
  
  var opera = {
    id: $('#codOperaI').html(),
    opera: $('#desBrevI').val(),
    descrizioni: descrComodo,
    importo: format.number_format($('#importoI').val(), 2, ',', '')
  }
  
  let esito = checkSalva('ins');
  if (esito.rc == '') {
    if (preventivo) {
      ipcRenderer.send('confermaInsOpera', 'Conferma inserimento', "Confermi l'inserimento dell'opera?", 'Inserisci', 'inserisciOperaPrev', opera, '');
    } else {
      ipcRenderer.send('confermaInsOpera', 'Conferma inserimento', "Confermi l'inserimento dell'opera?", 'Inserisci', 'inserisciOpera', opera, '');
    }
  }
});

$('#modOpera').on('click', function() {
  let descr = $("[id^='descrizione']");
  let descrComodo = [];
  
  for (var i = 0; i < descr.length; i++) {
    descrComodo[i] = {descrizione: descr[i].value};
  }
  
  let opera = {
    id: Number($('#codOperaM').html()),
    opera: $('#desBrevM').val(),
    descrizioni: descrComodo,
    importo: Number(format.number_format($('#importoM').val(), 2, '.', ''))
  }

  let esito = checkSalva('mod');
  if (esito.rc == '') {
    if (preventivo) {
      if (operaPrevSel) {
        ipcRenderer.send('confermaCaricaOpera', 'Carica dati opera', "Confermi i dati dell'opera?", 'Carica', 'caricaOpera', opera, '');
      } else {
        ipcRenderer.send('confermaCaricaOpera', 'Conferma aggiornamento', "Confermi i dati dell'opera?", 'Aggiorna', 'aggiornaOperaPrev', opera, indicePrevSel, '', indicePrevSel);
      }
    } else {
      ipcRenderer.send('confermaAggOpera', 'Conferma aggiornamento', "Confermi l'aggiornamento dei dati dell'opera?", 'Aggiorna', 'aggiornaOpera', opera, '');
    }
  }
});

// Premendo Ctrl+ si inserisce una nuova riga
function creaShortcut() {
  var isCtrl = false;$(document).keyup(function (e) {
    if(e.which == 17) isCtrl=false;
  }).keydown(function (e) {
    if(e.which == 17) isCtrl=true;
    if(e.which == 107 && isCtrl == true) {
      newDescr('');
      return false;
    }
  });
}

function newDescr(descr) {
  const row = document.createElement('div');
  row.className = 'row';
  row.id = 'operaDesc' + (i+1);
  row.value = i+1;
  
  // definisco le colonne della tabella
  const spacer = document.createElement('span');
  const descrSpan = document.createElement('span');
  const descrizione = document.createElement('textarea');
  const operaz = document.createElement('span');

  const aggiungi = document.createElement('button');
  const elimina = document.createElement('button');
  const icoAggiungi = document.createElement('span');
  const icoElimina = document.createElement('span');

  spacer.className = 'col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2';
  descrSpan.className = 'col-8 col-sm-8 col-md-8 col-lg-8 col-xl-9 form-group form-group-sm';
  descrizione.className = 'col-12 form-control form-control-sm textarea-sm';
  descrizione.setAttribute("row","1");
  descrizione.setAttribute("maxlength","2000");
  if (!inserimento) {
    descrizione.value = descr;
  }
  operaz.className = 'col-2 col-sm-2 col-md-2 col-lg-2 col-xl-1 text-right';
  aggiungi.className = 'btn btn-sm btn-outline-success';
  icoAggiungi.className = 'fa fa-plus';
  elimina.className = 'btn btn-sm btn-outline-danger';
  icoElimina.className = 'fa fa-trash';

  aggiungi.title = 'Aggiungi';
  elimina.title = 'Elimina';

  aggiungi.type = 'button';
  elimina.type = 'button';

  descrizione.id = 'descrizione' + (i+1);

  aggiungi.id = 'aggiungi' + (i+1);
  aggiungi.value = i+1;
  elimina.id = 'elimina' + (i+1);
  elimina.value = i+1;

  aggiungi.appendChild(icoAggiungi);
  elimina.appendChild(icoElimina);

  // operaz.appendChild(aggiungi);
  operaz.appendChild(elimina);
  
  descrSpan.appendChild(descrizione);

  row.appendChild(spacer);
  row.appendChild(descrSpan);
  row.appendChild(operaz);
  
  if (inserimento) {
    tbodyI.appendChild(row);
  } else {
    tbodyM.appendChild(row);
  }
  
  $('#descrizione' + (i+1)).focus();
  
  $('#elimina' + (i+1)).click(function() {
    let x = confirm("Sei sicuro di voler cancellare l'opera?");
    if (x) {
      $('#operaDesc' + this.value).remove();
      // operePrev[this.value-1] = null;
    }
  });
  
  i++;
}

// controlla valori
function checkSalva(operazione) {
  pulisciErr();
  
  let esito = {
    rc: '',
    descErr: ''
  }
  if (operazione == 'ins') {
    if ($('#desBrevI').val() === '') {
      $('#desBrevI').addClass('errore');
      $('#desBrevI').focus();
      esito.rc = 'KO';
      esito.descErr = 'Descrizione breve obbligatoria';
    } else if ($('#desOperaI').val() === '') {
      $('#desOperaI').addClass('errore');
      $('#desOperaI').focus();
      esito.rc = 'KO';
      esito.descErr = 'Descrizione obbligatoria';
    } else if ($('#importoI').val() === '') {
      $('#importoI').addClass('errore');
      $('#importoI').focus();
      esito.rc = 'KO';
      esito.descErr = 'Importo obbligatorio';
    }
  } else {
    if ($('#desBrevM').val() === '') {
      $('#desBrevM').addClass('errore');
      $('#desBrevM').focus();
      esito.rc = 'KO';
      esito.descErr = 'Descrizione breve obbligatoria';
    } else if ($('#desOperaM').val() === '') {
      $('#desOperaM').addClass('errore');
      $('#desOperaM').focus();
      esito.rc = 'KO';
      esito.descErr = 'Descrizione obbligatoria';
    } else if ($('#importoM').val() === '') {
      $('#importoM').addClass('errore');
      $('#importoM').focus();
      esito.rc = 'KO';
      esito.descErr = 'Importo obbligatorio';
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
  $('#desBrevI').removeClass('errore');
  $('#desBrevM').removeClass('errore');
  $('#desOperaI').removeClass('errore');
  $('#desOperaM').removeClass('errore');
  $('#importoI').removeClass('errore');
  $('#importoM').removeClass('errore');
  
  $('#esito').hide();
}  

function checkAggio() {
  let descr = $("[id^='descrizione']");
  let descrizioniUguali = true;
  
  for (var i = 0; i < operaComodo.descrizioni.length; i++) {
    if (operaComodo.descrizioni[i].descrizione !== descr[i].value) {
      descrizioniUguali = false;
      break;
    }
  }
  
  if ($('#desBrevM').val() == operaComodo.opera && descrizioniUguali && $('#importoM').val() == format.number_format(operaComodo.importo.toString().replace('.',','), 2, ',', '.')) {
    // Disabilito il bottone di salvataggio
    $('#modOpera').prop( "disabled", true );
  } else {
    // Abilito il bottone di salvataggio
    $('#modOpera').prop( "disabled", false );
  }
}

// Nascondo il messaggio
$('#esito').on('click', function() {
  $('#esito').hide();
});
// fine js
