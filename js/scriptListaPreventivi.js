const electron = require('electron');
const {ipcRenderer} = electron;
const date = require('date-and-time');
const format = require('../js/numberformat.js');
const tbody = document.querySelector('#tbody');
const selAnno = document.querySelector('#selAnno');
const selCli = document.querySelector('#selCli');
const selOpera = document.querySelector('#selOpera');

$('#esito').removeClass('esito-ok esito-ko');

let currentDate = new Date();
var preventivoComodo = new Array();
var anniComodo = new Array();

// Popola tabella
ipcRenderer.on('tab-lisPrev:carica', function(e, preventivi, prevUpd){
  creaShortcut();

  caricaTab(preventivi, prevUpd);
});

// Popola tabella
ipcRenderer.on('tab-lisPrev:aggiorna', function(e, preventivi, anno, cliente, opera){
  creaShortcut();

  $('#srchCli').val(cliente);
  $('#srchOpera').val(opera);

  if (anno == date.format(currentDate, 'YYYY') && cliente == '' && opera == '') {
    $('#filtro').removeClass('btn-warning');
    $('#filtro').addClass('btn-outline-warning');
  } else {
    $('#filtro').removeClass('btn-outline-warning');
    $('#filtro').addClass('btn-warning');
  }

  caricaTab(preventivi);
});

// Carica filtro
ipcRenderer.on('tab-lisPrev:caricaFiltri', function(e, anni, annoSel, clienti, cliSel, opere, operaSel){
  caricaFiltro(anni, annoSel, clienti, cliSel, opere, operaSel);
});

ipcRenderer.on('esitoOpPreventivo', function(e, esito){
  $('#esito').removeClass('esito-ok esito-ko');

  if (esito.esito == 'OK') {
    $('#esito').addClass('esito-ok');
  } else {
    $('#esito').addClass('esito-ko');
  }

  $('#descEsito').text(esito.descErr);
  $('#esito').show();
});

// function caricaFiltro(anni, annoSel) {
function caricaFiltro(anni, annoSel, clienti, cliSel, opere, operaSel) {
  if (annoSel == '') {
    annoSel = date.format(currentDate, 'YYYY');
  }
  for (var i = 0; i < anni.length; i++) {
    let optAnno = document.createElement('option');
    if (anni[i].anno == annoSel) {
      optAnno.selected = true;
    }
    optAnno.appendChild(document.createTextNode(anni[i].anno));
    selAnno.appendChild(optAnno);
  }

  let optCli = document.createElement('option');
  if (cliSel == '') {
    optCli.selected = true;
  }
  optCli.value = '';
  optCli.appendChild(document.createTextNode(''));
  selCli.appendChild(optCli);
  for (var i = 0; i < clienti.length; i++) {
    let optCli = document.createElement('option');
    if (clienti[i].id == cliSel) {
      optCli.selected = true;
    }
    optCli.value = clienti[i].id;
    optCli.appendChild(document.createTextNode(clienti[i].cliente));
    selCli.appendChild(optCli);
  }

  let optOper = document.createElement('option');
  if (operaSel == '') {
    optOper.selected = true;
  }
  optOper.value = '';
  optOper.appendChild(document.createTextNode(''));
  selOpera.appendChild(optOper);
  for (var i = 0; i < opere.length; i++) {
    let optOper = document.createElement('option');
    if (opere[i].id == operaSel) {
      optOper.selected = true;
      optOper.value = '';
    }
    optOper.value = opere[i].id;
    optOper.appendChild(document.createTextNode(opere[i].opera));
    selOpera.appendChild(optOper);
  }
}

function caricaTab(preventivi, prevUpd) {
  var stripe = true;
  if (preventivi.length > 0) {
    // cancello i dati dalla tabella
    while (tbody.firstChild) {
      tbody.removeChild(tbody.firstChild);
    }

    // carico i dati in tabella
    for (var i = 0; i < preventivi.length; i++) {
      const div = document.createElement('div');
      if (stripe) {
        stripe = false;
        div.className = 'row tbody-gray';
      } else {
        stripe = true;
        div.className = 'row tbody';
      }

      // definisco le colonne della tabella
      const euro = document.createElement('span');
      const numPrev = document.createElement('span');
      const cliente = document.createElement('span');
      const totFatt = document.createElement('span');
      const opere = document.createElement('span');
      const operaz = document.createElement('span');
      const aggiornato = document.createElement('button');
      const modifica = document.createElement('button');
      const clona = document.createElement('button');
      const apri = document.createElement('button');
      const cancella = document.createElement('button');
      const icoAggiornato = document.createElement('span');
      const icoModifica = document.createElement('span');
      const icoClona = document.createElement('span');
      const icoApri = document.createElement('span');
      const icoEsporta = document.createElement('span');
      const icoCancella = document.createElement('span');
      const privato = document.createElement('i');
      const societa = document.createElement('i');
      privato.className = 'fa fa-user privato';
      privato.title = 'Privato';
      societa.className = 'fa fa-industry societa';
      societa.title = 'Società';

      numPrev.className = 'col-2 col-sm-2 col-md-2 col-lg-1 col-xl-1';
      cliente.className = 'col-3 col-sm-3 col-md-3 col-lg-4 col-xl-4';
      opere.className = 'col-3 col-sm-3 col-md-3 col-lg-4 col-xl-4';
      totFatt.className = 'col-2 col-sm-2 col-md-2 col-lg-1 col-xl-1 text-right';
      operaz.className = 'col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 text-right';
      aggiornato.className = 'btn btn-sm info';
      icoAggiornato.className = 'fa fa-refresh';
      modifica.className = 'btn btn-sm btn-outline-info';
      icoModifica.className = 'fa fa-pencil';
      clona.className = 'btn btn-sm btn-outline-success';
      icoClona.className = 'fa fa-clone';
      apri.className = 'btn btn-sm btn-outline-danger';
      icoApri.className = 'fa fa-file-pdf-o';
      icoEsporta.className = 'fa fa-download';
      cancella.className = 'btn btn-sm btn-outline-danger';
      icoCancella.className = 'fa fa-trash-o';

      cliente.setAttribute("style","white-space:nowrap;overflow:hidden");
      opere.setAttribute("style","white-space:nowrap;overflow:hidden");

      aggiornato.title = 'Ultimo preventivo modificato';
      modifica.title = 'Modifica preventivo';
      clona.title = 'Clona preventivo';
      apri.title = 'Apri PDF';
      cancella.title = 'Cancella preventivo';

      modifica.type = 'button';
      clona.type = 'button';
      apri.type = 'button';
      cancella.type = 'button';

      numPrev.id = 'numPrev' + (i+1);
      cliente.id = 'cliente' + (i+1);
      opere.id = 'opere' + (i+1);

      modifica.id = 'modifica' + (i+1);
      modifica.value = i+1;
      clona.id = 'clona' + (i+1);
      clona.value = i+1;
      apri.id = 'apri' + (i+1);
      apri.value = i+1;
      cancella.id = 'cancella' + (i+1);
      cancella.value = i+1;

      aggiornato.appendChild(icoAggiornato);
      modifica.appendChild(icoModifica);
      clona.appendChild(icoClona);
      apri.appendChild(icoApri);
      cancella.appendChild(icoCancella);

      numPrev.appendChild(document.createTextNode(preventivi[i].numPrev));
      if (preventivi[i].cliente === undefined) {
        cliente.appendChild(document.createTextNode('*** CLIENTE ASSENTE ***'));
      } else {
        if (preventivi[i].cliente.tipoCli == 'P') {
          cliente.appendChild(privato);
          cliente.appendChild(document.createTextNode(" " + preventivi[i].cliente.cognome + " " + preventivi[i].cliente.nome));
          cliente.title = preventivi[i].cliente.cognome + " " + preventivi[i].cliente.nome;
        } else {
          cliente.appendChild(societa);
          cliente.appendChild(document.createTextNode(" " + preventivi[i].cliente.ragSoc));
          cliente.title = preventivi[i].cliente.ragSoc;
        }
      }

      var opereLista = '';
      var primoGiro = true;

      for (var x = 0; x < preventivi[i].opere.length; x++){
        if (primoGiro) {
          opereLista = preventivi[i].opere[x].opera;
          primoGiro = false;
        } else {
          opereLista += ', ' + preventivi[i].opere[x].opera;
        }
      }

      opere.title = opereLista;
      opere.appendChild(document.createTextNode(opereLista));

      totFatt.appendChild(document.createTextNode(format.number_format(preventivi[i].totFatt.toString().replace('.',','), 2, ',', '.')));
      euro.appendChild(document.createTextNode(' €'));
      totFatt.appendChild(euro);

      if (!isNaN(prevUpd)) {
        if (prevUpd == preventivi[i].numPrev) {
          operaz.appendChild(aggiornato);
        }
      }
      operaz.appendChild(modifica);
      operaz.appendChild(apri);
      operaz.appendChild(clona);
      operaz.appendChild(cancella);

      div.appendChild(numPrev);
      div.appendChild(cliente);
      div.appendChild(opere);
      div.appendChild(totFatt);
      div.appendChild(operaz);

      tbody.appendChild(div);

      preventivoComodo[i] = preventivi[i];

      // aggiungo event listener
      $("#modifica" + (i+1)).click(function() {
        pulisciEsito();

        var indice = this.value;
        ipcRenderer.send('modificaPreventivo', preventivoComodo[indice-1]);
      });
      $("#clona" + (i+1)).click(function() {
        pulisciEsito();

        var indice = this.value;
        ipcRenderer.send('clonaPreventivo', preventivoComodo[indice-1]);
      });
      $("#apri" + (i+1)).click(function() {
        pulisciEsito();

        var indice = this.value;
        ipcRenderer.send('creaPdf', preventivoComodo[indice-1]);
      });
      $("#cancella" + (i+1)).click(function() {
        pulisciEsito();

        var indice = this.value;
        let prova = $('#numPrev' + indice);
        ipcRenderer.send('confermaCancPreventivo', 'Conferma cancellazione', "Confermi la cancellazione del preventivo?", 'Conferma', 'cancellaPreventivo', '', $('#numPrev' + indice).html(), $('#selAnno').val(), $('#selCli').val(), $('#selOpera').val());
      });
    }
  }
}

$('form').on('submit', function() {
  pulisciEsito();
  ipcRenderer.send('tab-lisPrev:aggiorna', $('#selAnno').val(), $('#selCli').val(), $('#selOpera').val());
});

$('#newPrev').on('click', function() {
  pulisciEsito();
  ipcRenderer.send('nuovoPreventivo');
});

// Premendo Ctrl+ si inserisce una nuova riga
function creaShortcut() {
  var isCtrl = false;$(document).keyup(function (e) {
    if(e.which == 17) isCtrl=false;
  }).keydown(function (e) {
    if(e.which == 17) isCtrl=true;
    if(e.which == 107 && isCtrl == true) {
      pulisciEsito();
      ipcRenderer.send('nuovoPreventivo');
      return false;
    }
  });
}

// Nascondo il messaggio
$('#esito').on('click', function() {
  pulisciEsito();
});

// nascondi messaggio
function pulisciEsito() {
  $('#esito').hide("slow");
}

// fine js
