const electron = require('electron');
const {ipcRenderer} = electron;
const tbody = document.querySelector('#tbody');

$('#esito').removeClass('esito-ok esito-ko');

var stripe = true;
var clienteComodo = new Array();

// Popola tabella
ipcRenderer.on('tab-lisCli:carica', function(e, cliente){
  creaShortcut();
  
  caricaTabella(cliente);
});

ipcRenderer.on('tab-lisCli:aggiorna', function(e, cliente, tipo, id, descCli, cdFis){
  creaShortcut();
  
  $('#srchCod').val(id);
  $('#srchNome').val(descCli);
  $('#srchCdFis').val(cdFis);

  $('.btn-group > button').removeClass('btn-info btn-default');
  if (tipo == '') {
    $('#gcFiltAll').addClass('btn-info');
    $('#gcFiltPriv').addClass('btn-default');
    $('#gcFiltSoc').addClass('btn-default');
  } else if (tipo == 'P') {
    $('#gcFiltAll').addClass('btn-default');
    $('#gcFiltPriv').addClass('btn-info');
    $('#gcFiltSoc').addClass('btn-default');
  } else if (tipo == 'S') {
    $('#gcFiltAll').addClass('btn-default');
    $('#gcFiltPriv').addClass('btn-default');
    $('#gcFiltSoc').addClass('btn-info');
  }

  if (tipo == '' && id == '' && descCli == '' && cdFis == '') {
    $('#filtro').removeClass('btn-warning');
    $('#filtro').addClass('btn-outline-warning');
  } else {
    $('#filtro').removeClass('btn-outline-warning');
    $('#filtro').addClass('btn-warning');
  }

  caricaTabella(cliente);
});

function caricaTabella(cliente) {
  if (cliente.length > 0) {
    // cancello i dati dalla tabella
    while (tbody.firstChild) {
      tbody.removeChild(tbody.firstChild);
    }

    // carico i dati in tabella
    for (var i = 0; i < cliente.length; i++) {
      const div = document.createElement('div');
      if (stripe) {
        stripe = false;
        div.className = 'row tbody-gray';
      } else {
        stripe = true;
        div.className = 'row tbody';
      }

      // definisco parametri di comodo
      const privato = document.createElement('i');
      const societa = document.createElement('i');
      privato.className = 'fa fa-user privato';
      privato.title = 'Privato';
      societa.className = 'fa fa-industry societa';
      societa.title = 'Società';
      // definisco le colonne della tabella
      const id = document.createElement('span');
      const desCli = document.createElement('span');
      const cdFis = document.createElement('span');
      const tipoCli = document.createElement('span');
      const operaz = document.createElement('span');
      const modifica = document.createElement('button');
      const cancella = document.createElement('button');
      const icoModifica = document.createElement('span');
      const icoCancella = document.createElement('span');
      id.className = 'col-2 col-sm-2 col-md-2 col-lg-1 col-xl-1';
      id.id = 'id' + (i+1);
      desCli.className = 'col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6';
      desCli.id = 'desCli' + (i+1);
      cdFis.className = 'col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2';
      cdFis.id = 'cdFis' + (i+1);
      tipoCli.className = 'col-2 col-sm-2 col-md-2 col-lg-1 col-xl-1 text-center';
      tipoCli.id = 'tipoCli' + (i+1);
      operaz.className = 'col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 text-right';
      modifica.className = 'btn btn-sm btn-outline-info';
      modifica.id = 'modifica' + (i+1);
      modifica.value = i+1;
      modifica.title = 'Modifica cliente';
      modifica.type = 'button';
      icoModifica.className = 'fa fa-pencil';
      modifica.appendChild(icoModifica);
      cancella.className = 'btn btn-sm btn-outline-danger';
      cancella.id = 'cancella' + (i+1);
      cancella.value = i+1;
      cancella.title = 'Cancella cliente';
      cancella.type = 'button';
      icoCancella.className = 'fa fa-trash-o';
      cancella.appendChild(icoCancella);

      id.appendChild(document.createTextNode(cliente[i].id));
      if (cliente[i].tipoCli == 'P') {
        desCli.appendChild(document.createTextNode(cliente[i].cognome + " " + cliente[i].nome));
        tipoCli.appendChild(privato);
        cdFis.appendChild(document.createTextNode(cliente[i].cdFis));
      } else {
        desCli.appendChild(document.createTextNode(cliente[i].ragSoc));
        tipoCli.appendChild(societa);
        cdFis.appendChild(document.createTextNode(cliente[i].pIva));
      }

      operaz.appendChild(modifica);
      operaz.appendChild(cancella);

      div.appendChild(id);
      div.appendChild(desCli);
      div.appendChild(cdFis);
      div.appendChild(tipoCli);
      div.appendChild(operaz);

      tbody.appendChild(div);

      clienteComodo[i] = cliente[i];
      
      // aggiungo event listener
      $("#modifica" + (i+1)).on('click', function() {
        var indice = this.value;
        ipcRenderer.send('modificaCliente', clienteComodo[indice-1]);
      })
      $("#cancella" + (i+1)).on('click', function() {
        var indice = this.value;
        var tipo = '';
        if ($('#gcFiltAll').hasClass('btn-info')) {
          tipo = '';
        } else if ($('#gcFiltPriv').hasClass('btn-info')) {
          tipo = 'P';
        } else if ($('#gcFiltSoc').hasClass('btn-info')) {
          tipo = 'S';
        }
        ipcRenderer.send('confermaCancCli', 'Conferma cancellazione', "Confermi la cancellazione del cliente?", 'Conferma', 'cancellaCliente', '', $('#id' + indice).text(), tipo, $('#srchCod').val(), $('#srchNome').val(), $('#srchCdFis').val());
      })
    }
  }
}

ipcRenderer.on('esitoOpCli', function(e, esito){
  $('#esito').removeClass('esito-ok esito-ko');
  
  if (esito.esito == 'OK') {
    $('#esito').addClass('esito-ok');
  } else {
    $('#esito').addClass('esito-ko');
  }

  $('#descEsito').text(esito.descErr);
  $('#esito').show();
});

$('form').on('submit', function() {
  var tipo = '';
  if ($('#gcFiltAll').hasClass('btn-info')) {
    tipo = '';
  } else if ($('#gcFiltPriv').hasClass('btn-info')) {
    tipo = 'P';
  } else if ($('#gcFiltSoc').hasClass('btn-info')) {
    tipo = 'S';
  }

  ipcRenderer.send('tab-lisCli:aggiorna', tipo, $('#srchCod').val(), $('#srchNome').val(), $('#srchCdFis').val());
});

// Creazione nuovo cliente
$('#newCli').click(function() {
  ipcRenderer.send('nuovoCliente');
});

// Nascondo il messaggio
$('#esito').click(function() {
  pulisciEsito();
});

// Tutti i tipi
$('#gcFiltAll').click(function() {
  $('.btn-group > button').removeClass('btn-info btn-default');
  $('#gcFiltAll').addClass('btn-info');
  $('#gcFiltPriv').addClass('btn-default');
  $('#gcFiltSoc').addClass('btn-default');
});

// Privato
$('#gcFiltPriv').click(function() {
  $('.btn-group > button').removeClass('btn-info btn-default');
  $('#gcFiltAll').addClass('btn-default');
  $('#gcFiltPriv').addClass('btn-info');
  $('#gcFiltSoc').addClass('btn-default');
});

// Società
$('#gcFiltSoc').click(function() {
  $('.btn-group > button').removeClass('btn-info btn-default');
  $('#gcFiltAll').addClass('btn-default');
  $('#gcFiltPriv').addClass('btn-default');
  $('#gcFiltSoc').addClass('btn-info');
});


// Premendo Ctrl+ si inserisce una nuova riga
function creaShortcut() {
  var isCtrl = false;$(document).keyup(function (e) {
    if(e.which == 17) isCtrl=false;
  }).keydown(function (e) {
    if(e.which == 17) isCtrl=true;
    if(e.which == 107 && isCtrl == true) {
      pulisciEsito();
      ipcRenderer.send('nuovoCliente');
      return false;
    }
  });
}

// nascondi messaggio
function pulisciEsito() {
  $('#esito').hide("slow");
}

// fine js