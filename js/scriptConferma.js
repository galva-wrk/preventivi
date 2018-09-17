const electron = require('electron');
const remote = require('electron').remote;
const {ipcRenderer} = electron;
var tipoOpDaEseg = '';
var datiComodo = '';
var indiceComodo = '';
var tipoComodo = '';
var idComodo = '';
var descCliComodo = '';
var cdFisComodo = '';
var indice = '';
var descOperaComodo = '';
var parametroComodo = '';
var descParmComodo = '';
var annoComodo = '';
var clienteComodo = '';
var operaComodo = '';
$('#icoCanc').hide();
$('#icoIns').hide();

// Inserimento nuovo cliente
ipcRenderer.on('confermaInsCli', function(e, testata, descrizione, btnConf, tipoOperazione, dati){
  console.log('confermaInsCli');
  console.log('testata: ' + testata);
  console.log('descrizione: ' + descrizione);
  console.log('btnConf: ' + btnConf);
  console.log('tipoOperazione: ' + tipoOperazione);
  console.log('dati: ' + dati);
  
  ins();
  $('#icoIns').show();
  $('#modalHeader').html(testata);
  $('#modalDesc').html(descrizione);
  $('#confermaOp').html(btnConf);
  tipoOpDaEseg = tipoOperazione;
  datiComodo = dati;
});

// Inserimento nuovo cliente
ipcRenderer.on('confermaAggCli', function(e, testata, descrizione, btnConf, tipoOperazione, dati){
  console.log('confermaAggCli');
  console.log('testata: ' + testata);
  console.log('descrizione: ' + descrizione);
  console.log('btnConf: ' + btnConf);
  console.log('tipoOperazione: ' + tipoOperazione);
  console.log('dati: ' + dati);
  
  ins();
  $('#icoIns').show();
  $('#modalHeader').html(testata);
  $('#modalDesc').html(descrizione);
  $('#confermaOp').html(btnConf);
  tipoOpDaEseg = tipoOperazione;
  datiComodo = dati;
});

// Inserimento nuovo cliente
ipcRenderer.on('confermaCancCli', function(e, testata, descrizione, btnConf, tipoOperazione, indice, tipo, id, descCli, cdFis){
  console.log('confermaCancCli');
  console.log('indice: ' + indice);
  console.log('tipo: ' + tipo);
  console.log('id: ' + id);
  console.log('descCli: ' + descCli);
  console.log('cdFis: ' + cdFis);
  
  canc();
  $('#icoCanc').show();
  $('#modalHeader').html(testata);
  $('#modalDesc').html(descrizione);
  $('#confermaOp').html(btnConf);
  tipoOpDaEseg = tipoOperazione;
  indiceComodo = indice;
  tipoComodo = tipo;
  idComodo = id;
  descCliComodo = descCli;
  cdFisComodo = cdFis;
});

// Inserimento nuova opera
ipcRenderer.on('confermaInsOpera', function(e, testata, descrizione, btnConf, tipoOperazione, dati){
  console.log('confermaInsOpera');
  console.log('testata: ' + testata);
  console.log('descrizione: ' + descrizione);
  console.log('btnConf: ' + btnConf);
  console.log('tipoOperazione: ' + tipoOperazione);
  console.log('dati: ' + dati);
  
  ins();
  $('#icoIns').show();
  $('#modalHeader').html(testata);
  $('#modalDesc').html(descrizione);
  $('#confermaOp').html(btnConf);
  tipoOpDaEseg = tipoOperazione;
  datiComodo = dati;
});

// Inserimento nuova opera
ipcRenderer.on('confermaAggOpera', function(e, testata, descrizione, btnConf, tipoOperazione, dati){
  console.log('confermaAggOpera');
  console.log('testata: ' + testata);
  console.log('descrizione: ' + descrizione);
  console.log('btnConf: ' + btnConf);
  console.log('tipoOperazione: ' + tipoOperazione);
  console.log('dati: ' + dati);
  
  ins();
  $('#icoIns').show();
  $('#modalHeader').html(testata);
  $('#modalDesc').html(descrizione);
  $('#confermaOp').html(btnConf);
  tipoOpDaEseg = tipoOperazione;
  datiComodo = dati;
});

// Inserimento nuova opera
ipcRenderer.on('confermaCancOpera', function(e, testata, descrizione, btnConf, tipoOperazione, indice, descOpera){
  console.log('confermaCancOpera');
  console.log('indice: ' + indice);
  console.log('descOpera: ' + descOpera + '<');
  
  canc();
  $('#icoCanc').show();
  $('#modalHeader').html(testata);
  $('#modalDesc').html(descrizione);
  $('#confermaOp').html(btnConf);
  tipoOpDaEseg = tipoOperazione;
  indiceComodo = indice;
  descOperaComodo = descOpera;
});

// Inserimento nuovo parametro
ipcRenderer.on('confermaInsParametro', function(e, testata, descrizione, btnConf, tipoOperazione, dati){
  console.log('confermaInsParametro');
  console.log('testata: ' + testata);
  console.log('descrizione: ' + descrizione);
  console.log('btnConf: ' + btnConf);
  console.log('tipoOperazione: ' + tipoOperazione);
  console.log('dati: ' + dati);
  
  ins();
  $('#icoIns').show();
  $('#modalHeader').html(testata);
  $('#modalDesc').html(descrizione);
  $('#confermaOp').html(btnConf);
  tipoOpDaEseg = tipoOperazione;
  datiComodo = dati;
});

// Inserimento nuovo parametro
ipcRenderer.on('confermaAggParametro', function(e, testata, descrizione, btnConf, tipoOperazione, dati){
  console.log('confermaAggParametro');
  console.log('testata: ' + testata);
  console.log('descrizione: ' + descrizione);
  console.log('btnConf: ' + btnConf);
  console.log('tipoOperazione: ' + tipoOperazione);
  console.log('dati: ' + dati);
  
  ins();
  $('#icoIns').show();
  $('#modalHeader').html(testata);
  $('#modalDesc').html(descrizione);
  $('#confermaOp').html(btnConf);
  tipoOpDaEseg = tipoOperazione;
  datiComodo = dati;
});

// Inserimento nuovo parametro
ipcRenderer.on('confermaCancParametro', function(e, testata, descrizione, btnConf, tipoOperazione, indice, parametro, descrParm){
  console.log('confermaCancParametro');
  console.log('indice: ' + indice);
  console.log('parametro: ' + parametro + '<');
  console.log('descrParm: ' + descrParm + '<');
  
  canc();
  $('#icoCanc').show();
  $('#modalHeader').html(testata);
  $('#modalDesc').html(descrizione);
  $('#confermaOp').html(btnConf);
  tipoOpDaEseg = tipoOperazione;
  indiceComodo = indice;
  parametroComodo = parametro;
  descParmComodo = descrParm;
});

// Inserimento nuovo parametro
ipcRenderer.on('confermaCaricaOpera', function(e, testata, descrizione, btnConf, tipoOperazione, dati, indice){
  console.log('confermaCaricaOpera');
  console.log('dati: ' + dati + '<');
  console.log('indice: ' + indice + '<');
  
  ins();
  $('#icoIns').show();
  $('#modalHeader').html(testata);
  $('#modalDesc').html(descrizione);
  $('#confermaOp').html(btnConf);
  tipoOpDaEseg = tipoOperazione;
  datiComodo = dati;
  indiceComodo = indice;
});

// Inserimento preventivo
ipcRenderer.on('confermaInsPreventivo', function(e, testata, descrizione, btnConf, tipoOperazione, dati){
  console.log('confermaInsPreventivo');
  console.log('dati: ' + dati + '<');
  console.log('tipoOperazione: ' + tipoOperazione + '<');
  
  ins();
  $('#icoIns').show();
  $('#modalHeader').html(testata);
  $('#modalDesc').html(descrizione);
  $('#confermaOp').html(btnConf);
  tipoOpDaEseg = tipoOperazione;
  datiComodo = dati;
});

// Aggiornamento preventivo
ipcRenderer.on('confermaAggPreventivo', function(e, testata, descrizione, btnConf, tipoOperazione, dati){
  console.log('confermaAggPreventivo');
  console.log('dati: ' + dati + '<');
  console.log('tipoOperazione: ' + tipoOperazione + '<');
  
  ins();
  $('#icoIns').show();
  $('#modalHeader').html(testata);
  $('#modalDesc').html(descrizione);
  $('#confermaOp').html(btnConf);
  tipoOpDaEseg = tipoOperazione;
  datiComodo = dati;
});

// Cancellazione preventivo
ipcRenderer.on('confermaCancPreventivo', function(e, testata, descrizione, btnConf, tipoOperazione, indice, anno, cliente, opera){
  console.log('confermaCancPreventivo');
  console.log('indice: ' + indice);
  console.log('anno: ' + anno);
  console.log('cliente: ' + cliente);
  console.log('opera: ' + opera);
  
  canc();
  $('#icoCanc').show();
  $('#modalHeader').html(testata);
  $('#modalDesc').html(descrizione);
  $('#confermaOp').html(btnConf);
  tipoOpDaEseg = tipoOperazione;
  indiceComodo = indice;
  annoComodo = anno;
  clienteComodo = cliente;
  operaComodo = opera;
});

function ins() {
  $('body').addClass('save');
  $('#confirmOp').addClass('save');
}

function canc() {
  $('body').addClass('delete');
  $('#confirmOp').addClass('delete');
}

$('#confermaOp').on('click', function() {
  ipcRenderer.send(tipoOpDaEseg, datiComodo, indiceComodo, tipoComodo, idComodo, descCliComodo, cdFisComodo, descOperaComodo, parametroComodo, descParmComodo, annoComodo, clienteComodo, operaComodo);
});

$('#annullaOp').on('click', function() {
  var window = remote.getCurrentWindow();
  window.close();
});
// fine js