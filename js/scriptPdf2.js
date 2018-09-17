const electron = require('electron');
const {ipcRenderer, remote} = electron;
const format = require('../js/numberformat.js');

$('#esci').focus();
const opere = document.querySelector('#opere');
const totali = document.querySelector('#totali');
const riga = document.createElement('div');
const rigaTot = document.createElement('div');
let coordinate;
let iban;
let tel;
let fax;
let piva;
let indirizzo;
let mail;
let sito;

riga.className = 'row col';
rigaTot.className = 'row col';

ipcRenderer.on('pdf:carica', function(e, preventivo, parametri, img) {
  var logo = $('<img/>');
  logo.attr('width', 75);
  logo.attr('src', img);

  caricaParm(parametri);

  $('#logo').html(logo);
  $('#progressivo').html(preventivo.anno + "-" + preventivo.numero);
  $('#data').html(preventivo.dataMod);
  $('#cdfis').html(preventivo.cliente.cdFis);
  $('#piva').html(preventivo.cliente.pIva);
  if (preventivo.cliente.tipoCli == 'P') {
    $('#cliente').html(preventivo.cliente.cognome + " " + preventivo.cliente.nome);
  } else {
    $('#cliente').html(preventivo.cliente.ragSoc);
  }
  $('#indirizzo').html(preventivo.cliente.indirizzo + ", " + preventivo.cliente.numCiv);
  $('#indirizzo2').html(preventivo.cliente.cap + ", " + preventivo.cliente.comune + " (" + preventivo.cliente.provincia + ")");

  // Tabella opere
  const titolo = document.createElement('span');
  const container = document.createElement('div');
  titolo.className = 'col';
  container.className = 'container';

  titolo.innerHTML = (preventivo.opere.length === 1 ? 'OGGETTO:' : 'OGGETTI:');
  opere.appendChild(titolo);

  for (var i = 0; i < preventivo.opere.length; i++) {
    let sepRow = document.createElement('div');
    let separatore = document.createElement('div');
    let riga = document.createElement('div');
    let opera = document.createElement('span');
    let importo = document.createElement('span');

    riga.className = 'row col';
    opera.className = 'col-10';
    importo.className = 'col-2 bottom-right-imp text-right';
    sepRow.className = 'row';
    separatore.className = 'linea-grey';

    opera.innerHTML = preventivo.opere[i].descrizione;
    importo.innerHTML = format.number_format(preventivo.opere[i].importo, 2, ',', '.') + ' €';

    separatore.appendChild(sepRow);
    riga.appendChild(opera);
    riga.appendChild(importo);
    container.appendChild(riga);
    container.appendChild(separatore);
  }
  
  // Ammontare delle opere
  let opera = document.createElement('span');
  let importo = document.createElement('span');

  opera.className = 'col-10 bold-500';
  importo.className = 'col-2 bottom-right-imp text-right bold-500';
  opera.innerHTML = 'AMMONTANO -----------------------------------------------------------------------------------------------------------------&gt;';
  // opera.innerHTML = 'AMMONTANO --------------------------------------------------------------------------------------------------------------------&gt;';
  importo.innerHTML = format.number_format(preventivo.daFatt.toString().replace('.',','), 2, ',', '.') + ' €';

  riga.appendChild(opera);
  riga.appendChild(importo);
  container.appendChild(riga);
  opere.appendChild(container);

  // TOTALI
  // let spanTot = document.createElement('span');
  // // spanTot.className = 'col';
  // spanTot.innerHTML = 'TOTALI:';
  // totali.appendChild(spanTot);
  // 
  // // da fatturare
  // let rowDaFatt = document.createElement('div');
  // let daFatt = document.createElement('span');
  // let impDaFatt = document.createElement('span');
  // 
  // rowDaFatt.className = 'row col';
  // daFatt.className = 'col-10';
  // impDaFatt.className = 'col-2 text-right';
  // 
  // daFatt.innerHTML = 'Importo da fatturare';
  // impDaFatt.innerHTML = format.number_format(preventivo.daFatt.toString().replace('.',','), 2, ',', '.') + ' €';
  // rowDaFatt.appendChild(daFatt);
  // rowDaFatt.appendChild(impDaFatt);
  // totali.appendChild(rowDaFatt);
  
  // cassa geometri
  let rowCassaGeom = document.createElement('div');
  let cassaGeom = document.createElement('span');
  let impCassaGeom = document.createElement('span');
  
  rowCassaGeom.className = 'row col';
  cassaGeom.className = 'col-10';
  impCassaGeom.className = 'col-2 text-right';
  
  cassaGeom.innerHTML = 'Maggiorazione Cassa Geometri del ' + preventivo.cassaGeomPerc + "% sull'importo da fatturare";
  impCassaGeom.innerHTML = format.number_format(preventivo.cassaGeom.toString().replace('.',','), 2, ',', '.') + ' €';
  rowCassaGeom.appendChild(cassaGeom);
  rowCassaGeom.appendChild(impCassaGeom);
  totali.appendChild(rowCassaGeom);
  
  // imponibile
  let rowImpon = document.createElement('div');
  let impon = document.createElement('span');
  let impImpon = document.createElement('span');
  
  rowImpon.className = 'row col';
  impon.className = 'col-10';
  impImpon.className = 'col-2 text-right';
  
  impon.innerHTML = 'Totale imponibile';
  impImpon.innerHTML = format.number_format(preventivo.impon.toString().replace('.',','), 2, ',', '.') + ' €';
  rowImpon.appendChild(impon);
  rowImpon.appendChild(impImpon);
  totali.appendChild(rowImpon);
  
  // iva
  let rowIva = document.createElement('div');
  let iva = document.createElement('span');
  let impIva = document.createElement('span');
  
  rowIva.className = 'row col';
  iva.className = 'col-10';
  impIva.className = 'col-2 text-right';
  
  iva.innerHTML = 'Iva ' + preventivo.ivaPerc + "% sull'imponibile";
  impIva.innerHTML = format.number_format(preventivo.iva.toString().replace('.',','), 2, ',', '.') + ' €';
  rowIva.appendChild(iva);
  rowIva.appendChild(impIva);
  totali.appendChild(rowIva);
  
  // Art.15
  if (preventivo.art15 !== 0) {
    let rowArt15 = document.createElement('div');
    let art15 = document.createElement('span');
    let impArt15 = document.createElement('span');
    
    rowArt15.className = 'row col';
    art15.className = 'col-10';
    impArt15.className = 'col-2 text-right';
    
    art15.innerHTML = 'Rimborso spese esente art. 15';
    impArt15.innerHTML = format.number_format(preventivo.art15.toString().replace('.',','), 2, ',', '.') + ' €';
    rowArt15.appendChild(art15);
    rowArt15.appendChild(impArt15);
    totali.appendChild(rowArt15);
  }
  
  // totale fattura
  let rowTotFatt = document.createElement('div');
  let totFatt = document.createElement('span');
  let impTotFatt = document.createElement('span');
  
  rowTotFatt.className = 'row col bold';
  totFatt.className = 'col-10';
  impTotFatt.className = 'col-2 text-right';
  
  totFatt.innerHTML = 'TOTALE FATTURA';
  impTotFatt.innerHTML = format.number_format(preventivo.totFatt.toString().replace('.',','), 2, ',', '.') + ' €';
  rowTotFatt.appendChild(totFatt);
  rowTotFatt.appendChild(impTotFatt);
  totali.appendChild(rowTotFatt);
  
  // ritenuta d'acconto
  if (preventivo.swRitenuta === "S") {
    let rowRitenuta = document.createElement('div');
    let ritenuta = document.createElement('span');
    let impRitenuta = document.createElement('span');
  
    rowRitenuta.className = 'row col';
    ritenuta.className = 'col-10';
    impRitenuta.className = 'col-2 text-right';
  
    ritenuta.innerHTML = "A dedurre ritenuta d'acconto " + preventivo.ritenutaPerc + "% sull'importo da fatturare";
    impRitenuta.innerHTML = format.number_format(preventivo.ritenuta.toString().replace('.',','), 2, ',', '.') + ' €';
    rowRitenuta.appendChild(ritenuta);
    rowRitenuta.appendChild(impRitenuta);
    totali.appendChild(rowRitenuta);
    
    // importo da corrispondere
    let rowImpDaCorr = document.createElement('div');
    let impDaCorr = document.createElement('span');
    let impImpDaCorr = document.createElement('span');
    
    rowImpDaCorr.className = 'row col bold';
    impDaCorr.className = 'col-10';
    impImpDaCorr.className = 'col-2 text-right';
    
    impDaCorr.innerHTML = 'IMPORTO DA CORRISPONDERE';
    impImpDaCorr.innerHTML = format.number_format(preventivo.impDaCorr.toString().replace('.',','), 2, ',', '.') + ' €';
    rowImpDaCorr.appendChild(impDaCorr);
    rowImpDaCorr.appendChild(impImpDaCorr);
    totali.appendChild(rowImpDaCorr);
  }

  // FOOTER
  // descrizione
  $('#coord').html(coordinate);
  $('#iban').html(iban);
  $('#indir').html(indirizzo);
  $('#tel').html(tel);
  $('#fax').html(fax);
  $('#pivaStudio').html(piva);
  $('#mail').html(mail);
  $('#sito').html(sito);

});

function caricaParm(parametro) {
  for (var i = 0; i < parametro.length; i++) {
    if (parametro[i].codice == 'coordinate') {
      coordinate = parametro[i].valore.trim();
    } else if (parametro[i].codice == 'iban') {
      iban = parametro[i].valore.trim();
    } else if (parametro[i].codice == 'indirizzo') {
      indirizzo = parametro[i].valore.trim();
    } else if (parametro[i].codice == 'telefono') {
      tel = parametro[i].valore.trim();
    } else if (parametro[i].codice == 'fax') {
      fax = parametro[i].valore.trim();
    } else if (parametro[i].codice == 'piva') {
      piva = parametro[i].valore.trim();
    } else if (parametro[i].codice == 'email') {
      mail = parametro[i].valore.trim();
    } else if (parametro[i].codice == 'sito') {
      sito = parametro[i].valore.trim();
    }
  }
};

$('#creaPdf').on('click', function() {
  window.print();
  // ipcRenderer.send('stampaPdf', $('#stampa').html(), 'test01.pdf');
});

$('#esci').on('click', function() {
  var window = remote.getCurrentWindow();
  window.close();
});
// fine js
