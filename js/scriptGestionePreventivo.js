const electron = require('electron');
const {ipcRenderer} = electron;
const date = require('date-and-time');
const format = require('../js/numberformat.js');
// const format2 = require('../js/numberformat2.js');
const formCli = document.querySelector('#formparm');
const tbodyI = document.querySelector('#tbodyI');
const tbodyM = document.querySelector('#tbodyM');
const cliTbody = document.querySelector('#cliTbody');
const operaTbody = document.querySelector('#operaTbody');

let currentDate = new Date();
let ix = 0;
var stripe = true;
var clienteComodo = new Array();
var operaComodo = new Array();
var operePrev = new Array();
var prevOld;
var anno;
var numero;
var id;
var clienteId;
var cassaGeom;
var iva;
var ritAcc;
var parmCassaGeom;
var parmIva;
var parmRitAcc;
var dataIns;

let inserimento = true;
let aggiorna = false;

var siRitenuta = true;

$('#esito').removeClass('esito-ok esito-ko');

// Inserimento nuovo preventivo
ipcRenderer.on('nuovoPreventivo', function(e, preventivo){
  creaShortcut();
  
  $('#nuovoPrev').show();
  $('#modificaPrev').hide();

  anno = preventivo.anno;
  numero = preventivo.numero;
  id = preventivo.progr;

  $('#idI').html(preventivo.progr);
  $('#dataInsI').html(date.format(currentDate, 'DD/MM/YYYY'));
  $('.cassaGeom').html(cassaGeom);
  $('.iva').html(iva);
  $('.ritAcc').html(ritAcc);

  $('#clienteI').val('');
  $('#desCliI').val('');
  $('#daFattI').html(format.number_format(0, 2, ',', '.'));
  $('#cassaGeomI').html(format.number_format(0, 2, ',', '.'));
  $('#totImpI').html(format.number_format(0, 2, ',', '.'));
  $('#ivaI').html(format.number_format(0, 2, ',', '.'));
  $('#art15I').val(format.number_format(0, 2, ',', '.'));
  $('#totFattI').html(format.number_format(0, 2, ',', '.'));
  $('#ritAccI').html(format.number_format(0, 2, ',', '.'));
  $('#daCorrI').html(format.number_format(0, 2, ',', '.'));
});

// Popola tabella
ipcRenderer.on('clonaPreventivo', function(e, preventivo, numPrev){
  creaShortcut();
  
  // Setto modifica come operazione
  inserimento = true;

  var stripe = true;
  let imp = 0;

  $('#nuovoPrev').show();
  $('#modificaPrev').hide();

  anno = numPrev.anno;
  numero = numPrev.numero;
  id = numPrev.progr;
  preventivo.progr = numPrev.progr;
  preventivo.anno = numPrev.anno;
  preventivo.numero = numPrev.numero;

  $('#idI').html(numPrev.progr);
  $('#dataInsI').html(date.format(currentDate, 'DD/MM/YYYY'));
  $('.cassaGeom').html(cassaGeom);
  $('.iva').html(iva);
  $('.ritAcc').html(ritAcc);

  $('#clienteI').val(preventivo.codCli);
  $('#desCliI').val(preventivo.cliente);
  $('#daFattI').html(format.number_format(0, 2, ',', '.'));
  $('#cassaGeomI').html(format.number_format(0, 2, ',', '.'));
  $('#totImpI').html(format.number_format(0, 2, ',', '.'));
  $('#ivaI').html(format.number_format(0, 2, ',', '.'));
  $('#art15I').val(format.number_format(0, 2, ',', '.'));
  $('#totFattI').html(format.number_format(0, 2, ',', '.'));
  $('#ritAccI').html(format.number_format(0, 2, ',', '.'));
  $('#daCorrI').html(format.number_format(0, 2, ',', '.'));

  if (preventivo.swRitenuta == 'N') {
    setRitenuta('NO', 'ins', false);
  }
  $('#operaI').html(document.createTextNode(preventivo.cliente.id));
  $('#operaM').html(document.createTextNode(preventivo.cliente.id));

  $('#tipoCliI, #tipoCliM').removeClass();

  if (preventivo.cliente.tipoCli == 'P') {
    $('#tipoCliI, #tipoCliM').addClass('privato fa fa-user col-lg-1 text-right');
    $('#tipoCliI, #tipoCliM').attr('Title','Privato');
    $('#desNomeI').html(document.createTextNode(preventivo.cliente.id + " - " + preventivo.cliente.cognome.trim() + " " + preventivo.cliente.nome.trim()));
    $('#desCFI').html(document.createTextNode("C.F. " + preventivo.cliente.cdFis.trim()));
    $('#desIndirI').html(document.createTextNode(preventivo.cliente.indirizzo.trim() + ", n° " + preventivo.cliente.numCiv.trim() + " - " + preventivo.cliente.cap));
    $('#desComuneI').html(document.createTextNode(preventivo.cliente.comune.trim() + " (" + preventivo.cliente.provincia + ")"));

    $('#desNomeM').html(document.createTextNode(preventivo.cliente.id + " - " + preventivo.cliente.cognome.trim() + " " + preventivo.cliente.nome.trim()));
    $('#desCFM').html(document.createTextNode("C.F. " + preventivo.cliente.cdFis.trim()));
    $('#desIndirM').html(document.createTextNode(preventivo.cliente.indirizzo.trim() + ", n° " + preventivo.cliente.numCiv.trim() + " - " + preventivo.cliente.cap));
    $('#desComuneM').html(document.createTextNode(preventivo.cliente.comune.trim() + " (" + preventivo.cliente.provincia + ")"));
  } else {
    $('#tipoCliI, #tipoCliM').addClass('societa fa fa-industry col-lg-1 text-right');
    $('#tipoCliI, #tipoCliM').attr('Title','Società');
    $('#desNomeI').html(document.createTextNode(preventivo.cliente.id + " - " + preventivo.cliente.ragSoc.trim()));
    $('#desCFI').html(document.createTextNode("P.IVA " + preventivo.cliente.pIva));
    $('#desIndirI').html(document.createTextNode(preventivo.cliente.indirizzo.trim() + ", n° " + preventivo.cliente.numCiv.trim() + " - " + preventivo.cliente.cap));
    $('#desComuneI').html(document.createTextNode(preventivo.cliente.comune.trim() + " (" + preventivo.cliente.provincia + ")"));

    $('#desNomeM').html(document.createTextNode(preventivo.cliente.id + " - " + preventivo.cliente.ragSoc.trim()));
    $('#desCFM').html(document.createTextNode("P.IVA " + preventivo.cliente.pIva));
    $('#desIndirM').html(document.createTextNode(preventivo.cliente.indirizzo.trim() + ", n° " + preventivo.cliente.numCiv.trim() + " - " + preventivo.cliente.cap));
    $('#desComuneM').html(document.createTextNode(preventivo.cliente.comune.trim() + " (" + preventivo.cliente.provincia + ")"));
  }

  for (var i = 0; i < preventivo.opere.length; i++) {
    const div = document.createElement('div');
    div.className = 'row';
    div.id = 'prevOpera' + (i+1);
    div.value = i+1;

    const row = document.createElement('span');
    if (stripe) {
      stripe = false;
      row.className = 'row tbody-gray col-10 col-sm-10 col-md-10 col-lg-10 col-xl-10';
    } else {
      stripe = true;
      row.className = 'row tbody col-10 col-sm-10 col-md-10 col-lg-10 col-xl-10';
    }

    // definisco le colonne della tabella
    const euro = document.createElement('span');
    const spacer = document.createElement('span');
    const codOpera = document.createElement('span');
    const descBreveOpera = document.createElement('span');
    const descOpera = document.createElement('p');
    const operaz = document.createElement('span');
    const importo = document.createElement('input');

    const modifica = document.createElement('button');
    const elimina = document.createElement('button');
    const icoModifica = document.createElement('span');
    const icoElimina = document.createElement('span');

    spacer.className = 'col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2';
    codOpera.className = 'col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2';
    descBreveOpera.className = 'col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6';
    descOpera.className = 'descOpera';
    operaz.className = 'col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 text-right';
    importo.className = 'col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 text-right form-control';
    modifica.className = 'btn btn-sm btn-outline-info';
    icoModifica.className = 'fa fa-pencil';
    elimina.className = 'btn btn-sm btn-outline-danger';
    icoElimina.className = 'fa fa-trash';

    modifica.title = 'Modifica';
    elimina.title = 'Elimina';

    modifica.type = 'button';
    elimina.type = 'button';

    importo.id = 'importo' + (i+1);
    codOpera.id = 'codOpera' + (i+1);
    descBreveOpera.id = 'descBreveOpera' + (i+1);
    descOpera.id = 'descOpera' + (i+1);

    modifica.id = 'modifica' + (i+1);
    modifica.value = i+1;
    elimina.id = 'elimina' + (i+1);
    elimina.value = i+1;

    descOpera.style.display = "none";

    modifica.appendChild(icoModifica);
    elimina.appendChild(icoElimina);

    codOpera.appendChild(document.createTextNode(preventivo.opere[i].id));
    descBreveOpera.appendChild(document.createTextNode(preventivo.opere[i].opera));
    
    for (var y = 0; y < preventivo.opere[i].descrizioni.length; y++) {
      const descrizione = document.createElement('p');
      descrizione.className = 'noSpace';
      descrizione.appendChild(document.createTextNode(preventivo.opere[i].descrizioni[y].descrizione));
      descOpera.appendChild(descrizione);
    };
    importo.value = format.number_format(preventivo.opere[i].importo.toString().replace('.',','), 2, ',', '.');

    operaz.appendChild(modifica);
    operaz.appendChild(elimina);

    descBreveOpera.appendChild(descOpera);

    row.appendChild(codOpera);
    row.appendChild(descBreveOpera);
    row.appendChild(operaz);
    row.appendChild(importo);

    div.appendChild(spacer);
    div.appendChild(row);

    if (inserimento) {
      tbodyI.appendChild(div);
    } else {
      tbodyM.appendChild(div);
    }

    operePrev[i] = preventivo.opere[i];

    ix = i+1;

    $('#importo' + (i+1)).focusout(function() {
      if (isNaN(format.number_format($('#' + this.id).val(), 2, '.', ''))) {
        $('#' + this.id).val(format.number_format(0, 2, ',', '.'));
      } else {
        $('#' + this.id).val(format.number_format($('#' + this.id).val(), 2, ',', '.'))
      }
      calcolaImp();
      checkAggio();
      AggOpereDB();
    });
    $('#modifica' + (i+1)).click(function() {
      modificaOpera(this.value);
    });
    $('#elimina' + (i+1)).click(function() {
      eliminaOpera(this.value);
      checkAggio();
    });
  }

  calcolaImp();
});

// Popola tabella
ipcRenderer.on('modificaPreventivo', function(e, preventivo){
  creaShortcut();
  
  // Setto modifica come operazione
  inserimento = false;

  // Salvo preventivo
  prevOld = preventivo;

  // Disabilito i tasti di salvataggio
  $('#saveM').hide();
  $('#pdfM').attr("title","Crea PDF");

  var stripe = true;
  let imp = 0;

  $('#nuovoPrev').hide();
  $('#modificaPrev').show();
  $('.cassaGeom').html(preventivo.cassaGeomPerc);
  $('.iva').html(preventivo.ivaPerc);
  $('.ritAcc').html(preventivo.ritenutaPerc);
  cassaGeom = preventivo.cassaGeomPerc;
  iva = preventivo.ivaPerc;
  ritAcc = preventivo.ritenutaPerc;

  checkPerce();

  anno = preventivo.anno;
  numero = preventivo.numero;
  id = preventivo.numPrev;
  dataIns = preventivo.dataIns;
  clienteId = preventivo.codCli;

  $('#idM').html(preventivo.numPrev);
  $('#dataInsM').html(preventivo.dataIns);
  $('#dataModsM').html(preventivo.dataMod);
  $('#clienteM').val(preventivo.codCli);
  $('#desCliM').val(preventivo.cliente);
  // $('#daFattM').html(format2.number_format2(preventivo.daFatt, 2, ',', '.', '.', ','));
  $('#daFattM').html(format.number_format(preventivo.daFatt.toString().replace('.',','), 2, ',', '.'));
  $('#cassaGeomM').html(format.number_format(preventivo.cassaGeom.toString().replace('.',','), 2, ',', '.'));
  $('#totImpM').html(format.number_format(preventivo.impon.toString().replace('.',','), 2, ',', '.'));
  $('#ivaM').html(format.number_format(preventivo.iva.toString().replace('.',','), 2, ',', '.'));
  $('#art15M').val(format.number_format(preventivo.art15.toString().replace('.',','), 2, ',', '.'));
  $('#totFattM').html(format.number_format(preventivo.totFatt.toString().replace('.',','), 2, ',', '.'));
  $('#ritAccM').html(format.number_format(preventivo.ritenuta.toString().replace('.',','), 2, ',', '.'));
  $('#daCorrM').html(format.number_format(preventivo.impDaCorr.toString().replace('.',','), 2, ',', '.'));

  if (preventivo.swRitenuta == 'N') {
    setRitenuta('NO', 'mod', false);
  }
  $('#operaI').html(document.createTextNode(preventivo.cliente.id));
  $('#operaM').html(document.createTextNode(preventivo.cliente.id));

  $('#tipoCliI, #tipoCliM').removeClass();

  if (preventivo.cliente.tipoCli == 'P') {
    $('#tipoCliI, #tipoCliM').addClass('privato fa fa-user col-lg-1 text-right');
    $('#tipoCliI, #tipoCliM').attr('Title','Privato');
    $('#desNomeI').html(document.createTextNode(preventivo.cliente.id + " - " + preventivo.cliente.cognome.trim() + " " + preventivo.cliente.nome.trim()));
    $('#desCFI').html(document.createTextNode("C.F. " + preventivo.cliente.cdFis.trim()));
    $('#desIndirI').html(document.createTextNode(preventivo.cliente.indirizzo.trim() + ", n° " + preventivo.cliente.numCiv.trim() + " - " + preventivo.cliente.cap));
    $('#desComuneI').html(document.createTextNode(preventivo.cliente.comune.trim() + " (" + preventivo.cliente.provincia + ")"));

    $('#desNomeM').html(document.createTextNode(preventivo.cliente.id + " - " + preventivo.cliente.cognome.trim() + " " + preventivo.cliente.nome.trim()));
    $('#desCFM').html(document.createTextNode("C.F. " + preventivo.cliente.cdFis.trim()));
    $('#desIndirM').html(document.createTextNode(preventivo.cliente.indirizzo.trim() + ", n° " + preventivo.cliente.numCiv.trim() + " - " + preventivo.cliente.cap));
    $('#desComuneM').html(document.createTextNode(preventivo.cliente.comune.trim() + " (" + preventivo.cliente.provincia + ")"));
  } else {
    $('#tipoCliI, #tipoCliM').addClass('societa fa fa-industry col-lg-1 text-right');
    $('#tipoCliI, #tipoCliM').attr('Title','Società');
    $('#desNomeI').html(document.createTextNode(preventivo.cliente.id + " - " + preventivo.cliente.ragSoc.trim()));
    $('#desCFI').html(document.createTextNode("P.IVA " + preventivo.cliente.pIva));
    $('#desIndirI').html(document.createTextNode(preventivo.cliente.indirizzo.trim() + ", n° " + preventivo.cliente.numCiv.trim() + " - " + preventivo.cliente.cap));
    $('#desComuneI').html(document.createTextNode(preventivo.cliente.comune.trim() + " (" + preventivo.cliente.provincia + ")"));

    $('#desNomeM').html(document.createTextNode(preventivo.cliente.id + " - " + preventivo.cliente.ragSoc.trim()));
    $('#desCFM').html(document.createTextNode("P.IVA " + preventivo.cliente.pIva));
    $('#desIndirM').html(document.createTextNode(preventivo.cliente.indirizzo.trim() + ", n° " + preventivo.cliente.numCiv.trim() + " - " + preventivo.cliente.cap));
    $('#desComuneM').html(document.createTextNode(preventivo.cliente.comune.trim() + " (" + preventivo.cliente.provincia + ")"));
  }

  for (var i = 0; i < preventivo.opere.length; i++) {
    const div = document.createElement('div');
    div.className = 'row';
    div.id = 'prevOpera' + (i+1);
    div.value = i+1;

    const row = document.createElement('span');
    if (stripe) {
      stripe = false;
      row.className = 'row tbody-gray col-10 col-sm-10 col-md-10 col-lg-10 col-xl-10';
    } else {
      stripe = true;
      row.className = 'row tbody col-10 col-sm-10 col-md-10 col-lg-10 col-xl-10';
    }

    // definisco le colonne della tabella
    const euro = document.createElement('span');
    const spacer = document.createElement('span');
    const codOpera = document.createElement('span');
    const descBreveOpera = document.createElement('span');
    const descOpera = document.createElement('p');
    const operaz = document.createElement('span');
    const importo = document.createElement('input');

    const modifica = document.createElement('button');
    const elimina = document.createElement('button');
    const icoModifica = document.createElement('span');
    const icoElimina = document.createElement('span');

    spacer.className = 'col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2';
    codOpera.className = 'col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2';
    descBreveOpera.className = 'col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6';
    descOpera.className = 'descOpera';
    operaz.className = 'col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 text-right';
    importo.className = 'col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 text-right form-control';
    modifica.className = 'btn btn-sm btn-outline-info';
    icoModifica.className = 'fa fa-pencil';
    elimina.className = 'btn btn-sm btn-outline-danger';
    icoElimina.className = 'fa fa-trash';

    modifica.title = 'Modifica';
    elimina.title = 'Elimina';

    modifica.type = 'button';
    elimina.type = 'button';

    importo.id = 'importo' + (i+1);
    codOpera.id = 'codOpera' + (i+1);
    descBreveOpera.id = 'descBreveOpera' + (i+1);
    descOpera.id = 'descOpera' + (i+1);

    modifica.id = 'modifica' + (i+1);
    modifica.value = i+1;
    elimina.id = 'elimina' + (i+1);
    elimina.value = i+1;

    descOpera.style.display = "none";

    modifica.appendChild(icoModifica);
    elimina.appendChild(icoElimina);

    codOpera.appendChild(document.createTextNode(preventivo.opere[i].id));
    descBreveOpera.appendChild(document.createTextNode(preventivo.opere[i].opera));
    
    for (var y = 0; y < preventivo.opere[i].descrizioni.length; y++) {
      const descrizione = document.createElement('p');
      descrizione.className = 'noSpace';
      descrizione.appendChild(document.createTextNode(preventivo.opere[i].descrizioni[y].descrizione));
      descOpera.appendChild(descrizione);
    };
    importo.value = format.number_format(preventivo.opere[i].importo.toString().replace('.',','), 2, ',', '.');

    operaz.appendChild(modifica);
    operaz.appendChild(elimina);

    descBreveOpera.appendChild(descOpera);

    row.appendChild(codOpera);
    row.appendChild(descBreveOpera);
    row.appendChild(operaz);
    row.appendChild(importo);

    div.appendChild(spacer);
    div.appendChild(row);

    if (inserimento) {
      tbodyI.appendChild(div);
    } else {
      tbodyM.appendChild(div);
    }

    operePrev[i] = preventivo.opere[i];

    ix = i+1;

    $('#importo' + (i+1)).focusout(function() {
      if (isNaN(format.number_format($('#' + this.id).val(), 2, '.', ''))) {
        $('#' + this.id).val(format.number_format(0, 2, ',', '.'));
      } else {
        $('#' + this.id).val(format.number_format($('#' + this.id).val(), 2, ',', '.'))
      }
      calcolaImp();
      checkAggio();
      AggOpereDB();
    });
    $('#modifica' + (i+1)).click(function() {
      modificaOpera(this.value);
    });
    $('#elimina' + (i+1)).click(function() {
      eliminaOpera(this.value);
      checkAggio();
    });
  }
});

// Caricamento clienti
ipcRenderer.on('prv:listaCli', function(e, cliente){
  if (cliente.length > 0) {
    // cancello i dati dalla tabella
    while (cliTbody.firstChild) {
      cliTbody.removeChild(cliTbody.firstChild);
    }

    // carico i dati in tabella
    for (var i = 0; i < cliente.length; i++) {
      const div = document.createElement('div');
      div.id = 'cliRow' + (i+1);
      div.value = i;
      if (stripe) {
        stripe = false;
        div.className = 'row rowSel cliRow tbody-gray';
      } else {
        stripe = true;
        div.className = 'row rowSel cliRow tbody';
      }

      // definisco le colonne della tabella
      const id = document.createElement('span');
      const desCli = document.createElement('span');
      const cdFis = document.createElement('span');
      const privato = document.createElement('i');
      const societa = document.createElement('i');
      privato.className = 'fa fa-user privato';
      privato.title = 'Privato';
      societa.className = 'fa fa-industry societa';
      societa.title = 'Società';

      id.className = 'col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2';
      id.id = 'id' + (i+1);
      desCli.className = 'desCli col-7 col-sm-7 col-md-7 col-lg-7 col-xl-7';
      desCli.id = 'desCli' + (i+1);
      cdFis.className = 'col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3';
      cdFis.id = 'cdFis' + (i+1);

      desCli.setAttribute("style","white-space:nowrap;overflow:hidden");

      id.appendChild(document.createTextNode(cliente[i].id));
      if (cliente[i].tipoCli == 'P') {
        desCli.title = cliente[i].cognome + " " + cliente[i].nome;
        desCli.appendChild(privato);
        desCli.appendChild(document.createTextNode(" " + cliente[i].cognome + " " + cliente[i].nome));
        cdFis.appendChild(document.createTextNode(cliente[i].cdFis));
      } else {
        desCli.title = cliente[i].ragSoc;
        desCli.appendChild(societa);
        desCli.appendChild(document.createTextNode(" " + cliente[i].ragSoc));
        cdFis.appendChild(document.createTextNode(cliente[i].pIva));
      }

      div.appendChild(id);
      div.appendChild(desCli);
      div.appendChild(cdFis);

      cliTbody.appendChild(div);

      clienteComodo[i] = cliente[i];
      // aggiungo event listener

      $("#cliRow" + (i+1)).click(function() {
        pulisciErr();
        var indice = this.value;
        // ipcRenderer.send('prv:sel-cliente', clienteComodo[indice-1]);
        $('#modalCliente').modal("toggle");

        $('#clienteI').html('');
        $('#desNomeI').html('');
        $('#desCFI').html('');
        $('#desIndirI').html('');
        $('#desComuneI').html('');
        $('#clienteM').html('');
        $('#desNomeM').html('');
        $('#desCFM').html('');
        $('#desIndirM').html('');
        $('#desComuneM').html('');

        clienteId = cliente[indice].id;

        $('#clienteI').html(document.createTextNode(cliente[indice].id));
        $('#clienteM').html(document.createTextNode(cliente[indice].id));

        $('#tipoCliI, #tipoCliM').removeClass();

        if (cliente[indice].tipoCli == 'P') {
          $('#tipoCliI, #tipoCliM').addClass('privato fa fa-user col-lg-1 text-right');
          $('#tipoCliI, #tipoCliM').attr('Title','Privato');
          $('#desNomeI').html(document.createTextNode(cliente[indice].id + " - " + cliente[indice].cognome.trim() + " " + cliente[indice].nome.trim()));
          $('#desCFI').html(document.createTextNode("C.F. " + cliente[indice].cdFis.trim()));
          $('#desIndirI').html(document.createTextNode(cliente[indice].indirizzo.trim() + ", n° " + cliente[indice].numCiv.trim() + " - " + cliente[indice].cap));
          $('#desComuneI').html(document.createTextNode(cliente[indice].comune.trim() + " (" + cliente[indice].provincia + ")"));

          $('#desNomeM').html(document.createTextNode(cliente[indice].id + " - " + cliente[indice].cognome.trim() + " " + cliente[indice].nome.trim()));
          $('#desCFM').html(document.createTextNode("C.F. " + cliente[indice].cdFis.trim()));
          $('#desIndirM').html(document.createTextNode(cliente[indice].indirizzo.trim() + ", n° " + cliente[indice].numCiv.trim() + " - " + cliente[indice].cap));
          $('#desComuneM').html(document.createTextNode(cliente[indice].comune.trim() + " (" + cliente[indice].provincia + ")"));
          setRitenuta('NO', (inserimento ? 'ins' : 'mod'), true);
        } else {
          $('#tipoCliI, #tipoCliM').addClass('societa fa fa-industry col-lg-1 text-right');
          $('#tipoCliI, #tipoCliM').attr('Title','Società');
          $('#desNomeI').html(document.createTextNode(cliente[indice].id + " - " + cliente[indice].ragSoc.trim()));
          $('#desCFI').html(document.createTextNode("P.IVA " + cliente[indice].pIva));
          $('#desIndirI').html(document.createTextNode(cliente[indice].indirizzo.trim() + ", n° " + cliente[indice].numCiv.trim() + " - " + cliente[indice].cap));
          $('#desComuneI').html(document.createTextNode(cliente[indice].comune.trim() + " (" + cliente[indice].provincia + ")"));

          $('#desNomeM').html(document.createTextNode(cliente[indice].id + " - " + cliente[indice].ragSoc.trim()));
          $('#desCFM').html(document.createTextNode("P.IVA " + cliente[indice].pIva));
          $('#desIndirM').html(document.createTextNode(cliente[indice].indirizzo.trim() + ", n° " + cliente[indice].numCiv.trim() + " - " + cliente[indice].cap));
          $('#desComuneM').html(document.createTextNode(cliente[indice].comune.trim() + " (" + cliente[indice].provincia + ")"));
          setRitenuta('SI', (inserimento ? 'ins' : 'mod'), true);
        }
      });
    }
  }
});

// Caricamento opere
ipcRenderer.on('prv:listaOpere', function(e, opera){
  if (opera.length > 0) {
    // cancello i dati dalla tabella
    while (operaTbody.firstChild) {
      operaTbody.removeChild(operaTbody.firstChild);
    }

    // carico i dati in tabella
    for (var i = 0; i < opera.length; i++) {
      const div = document.createElement('div');
      div.id = 'operaRow' + (i+1);
      div.value = i;
      if (stripe) {
        stripe = false;
        div.className = 'row rowSel tbody-gray';
      } else {
        stripe = true;
        div.className = 'row rowSel tbody';
      }

      // definisco le colonne della tabella
      const id = document.createElement('span');
      const desOpera = document.createElement('span');
      id.className = 'col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2';
      id.id = 'id' + (i+1);
      desOpera.className = 'desOpera col-10 col-sm-10 col-md-10 col-lg-10 col-xl-10';
      desOpera.setAttribute("style","white-space:nowrap;overflow:hidden");
      desOpera.id = 'desOpera' + (i+1);
      desOpera.title = opera[i].descrizione;

      id.appendChild(document.createTextNode(opera[i].id));
      desOpera.appendChild(document.createTextNode(opera[i].opera));

      div.appendChild(id);
      div.appendChild(desOpera);

      operaTbody.appendChild(div);

      operaComodo[i] = opera[i];
      // aggiungo event listener

      $("#operaRow" + (i+1)).click(function() {
        var indice = this.value;
        $('#modalOpera').modal("toggle");
        ipcRenderer.send('selezionaOpera', operaComodo[indice]);
      });
    }
  }
});

// Caricamento opera
ipcRenderer.on('caricaOpera', function(e, opera){
  ix++;
  const div = document.createElement('div');
  div.className = 'row';
  div.id = 'prevOpera' + (ix);

  const row = document.createElement('span');
  if (stripe) {
    stripe = false;
    row.className = 'row tbody-gray col-10 col-sm-10 col-md-10 col-lg-10 col-xl-10';
  } else {
    stripe = true;
    row.className = 'row tbody col-10 col-sm-10 col-md-10 col-lg-10 col-xl-10';
  }

  // definisco le colonne della tabella
  const euro = document.createElement('span');
  const spacer = document.createElement('span');
  const codOpera = document.createElement('span');
  const descBreveOpera = document.createElement('span');
  const descOpera = document.createElement('p');
  const operaz = document.createElement('span');
  const importo = document.createElement('input');

  const modifica = document.createElement('button');
  const elimina = document.createElement('button');
  const icoModifica = document.createElement('span');
  const icoElimina = document.createElement('span');

  spacer.className = 'col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2';
  codOpera.className = 'col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2';
  descBreveOpera.className = 'col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6';
  descOpera.className = 'descOpera';
  operaz.className = 'col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 text-right';
  importo.className = 'col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 text-right form-control';
  modifica.className = 'btn btn-sm btn-outline-info';
  icoModifica.className = 'fa fa-pencil';
  elimina.className = 'btn btn-sm btn-outline-danger';
  icoElimina.className = 'fa fa-trash';

  modifica.title = 'Modifica';
  elimina.title = 'Elimina';

  modifica.type = 'button';
  elimina.type = 'button';

  importo.id = 'importo' + (ix);
  codOpera.id = 'codOpera' + (ix);
  descBreveOpera.id = 'descBreveOpera' + (ix);
  descOpera.id = 'descOpera' + (ix);

  modifica.id = 'modifica' + (ix);
  modifica.value = ix;
  elimina.id = 'elimina' + (ix);
  elimina.value = ix;

  descOpera.style.display = "none";

  modifica.appendChild(icoModifica);
  elimina.appendChild(icoElimina);

  codOpera.appendChild(document.createTextNode(opera.id));
  descBreveOpera.appendChild(document.createTextNode(opera.opera));
  
  for (var i = 0; i < opera.descrizioni.length; i++) {
    const descrizione = document.createElement('p');
    descrizione.className = 'noSpace';
    descrizione.appendChild(document.createTextNode(opera.descrizioni[i].descrizione));
    descOpera.appendChild(descrizione);
  };
  importo.value = format.number_format(opera.importo.toString().replace('.',','), 2, ',', '.');

  operaz.appendChild(modifica);
  operaz.appendChild(elimina);

  descBreveOpera.appendChild(descOpera);

  row.appendChild(codOpera);
  row.appendChild(descBreveOpera);
  row.appendChild(operaz);
  row.appendChild(importo);

  div.appendChild(spacer);
  div.appendChild(row);

  if (inserimento) {
    tbodyI.appendChild(div);
  } else {
    tbodyM.appendChild(div);
  }

  operePrev[operePrev.length] = opera;

  // Aggiorna importi
  calcolaImp();
  checkAggio();

  $('#importo' + (ix)).focusout(function() {
    if (isNaN(format.number_format($('#' + this.id).val(), 2, '.', ''))) {
      $('#' + this.id).val(format.number_format(0, 2, ',', '.'));
    } else {
      $('#' + this.id).val(format.number_format($('#' + this.id).val(), 2, ',', '.'))
    }
    calcolaImp();
    checkAggio();
  });
  $('#modifica' + (ix)).click(function() {
    modificaOpera(this.value);
  });
  $('#elimina' + (ix)).click(function() {
    eliminaOpera(this.value);
    checkAggio();
  });
});

// Caricamento parametri
ipcRenderer.on('prv:listaParm', function(e, parametro){
  for (var i = 0; i < parametro.length; i++) {
    if (inserimento) {
      if (parametro[i].codice == 'iva') {
        iva = parametro[i].valore.trim();
        parmIva = parametro[i].valore.trim();
      } else if (parametro[i].codice == 'cassageom') {
        cassaGeom = parametro[i].valore.trim();
        parmCassaGeom = parametro[i].valore.trim();
      } else if (parametro[i].codice == 'ritacc') {
        ritAcc = parametro[i].valore.trim();
        parmRitAcc = parametro[i].valore.trim();
      }
    } else {
      if (parametro[i].codice == 'iva') {
        parmIva = parametro[i].valore.trim();
      } else if (parametro[i].codice == 'cassageom') {
        parmCassaGeom = parametro[i].valore.trim();
      } else if (parametro[i].codice == 'ritacc') {
        parmRitAcc = parametro[i].valore.trim();
      }
    }
  }
});

// valorizzo cliente appena inserito
ipcRenderer.on('aggiornaCli', function(e, cliente){
  $('#clienteI').html('');
  $('#desNomeI').html('');
  $('#desCFI').html('');
  $('#desIndirI').html('');
  $('#desComuneI').html('');
  $('#clienteM').html('');
  $('#desNomeM').html('');
  $('#desCFM').html('');
  $('#desIndirM').html('');
  $('#desComuneM').html('');

  clienteId = cliente.id;

  $('#clienteI').html(document.createTextNode(cliente.id));
  $('#clienteM').html(document.createTextNode(cliente.id));

  $('#tipoCliI, #tipoCliM').removeClass();

  if (cliente.tipoCli == 'P') {
    $('#tipoCliI, #tipoCliM').addClass('privato fa fa-user col-lg-1 text-right');
    $('#tipoCliI, #tipoCliM').attr('Title','Privato');
    $('#desNomeI').html(document.createTextNode(cliente.id + " - " + cliente.cognome.trim() + " " + cliente.nome.trim()));
    $('#desCFI').html(document.createTextNode("C.F. " + cliente.cdFis.trim()));
    $('#desIndirI').html(document.createTextNode(cliente.indirizzo.trim() + ", n° " + cliente.numCiv.trim() + " - " + cliente.cap));
    $('#desComuneI').html(document.createTextNode(cliente.comune.trim() + " (" + cliente.provincia + ")"));

    $('#desNomeM').html(document.createTextNode(cliente.id + " - " + cliente.cognome.trim() + " " + cliente.nome.trim()));
    $('#desCFM').html(document.createTextNode("C.F. " + cliente.cdFis.trim()));
    $('#desIndirM').html(document.createTextNode(cliente.indirizzo.trim() + ", n° " + cliente.numCiv.trim() + " - " + cliente.cap));
    $('#desComuneM').html(document.createTextNode(cliente.comune.trim() + " (" + cliente.provincia + ")"));
    setRitenuta('NO', (inserimento ? 'ins' : 'mod'), true);
  } else {
    $('#tipoCliI, #tipoCliM').addClass('societa fa fa-industry col-lg-1 text-right');
    $('#tipoCliI, #tipoCliM').attr('Title','Società');
    $('#desNomeI').html(document.createTextNode(cliente.id + " - " + cliente.ragSoc.trim()));
    $('#desCFI').html(document.createTextNode("P.IVA " + cliente.pIva));
    $('#desIndirI').html(document.createTextNode(cliente.indirizzo.trim() + ", n° " + cliente.numCiv.trim() + " - " + cliente.cap));
    $('#desComuneI').html(document.createTextNode(cliente.comune.trim() + " (" + cliente.provincia + ")"));

    $('#desNomeM').html(document.createTextNode(cliente.id + " - " + cliente.ragSoc.trim()));
    $('#desCFM').html(document.createTextNode("P.IVA " + cliente.pIva));
    $('#desIndirM').html(document.createTextNode(cliente.indirizzo.trim() + ", n° " + cliente.numCiv.trim() + " - " + cliente.cap));
    $('#desComuneM').html(document.createTextNode(cliente.comune.trim() + " (" + cliente.provincia + ")"));
    setRitenuta('SI', (inserimento ? 'ins' : 'mod'), true);
  }
});

// Aggiornamento dell'opera
ipcRenderer.on('aggiornaOperaPrev', function(e, opera, indice){
  let descOpera = document.createElement("p");
  descOpera.className = 'descOpera';
  descOpera.id = 'descOpera' + indice;
  
  for (var i = 0; i < opera.descrizioni.length; i++) {
    const descrizione = document.createElement('p');
    descrizione.className = 'noSpace';
    descrizione.appendChild(document.createTextNode(opera.descrizioni[i].descrizione));
    descOpera.appendChild(descrizione);
  };
  
  $('#descBreveOpera' + indice).html(opera.opera);
  $('#descBreveOpera' + indice).append(descOpera)
  $('#descOpera' + indice).attr('style','display: none');
  $('#importo' + indice).val(format.number_format(opera.importo.toString().replace('.',','), 2, ',', '.'));
  operePrev[indice-1] = opera;
  checkAggio();
});

$('#insCli').click(function() {
  $('#modalCliente').modal("toggle");
  ipcRenderer.send('nuovoClientePrev');
});

$('#insOpera').click(function() {
  $('#modalOpera').modal("toggle");
  ipcRenderer.send('nuovaOperaPrev');
});

$('#saveI').click(function() {
  let esito = checkSalva();
  // AggOpereDB();

  if (esito.rc === '') {
    ipcRenderer.send('confermaInsPreventivo', 'Conferma inserimento', "Confermi l'inserimento del preventivo?", 'Inserisci', 'inserisciPreventivo', salvaPrev());
  }
});

$('#saveM').click(function() {
  let esito = checkSalva();
  // AggOpereDB();

  if (esito.rc === '') {
    ipcRenderer.send('confermaAggPreventivo', 'Conferma aggiornamento', "Confermi l'aggiornamento del preventivo?", 'Aggiorna', 'aggiornaPreventivo', aggiornaPrev());
  }
});

$('#pdfI').click(function() {
  checkSalva();
  // AggOpereDB();
  ipcRenderer.send('confermaInsPreventivo', 'Conferma inserimento', "Confermi l'inserimento del preventivo?", 'Inserisci', 'inserisciPrev+pdf', salvaPrev());
});

$('#pdfM').click(function() {
  // AggOpereDB();
  if (aggiorna) {
    checkSalva();

    ipcRenderer.send('confermaAggPreventivo', 'Conferma aggiornamento', "Confermi l'aggiornamento del preventivo?", 'Aggiorna', 'aggiornaPrev+pdf', aggiornaPrev());
  } else {
    let preventivo = aggiornaPrev();
    ipcRenderer.send('creaPdf', preventivo);
  }
});

$('#updPercM').click(function() {
  let x = confirm("Sei sicuro di voler aggiornare le percentuali?");
  if (x) {
    $('.cassaGeom').html(parmCassaGeom);
    $('.iva').html(parmIva);
    $('.ritAcc').html(parmRitAcc);

    cassaGeom = parmCassaGeom;
    iva = parmIva;
    ritAcc = parmRitAcc;

    calcolaImp();

    $('#updPercM').hide("slow");
    $('#saveM').show("slow");
    $('#pdfM').attr("title","Crea PDF");
  }
});

$("#collDescI, #collDescM").click(function(){
  $(".descOpera").toggle("slow","swing");

  if ($("i").hasClass("fa-chevron-down")) {
    $(".fa-chevron-down").addClass("fa-chevron-up");
    $(".fa-chevron-down").removeClass("fa-chevron-down");
    $(".fa-chevron-down").removeClass("fa-chevron-down");
    $("#collDescI, #collDescM").attr({"title" : "Nascondi descrizione estesa"});
  } else {
    $(".fa-chevron-up").addClass("fa-chevron-down");
    $(".fa-chevron-up").removeClass("fa-chevron-up");
    $("#collDescI, #collDescM").attr({"title" : "Visualizza descrizione estesa"});
  }
});

$('#art15I').focusout(function() {
  if (isNaN(format.number_format($('#' + this.id).val(), 2, '.', ''))) {
    $('#' + this.id).val(format.number_format(0, 2, ',', '.'));
  } else {
    $('#' + this.id).val(format.number_format($('#' + this.id).val(), 2, ',', '.'))
  }
  calcolaImp();
});

$('#art15M').focusout(function() {
  if (isNaN(format.number_format($('#' + this.id).val(), 2, '.', ''))) {
    $('#' + this.id).val(format.number_format(0, 2, ',', '.'));
  } else {
    $('#' + this.id).val(format.number_format($('#' + this.id).val(), 2, ',', '.'))
  }
  calcolaImp();
  checkAggio();
});

// Gestione ritenuta d'acconto
$('#siRitI').click(function() {
  setRitenuta('SI','ins', true);
});

$('#noRitI').click(function() {
  setRitenuta('NO','ins', true);
});

$('#siRitM').click(function() {
  setRitenuta('SI','mod', true);
});

$('#noRitM').click(function() {
  setRitenuta('NO','mod', true);
});

function valorCli(cliente) {
  $('#clienteI').html(document.createTextNode(cliente.id));
  $('#clienteM').html(document.createTextNode(cliente.id));

  $('#tipoCliI, #tipoCliM').removeClass();

  if (cliente.tipoCli == 'P') {
    $('#tipoCliI, #tipoCliM').addClass('privato fa fa-user col-lg-1 text-right');
    $('#tipoCliI, #tipoCliM').attr('Title','Privato');
    $('#desNomeI').html(document.createTextNode(cliente.id + " - " + cliente.cognome.trim() + " " + cliente.nome.trim()));
    $('#desCFI').html(document.createTextNode("C.F. " + cliente.cdFis.trim()));
    $('#desIndirI').html(document.createTextNode(cliente.indirizzo.trim() + ", n° " + cliente.numCiv.trim() + " - " + cliente.cap));
    $('#desComuneI').html(document.createTextNode(cliente.comune.trim() + " (" + cliente.provincia + ")"));

    $('#desNomeM').html(document.createTextNode(cliente.id + " - " + cliente.cognome.trim() + " " + cliente.nome.trim()));
    $('#desCFM').html(document.createTextNode("C.F. " + cliente.cdFis.trim()));
    $('#desIndirM').html(document.createTextNode(cliente.indirizzo.trim() + ", n° " + cliente.numCiv.trim() + " - " + cliente.cap));
    $('#desComuneM').html(document.createTextNode(cliente.comune.trim() + " (" + cliente.provincia + ")"));
    setRitenuta('NO', (inserimento ? 'ins' : 'mod'), true);
  } else {
    $('#tipoCliI, #tipoCliM').addClass('societa fa fa-industry col-lg-1 text-right');
    $('#tipoCliI, #tipoCliM').attr('Title','Società');
    $('#desNomeI').html(document.createTextNode(cliente.id + " - " + cliente.ragSoc.trim()));
    $('#desCFI').html(document.createTextNode("P.IVA " + cliente.pIva));
    $('#desIndirI').html(document.createTextNode(cliente.indirizzo.trim() + ", n° " + cliente.numCiv.trim() + " - " + cliente.cap));
    $('#desComuneI').html(document.createTextNode(cliente.comune.trim() + " (" + cliente.provincia + ")"));

    $('#desNomeM').html(document.createTextNode(cliente.id + " - " + cliente.ragSoc.trim()));
    $('#desCFM').html(document.createTextNode("P.IVA " + cliente.pIva));
    $('#desIndirM').html(document.createTextNode(cliente.indirizzo.trim() + ", n° " + cliente.numCiv.trim() + " - " + cliente.cap));
    $('#desComuneM').html(document.createTextNode(cliente.comune.trim() + " (" + cliente.provincia + ")"));
    setRitenuta('SI', (inserimento ? 'ins' : 'mod'), true);
  }
}

function salvaPrev() {
  let preventivo = {
    numPrev: anno + '' + numero,
    anno: anno,
    numero: numero,
    cliente: clienteId,
    daFatt: (isNaN(format.number_format($('#daFattI').html(), 2, '.', '')) ? 0 : format.number_format($('#daFattI').html(), 2, '.', '')),
    cassaGeomPerc: this.cassaGeom,
    cassaGeom: (isNaN(format.number_format($('#cassaGeomI').html(), 2, '.', '')) ? 0 : format.number_format($('#cassaGeomI').html(), 2, '.', '')),
    impon: (isNaN(format.number_format($('#totImpI').html(), 2, '.', '')) ? 0 : format.number_format($('#totImpI').html(), 2, '.', '')),
    ivaPerc: this.iva,
    iva: (isNaN(format.number_format($('#ivaI').html(), 2, '.', '')) ? 0 : format.number_format($('#ivaI').html(), 2, '.', '')),
    art15: (isNaN(format.number_format($('#art15I').html(), 2, '.', '')) ? 0 : format.number_format($('#art15I').html(), 2, '.', '')),
    totFatt: (isNaN(format.number_format($('#totFattI').html(), 2, '.', '')) ? 0 : format.number_format($('#totFattI').html(), 2, '.', '')),
    swRitenuta: (siRitenuta ? 'S' : 'N'),
    ritenutaPerc: this.ritAcc,
    ritenuta: (isNaN(format.number_format($('#ritAccI').html(), 2, '.', '')) ? 0 : format.number_format($('#ritAccI').html(), 2, '.', '')),
    impDaCorr: (isNaN(format.number_format($('#daCorrI').html(), 2, '.', '')) ? 0 : format.number_format($('#daCorrI').html(), 2, '.', '')),
    opera: operePrev,
    dataIns: date.format(currentDate, 'YYYY/MM/DD'),
    dataMod: date.format(currentDate, 'YYYY/MM/DD')
  };

  return preventivo;
}

function AggOpereDB() {
  let importi = $("[id^='importo']");

  for (var i = 0; i < importi.length; i++) {
    operePrev[i].importo = Number(format.number_format(importi[i].value, 2, '.', ''));
  }
}

function aggiornaPrev() {
  let preventivo = {
    numPrev: anno + '' + numero,
    anno: anno,
    numero: numero,
    cliente: clienteId,
    daFatt: (isNaN(format.number_format($('#daFattM').html(), 2, '.', '')) ? 0 : format.number_format($('#daFattM').html(), 2, '.', '')),
    cassaGeomPerc: this.cassaGeom,
    cassaGeom: (isNaN(format.number_format($('#cassaGeomM').html(), 2, '.', '')) ? 0 : format.number_format($('#cassaGeomM').html(), 2, '.', '')),
    impon: (isNaN(format.number_format($('#totImpM').html(), 2, '.', '')) ? 0 : format.number_format($('#totImpM').html(), 2, '.', '')),
    ivaPerc: this.iva,
    iva: (isNaN(format.number_format($('#ivaM').html(), 2, '.', '')) ? 0 : format.number_format($('#ivaM').html(), 2, '.', '')),
    art15: (isNaN(format.number_format($('#art15M').val(), 2, '.', '')) ? 0 : format.number_format($('#art15M').val(), 2, '.', '')),
    totFatt: (isNaN(format.number_format($('#totFattM').html(), 2, '.', '')) ? 0 : format.number_format($('#totFattM').html(), 2, '.', '')),
    swRitenuta: (siRitenuta ? 'S' : 'N'),
    ritenutaPerc: this.ritAcc,
    ritenuta: (isNaN(format.number_format($('#ritAccM').html(), 2, '.', '')) ? 0 : format.number_format($('#ritAccM').html(), 2, '.', '')),
    impDaCorr: (isNaN(format.number_format($('#daCorrM').html(), 2, '.', '')) ? 0 : format.number_format($('#daCorrM').html(), 2, '.', '')),
    opera: operePrev,
    dataIns: dataIns,
    dataMod: date.format(currentDate, 'YYYY/MM/DD')
  };

  return preventivo;
}

function setRitenuta(ritenuta, tipo, aggiornaTotali) {
  if (ritenuta == 'SI') {
    // Ritenuta attiva
    siRitenuta = true;
    if (tipo == 'ins') {
      $('.btn-group > button').removeClass('btn-success btn-default');
      $('#siRitI').addClass('btn-success');
      $('#noRitI').addClass('btn-default');
      $('#rowRitAccI').show("slow","swing");
    } else {
      $('.btn-group > button').removeClass('btn-success btn-default');
      $('#siRitM').addClass('btn-success');
      $('#noRitM').addClass('btn-default');
      $('#rowRitAccM').show("slow","swing");
    }
  } else {
    // Ritenuta NON attiva
    siRitenuta = false;
    if (tipo == 'ins') {
      $('.btn-group > button').removeClass('btn-success btn-default');
      $('#siRitI').addClass('btn-default');
      $('#noRitI').addClass('btn-success');
      $('#rowRitAccI').hide("slow","swing");
    } else {
      $('.btn-group > button').removeClass('btn-success btn-default');
      $('#siRitM').addClass('btn-default');
      $('#noRitM').addClass('btn-success');
      $('#rowRitAccM').hide("slow","swing");
    }
  }

  if (aggiornaTotali) {
    calcolaImp();
  }
}

function calcolaImp() {
  var stripe = true;
  let impDaFatt = 0;
  let impCassa = 0;
  let impIva = 0;
  let impTotFatt = 0;
  let impRitAcc = 0;
  let impDaCorr = 0;

  if (inserimento) {
    let impArt15 = (isNaN(format.number_format($('#art15I').val(), 2, '.', '')) ? 0 : Number(format.number_format($('#art15I').val(), 2, '.', '')));
    let listaInp = $('#tbodyI input');

    for (var i = 0; i < listaInp.length; i++) {
      impDaFatt += parseFloat(listaInp[i].value.replace('.','').replace('.','').replace('.','').replace(',','.'));
    }

    impCassa = (impDaFatt/100)*cassaGeom;
    impIva = ((impDaFatt + impCassa)/100)*iva;
    impTotFatt = impDaFatt + impCassa + impIva + impArt15;
    if (siRitenuta) {
      impRitAcc = (impTotFatt/100)*ritAcc;
    } else {
      impRitAcc = 0;
    }
    impDaCorr = impDaFatt + impCassa + impIva + impArt15 - impRitAcc;

    $('#daFattI').html(format.number_format(impDaFatt.toString().replace('.',','), 2, ',', '.'));
    $('#cassaGeomI').html(format.number_format(impCassa.toString().replace('.',','), 2, ',', '.'));
    $('#totImpI').html(format.number_format((impDaFatt + impCassa).toString().replace('.',','), 2, ',', '.'));
    $('#ivaI').html(format.number_format(impIva.toString().replace('.',','), 2, ',', '.'));
    $('#art15I').val(format.number_format(impArt15.toString().replace('.',','), 2, ',', '.'));
    $('#totFattI').html(format.number_format(impTotFatt.toString().replace('.',','), 2, ',', '.'));
    $('#ritAccI').html(format.number_format(impRitAcc.toString().replace('.',','), 2, ',', '.'));
    $('#daCorrI').html(format.number_format(impDaCorr.toString().replace('.',','), 2, ',', '.'));
  } else {
    let impArt15 = (isNaN(format.number_format($('#art15M').val(), 2, '.', '')) ? 0 : Number(format.number_format($('#art15M').val(), 2, '.', '')));
    let listaInp = $('#tbodyM input');

    for (var i = 0; i < listaInp.length; i++) {
      impDaFatt += parseFloat(listaInp[i].value.replace('.','').replace('.','').replace('.','').replace(',','.'));
    }

    impCassa = (impDaFatt/100)*cassaGeom;
    impIva = ((impDaFatt + impCassa)/100)*iva;
    impTotFatt = impDaFatt + impCassa + impIva + impArt15;
    if (siRitenuta) {
      impRitAcc = (impTotFatt/100)*ritAcc;
    } else {
      impRitAcc = 0;
    }
    impDaCorr = impDaFatt + impCassa + impIva + impArt15 - impRitAcc;

    $('#daFattM').html(format.number_format(impDaFatt.toString().replace('.',','), 2, ',', '.'));
    $('#cassaGeomM').html(format.number_format(impCassa.toString().replace('.',','), 2, ',', '.'));
    $('#totImpM').html(format.number_format((impDaFatt + impCassa).toString().replace('.',','), 2, ',', '.'));
    $('#ivaM').html(format.number_format(impIva.toString().replace('.',','), 2, ',', '.'));
    $('#art15M').val(format.number_format(impArt15.toString().replace('.',','), 2, ',', '.'));
    $('#totFattM').html(format.number_format(impTotFatt.toString().replace('.',','), 2, ',', '.'));
    $('#ritAccM').html(format.number_format(impRitAcc.toString().replace('.',','), 2, ',', '.'));
    $('#daCorrM').html(format.number_format(impDaCorr.toString().replace('.',','), 2, ',', '.'));
  }
}

function modificaOpera(indice) {
  ipcRenderer.send('modificaOperaPrev', operePrev[indice-1], indice);
}

function eliminaOpera(indice) {
  let x = confirm("Sei sicuro di voler cancellare l'opera?");
  if (x) {
    $('#prevOpera' + indice).remove();
    operePrev[indice-1] = null;
    calcolaImp();
  }
}

function checkAggio() {
  let operePrevUpd = $.grep(operePrev,function(n){ return n == 0 || n });
  let art15Check = isNaN(format.number_format($('#art15M').html(), 2, '.', '')) ? 0 : format.number_format($('#art15M').html(), 2, '.', '');
  let totFattCheck = isNaN(format.number_format($('#totFattM').html(), 2, '.', '')) ? 0 : format.number_format($('#totFattM').html(), 2, '.', '');
  let impDaCorrCheck = isNaN(format.number_format($('#daCorrM').html(), 2, '.', '')) ? 0 : format.number_format($('#daCorrM').html(), 2, '.', '');
  if (art15Check == 0.00) {
    art15Check = 0;
  }
  if (totFattCheck == 0.00) {
    totFattCheck = 0;
  }
  if (impDaCorrCheck == 0.00) {
    impDaCorrCheck = 0;
  }
  if (!inserimento) {
    for (var i = 0; i < operePrevUpd.length; i++) {
      if ($('#clienteM').val() == prevOld.codCli
      &&  operePrevUpd[i].id == prevOld.opere[i].id
      &&  operePrevUpd[i].descrizione == prevOld.opere[i].descrizioni
      &&  operePrevUpd[i].importo == prevOld.opere[i].importo
      &&  operePrevUpd[i].opera == prevOld.opere[i].opera
      &&  totFattCheck == prevOld.totFatt
      &&  impDaCorrCheck == prevOld.impDaCorr
      &&  art15Check == prevOld.art15) {
        // Disabilito il bottone di salvataggio
        $('#saveM').hide("slow");
        $('#pdfM').attr("title","Crea PDF");
        aggiorna = false;
      } else {
        // Abilito il bottone di salvataggio
        $('#saveM').show("slow");
        $('#pdfM').attr("title","Salva e crea PDF");
        aggiorna = true;
        break;
      }
    }
  }
}

// Nascondo il pulsate aggiornamento percentuali se non serve
function checkPerce() {
  if (cassaGeom == parmCassaGeom && iva == parmIva && ritAcc == parmRitAcc) {
    $('#updPercM').hide();
  }
}

// Modal
function searchCliId() {
  // Declare variables
  var input, filter, table, row, cli, i;
  input = document.getElementById("modClienteId");
  filter = input.value.toUpperCase();
  table = document.getElementById("cliTbody");
  row = table.getElementsByTagName("div");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < row.length; i++) {
    cli = row[i].getElementsByTagName("span")[0];
    if (cli) {
      if (cli.innerHTML.toUpperCase().indexOf(filter) > -1) {
        row[i].style.display = "";
      } else {
        row[i].style.display = "none";
      }
    }
  }
}

function searchNome() {
  // Declare variables
  var input, filter, table, row, cli, i;
  input = document.getElementById("modClienteNome");
  filter = input.value.toUpperCase();
  table = document.getElementById("cliTbody");
  row = table.getElementsByTagName("div");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < row.length; i++) {
    cli = row[i].getElementsByTagName("span")[1];
    if (cli) {
      if (cli.innerHTML.toUpperCase().indexOf(filter) > -1) {
        row[i].style.display = "";
      } else {
        row[i].style.display = "none";
      }
    }
  }
}

function searchCdfisPiva() {
  // Declare variables
  var input, filter, table, row, cli, i;
  input = document.getElementById("modClientePiva");
  filter = input.value.toUpperCase();
  table = document.getElementById("cliTbody");
  row = table.getElementsByTagName("div");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < row.length; i++) {
    cli = row[i].getElementsByTagName("span")[2];
    if (cli) {
      if (cli.innerHTML.toUpperCase().indexOf(filter) > -1) {
        row[i].style.display = "";
      } else {
        row[i].style.display = "none";
      }
    }
  }
}

function searchOpId() {
  // Declare variables
  var input, filter, table, row, cli, i;
  input = document.getElementById("modOperaId");
  filter = input.value.toUpperCase();
  table = document.getElementById("operaTbody");
  row = table.getElementsByTagName("div");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < row.length; i++) {
    cli = row[i].getElementsByTagName("span")[0];
    if (cli) {
      if (cli.innerHTML.toUpperCase().indexOf(filter) > -1) {
        row[i].style.display = "";
      } else {
        row[i].style.display = "none";
      }
    }
  }
}

function searchOpDesc() {
  // Declare variables
  var input, filter, table, row, cli, i;
  input = document.getElementById("modOperaDesc");
  filter = input.value.toUpperCase();
  table = document.getElementById("operaTbody");
  row = table.getElementsByTagName("div");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < row.length; i++) {
    cli = row[i].getElementsByTagName("span")[1];
    if (cli) {
      if (cli.innerHTML.toUpperCase().indexOf(filter) > -1) {
        row[i].style.display = "";
      } else {
        row[i].style.display = "none";
      }
    }
  }
}

// controlla valori
function checkSalva() {
  pulisciErr();

  let esito = {
    rc: '',
    descErr: ''
  }
  if (inserimento) {
    if ($('#desNomeI').html() === '') {
      $('#modalCliente').modal("toggle");
      esito.rc = 'KO';
      esito.descErr = 'Cliente obbligatorio';
    }
  } else {
    if ($('#desNomeM').html() === '') {
      $('#modalCliente').modal("toggle");
      esito.rc = 'KO';
      esito.descErr = 'Cliente obbligatorio';
    }
  }

  if (esito.rc == 'KO') {
    $('#esito').addClass('esito-ko');
    $('#descEsito').text(esito.descErr);
    $('#esito').show();
  }

  return esito;
}

// Premendo Ctrl+ si inserisce una nuova riga
function creaShortcut() {
  var isCtrl = false;$(document).keyup(function (e) {
    if(e.which == 17) isCtrl=false;
  }).keydown(function (e) {
    if(e.which == 17) isCtrl=true;
    if(e.which == 107 && isCtrl == true) {
      $('#modalOpera').modal("toggle");
      return false;
    }
  });
}

// Pulizia errori
function pulisciErr() {
  $('#desCliI').removeClass('errore');
  $('#desCliM').removeClass('errore');

  $('#esito').hide();
}

// Nascondo il messaggio
$('#esito').on('click', function() {
  $('#esito').hide();
});
// fine js
