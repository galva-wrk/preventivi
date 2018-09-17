const electron = require('electron');
const {ipcRenderer} = electron;
const format = require('../js/numberformat.js');
const tbody = document.querySelector('#tbody');

$('#esito').removeClass('esito-ok esito-ko');

var stripe = true;
var operaComodo = new Array();

// Popola tabella
ipcRenderer.on('tab-lisOpere:carica', function(e, Opere){
  creaShortcut();
  
  caricaTabella(Opere);
});

// Popola tabella
ipcRenderer.on('tab-lisOpere:aggiorna', function(e, Opere, descrizione){
  creaShortcut();
  
  $('#srchDesc').val(descrizione);

  if (descrizione == '') {
    $('#filtro').removeClass('btn-warning');
    $('#filtro').addClass('btn-outline-warning');
    // $('#filtro').removeClass('btn-attivo');
  } else {
    $('#filtro').removeClass('btn-outline-warning');
    $('#filtro').addClass('btn-warning');
    // $('#filtro').addClass('btn-attivo');
  }

  caricaTabella(Opere);
});

$('form').on('submit', function() {
  ipcRenderer.send('tab-lisOpere:aggiorna', $('#srchDesc').val());
});

$('#newOpera').on('click', function() {
  ipcRenderer.send('nuovaOpera');
});

function caricaTabella(Opere) {
  if (Opere.length > 0) {
    // cancello i dati dalla tabella
    while (tbody.firstChild) {
      tbody.removeChild(tbody.firstChild);
    }

    // carico i dati in tabella
    for (var i = 0; i < Opere.length; i++) {
      const div = document.createElement('div');
      if (stripe) {
        stripe = false;
        div.className = 'row tbody-gray';
      } else {
        stripe = true;
        div.className = 'row tbody';
      }

      // definisco le colonne della tabella
      const attivo = document.createElement('i');
      const disattivo = document.createElement('i');
      attivo.className = 'fa fa-toggle-on';
      attivo.title = 'Attivo';
      disattivo.className = 'fa fa-toggle-off';
      disattivo.title = 'Disattivo';

      const codOpera = document.createElement('span');
      const desBreve = document.createElement('span');
      const desOpera = document.createElement('span');
      const importo = document.createElement('span');
      const operaz = document.createElement('span');
      const modifica = document.createElement('button');
      const cancella = document.createElement('button');
      const icoModifica = document.createElement('span');
      const icoCancella = document.createElement('span');
      codOpera.className = 'col-1 col-sm-1 col-md-1 col-lg-1 col-xl-1';
      codOpera.id = 'codOpera' + (i+1);
      desBreve.className = 'col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2';
      desBreve.id = 'desBreve' + (i+1);
      desBreve.title = Opere[i].opera;
      desBreve.setAttribute("style","white-space:nowrap;overflow:hidden");
      desOpera.className = 'col-5 col-sm-5 col-md-5 col-lg-5 col-xl-6';
      desOpera.id = 'desOpera' + (i+1);
      desOpera.title = Opere[i].descrizioni[0].descrizione;
      desOpera.setAttribute("style","white-space:nowrap;overflow:hidden");
      importo.className = 'col-2 col-sm-2 col-md-2 col-lg-2 col-xl-1 text-right';
      importo.id = 'importo' + (i+1);
      operaz.className = 'col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 text-right';
      modifica.className = 'btn btn-sm btn-outline-info';
      modifica.id = 'modifica' + (i+1);
      modifica.value = i+1;
      modifica.title = 'Modifica opera';
      modifica.type = 'button';
      icoModifica.className = 'fa fa-pencil';
      modifica.appendChild(icoModifica);
      cancella.className = 'btn btn-sm btn-outline-danger';
      cancella.id = 'cancella' + (i+1);
      cancella.value = i+1;
      cancella.title = 'Cancella opera';
      cancella.type = 'button';
      icoCancella.className = 'fa fa-trash-o';
      cancella.appendChild(icoCancella);

      codOpera.appendChild(document.createTextNode(Opere[i].id));
      desBreve.appendChild(document.createTextNode(Opere[i].opera));
      desOpera.appendChild(document.createTextNode(Opere[i].descrizioni[0].descrizione));
      importo.appendChild(document.createTextNode(format.number_format(Opere[i].importo.toString().replace('.',','), 2, ',', '.')));
      importo.appendChild(document.createTextNode(' €'));

      operaz.appendChild(modifica);
      operaz.appendChild(cancella);

      div.appendChild(codOpera);
      div.appendChild(desBreve);
      div.appendChild(desOpera);
      div.appendChild(importo);
      div.appendChild(operaz);

      tbody.appendChild(div);

      operaComodo[i] = Opere[i];

      // aggiungo event listener
      $("#modifica" + (i+1)).on('click', function() {
        var indice = this.value;
        ipcRenderer.send('modificaOpera', operaComodo[indice-1]);
      });
      $("#cancella" + (i+1)).on('click', function() {
        var indice = this.value;
        ipcRenderer.send('confermaCancOpera', 'Conferma cancellazione', "Confermi la cancellazione dell'opera?", 'Conferma', 'cancellaOpera', '', $('#codOpera' + indice).text(), $('#srchDesc').val());
      });
    }
  }
}

ipcRenderer.on('esitoOpOpere', function(e, esito){
  $('#esito').removeClass('esito-ok esito-ko');
  
  if (esito.esito == 'OK') {
    $('#esito').addClass('esito-ok');
  } else {
    $('#esito').addClass('esito-ko');
  }

  $('#descEsito').text(esito.descErr);
  $('#esito').show();
});

// Premendo Ctrl+ si inserisce una nuova riga
function creaShortcut() {
  var isCtrl = false;$(document).keyup(function (e) {
    if(e.which == 17) isCtrl=false;
  }).keydown(function (e) {
    if(e.which == 17) isCtrl=true;
    if(e.which == 107 && isCtrl == true) {
      pulisciEsito();
      ipcRenderer.send('nuovaOpera');
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
