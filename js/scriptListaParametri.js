const electron = require('electron');
const {ipcRenderer} = electron;
const tbody = document.querySelector('#tbody');
var stripe = true;
// var parametriComodo = new Array();

$('#esito').removeClass('esito-ok esito-ko');

// Popola tabella
ipcRenderer.on('tab-lisParm:carica', function(e, parametri){
  creaShortcut();
  
  caricaTabella(parametri);
});

// Popola tabella
ipcRenderer.on('tab-lisParm:aggiorna', function(e, parametri, parametro, descrizione){
  creaShortcut();
  
  $('#srchParm').val(parametro);
  $('#srchDesc').val(descrizione);
  
  if (parametro == '' && descrizione == '') {
    $('#filtro').removeClass('btn-warning');
    $('#filtro').addClass('btn-outline-warning');
    // $('#filtro').removeClass('btn-attivo');
  } else {
    $('#filtro').removeClass('btn-outline-warning');
    $('#filtro').addClass('btn-warning');
    // $('#filtro').addClass('btn-attivo');
  }
  
  caricaTabella(parametri);
});

$('form').on('submit', function() {
  ipcRenderer.send('tab-lisParm:aggiorna', $('#srchParm').val(), $('#srchDesc').val());
});

$('#newParm').on('click', function() {
  ipcRenderer.send('nuovoParametro');
});

function caricaTabella(parametri) {
  if (parametri.length > 0) {
    // cancello i dati dalla tabella
    while (tbody.firstChild) {
      tbody.removeChild(tbody.firstChild);
    }
    
    // carico i dati in tabella
    for (var i = 0; i < parametri.length; i++) {
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
      
      const id = document.createElement('span');
      const parametro = document.createElement('span');
      const desParm = document.createElement('span');
      const valore = document.createElement('span');
      const operaz = document.createElement('span');
      const modifica = document.createElement('button');
      const cancella = document.createElement('button');
      const icoModifica = document.createElement('span');
      const icoCancella = document.createElement('span');
      
      id.id = 'id' + (i+1);
      id.style.display = "none";
      
      parametro.className = 'col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2';
      parametro.id = 'parametro' + (i+1);
      desParm.className = 'col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6';
      desParm.id = 'desParm' + (i+1);
      valore.className = 'col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 text-center';
      valore.id = 'valore' + (i+1);
      operaz.className = 'col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 text-right';
      modifica.className = 'btn btn-sm btn-outline-info';
      modifica.id = 'modifica' + (i+1);
      modifica.value = i+1;
      modifica.title = 'Modifica parametro';
      modifica.type = 'button';
      icoModifica.className = 'fa fa-pencil';
      modifica.appendChild(icoModifica);
      cancella.className = 'btn btn-sm btn-outline-danger';
      cancella.id = 'cancella' + (i+1);
      cancella.value = i+1;
      cancella.title = 'Cancella parametro';
      cancella.type = 'button';
      icoCancella.className = 'fa fa-trash-o';
      cancella.appendChild(icoCancella);
      
      id.appendChild(document.createTextNode(parametri[i].id));
      parametro.appendChild(document.createTextNode(parametri[i].codice));
      desParm.appendChild(document.createTextNode(parametri[i].descrizione));
      valore.appendChild(document.createTextNode(parametri[i].valore));
      
      operaz.appendChild(modifica);
      operaz.appendChild(cancella);
      
      div.appendChild(id);
      div.appendChild(parametro);
      div.appendChild(desParm);
      div.appendChild(valore);
      div.appendChild(operaz);
      
      tbody.appendChild(div);
      
      // parametriComodo[i] = parametri[i];
      
      // aggiungo event listener
      $("#modifica" + (i+1)).on('click', function() {
        var indice = this.value;
        var parametro = {
          id: $("#id" + (indice)).html(),
          codice: $("#parametro" + (indice)).html(),
          descrizione: $("#desParm" + (indice)).html(),
          valore: $("#valore" + (indice)).html(),
        }
        ipcRenderer.send('modificaParametro', parametro);
      });
      $("#cancella" + (i+1)).on('click', function() {
        var indice = this.value;
        ipcRenderer.send('confermaCancParametro', 'Conferma cancellazione', "Confermi la cancellazione del parametro?", 'Conferma', 'cancellaParametro', '', $('#id' + indice).text(), $('#srchParm').val(), $('#srchDesc').val());
      });
    }
  }
}

ipcRenderer.on('esitoOpParametri', function(e, esito){
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
      ipcRenderer.send('nuovoParametro');
      return false;
    }
  });
}

// Nascondo il messaggio
$('#esito').on('click', function() {
  $('#esito').hide("slow");
});
// fine js