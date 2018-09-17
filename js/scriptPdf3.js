const electron = require('electron');
const {ipcRenderer, remote} = electron;
const format = require('../js/numberformat.js');

$('#esci').focus();

const preview = document.querySelector('#preview');
const opere = document.querySelector('#opere');
const totali = document.querySelector('#totali');
const riga = document.createElement('div');
const rigaTot = document.createElement('div');
const container = document.createElement('div');
const container2 = document.createElement('div');
let coordinate;
let iban;
let tel;
let fax;
let piva;
let indirizzo;
let mail;
let sito;
let ragsoc;
var logoImg;

var preventivoComodo;

// Gestione paginazione
var singolaPag = true;
var primaPag = true;
const rowMax = 58;
const rowMaxPg1 = 47 + 14;
const rowMaxPgN = 55;
const rowTotali = 12;
const rowFooter = 3;
const rowHeader = 3;
const rowTestata = 9;
var rowTotali2 = 0;
var iRow = 1;

riga.className = 'row col';
rigaTot.className = 'row col';

ipcRenderer.on('pdf:carica', function(e, preventivo, parametri, img) {
  var logo = $('<img/>');
  logo.attr('width', 75);
  logo.attr('src', img);
  
  logoImg = img;
  preventivoComodo = preventivo;

  caricaParm(parametri);

  // Scrittura dei dati 
  scriviHeader(true);
  scriviTestaPrev(preventivoComodo);
  scriviOggetti(preventivoComodo);
  scriviTotali(preventivoComodo);
  if (!primaPag) {
    caricaPag();
  }
  scriviFooter(true);
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
    } else if (parametro[i].codice == 'ragsoc') {
      ragsoc = parametro[i].valore.trim();
    }
  }
};

function checkPgBreak(dato, nextRow) {
  
  let numRow = Math.round(dato.length / 90);
  // let numRow = Math.ceil(dato.length / 90);
  console.log(dato.length + ' - ' + iRow + ' - ' + numRow + ' - ' + (rowHeader + rowTestata + rowTotali + rowFooter) + ' - ' + (rowHeader + rowTestata + rowFooter));
  
  if (primaPag) {
    if ((iRow + numRow + rowHeader + rowTestata + rowTotali + rowFooter) <= rowMax) {
      iRow+= numRow;
    } else {
      if (((iRow + numRow + rowHeader + rowTestata + rowFooter) <= rowMax) && nextRow) {
        iRow+= numRow;
      } else {
        primaPag = false;
        singolaPag = false;
        
        let ix = iRow;
        
        console.log(iRow + ' + ' + rowMax);
        
        for (var i = (iRow + rowHeader + rowTestata + rowFooter); i < rowMax; i++) {
          let spanBr = document.createElement('span');
          spanBr.className = 'white row';
          spanBr.innerHTML = 'X';
          preview.appendChild(spanBr);
        }     
        
        // scrivo il footer
        scriviFooter(false);
        // scrivo l'header
        scriviHeader(false);
        
        // inizializzo l'indice
        iRow = numRow;     
      }
    } 
  } else {
    if ((iRow + numRow + rowHeader + rowTotali + rowFooter) <= rowMax) {
      iRow+= numRow;
    } else {
      if (((iRow + numRow + rowHeader + rowFooter) <= rowMax) && nextRow) {
        iRow+= numRow;
      } else {
        primaPag = false;
        singolaPag = false;
        
        let ix = iRow;
        
        console.log(iRow + ' +- ' + rowMax);
        
        for (var i = (iRow + rowHeader + rowTestata + rowFooter); i < rowMax; i++) {
          let spanBr = document.createElement('span');
          if (i = (iRow + rowHeader + rowTestata + rowFooter)) {
            spanBr.className = 'white row page-break';
          } else {
            spanBr.className = 'white row';
          }
          spanBr.innerHTML = 'X';
          preview.appendChild(spanBr);
        }     
        
        // scrivo il footer
        scriviFooter(false);
        // scrivo l'header
        scriviHeader(false);
        
        // inizializzo l'indice
        iRow = numRow;     
      }
    }
  }
}

function caricaPag() {
        
  let ix = iRow;
  
  console.log('CARICAMENTO ' + iRow + ' + ' + rowMax + ' + ' + (iRow + rowHeader + rowTotali2 + rowFooter));
  console.log('CARICAMENTO ' + rowTotali2);
  
  // for (var i = (iRow + rowHeader + rowTotali2 + rowFooter); i < rowMax; i++) {
  for (var i = (iRow + rowTotali2 + 1 ); i < rowMax; i++) {
    let spanBr = document.createElement('span');
    spanBr.className = 'white row';
    spanBr.innerHTML = 'X';
    preview.appendChild(spanBr);
  }     
}

function scriviHeader(callPreview) {
  
  let header = document.createElement('div');
  let logo = document.createElement('span');
  let imgLogo = document.createElement('img');
  let descr = document.createElement('span');
  let soc = document.createElement('h4');
  let filler = document.createElement('span');
  let spanBr = document.createElement('span');
  
  header.className = 'row';
  logo.className = 'col-1';
  descr.className = 'col-10 d-flex justify-content-center';
  soc.className = 'align-self-center';
  filler.className = 'col-1';
  spanBr.className = 'white';
  
  imgLogo.src = logoImg;
  imgLogo.width = '75';
  
  soc.innerHTML = ragsoc;
  spanBr.innerHTML = 'X';
  
  descr.appendChild(soc);
  
  logo.appendChild(imgLogo);
  header.appendChild(logo);
  header.appendChild(descr);
  header.appendChild(filler);
  header.appendChild(spanBr);
  
  if (callPreview) {
    preview.appendChild(header);
  } else {
    preview.appendChild(header);
  }
}

function scriviTestaPrev(preventivo) {
  
  let div = document.createElement('div');
  let div2 = document.createElement('div');
  let span = document.createElement('span');
  let rowSep = document.createElement('div');
  let h1 = document.createElement('h1');
  let br = document.createElement('br');
  let testasx = document.createElement('div');
  let testadx = document.createElement('div');
  let r1s = document.createElement('div');
  let l1s = document.createElement('label');
  let o1s = document.createElement('output');
  let r2s = document.createElement('div');
  let l2s = document.createElement('label');
  let o2s = document.createElement('output');
  let r3s = document.createElement('div');
  let l3s = document.createElement('label');
  let o3s = document.createElement('output');
  let r4s = document.createElement('div');
  let l4s = document.createElement('label');
  let o4s = document.createElement('output');
  let r1d = document.createElement('div');
  let l1d = document.createElement('label');
  let r2d = document.createElement('div');
  let l2d = document.createElement('label');
  let r3d = document.createElement('div');
  let l3d = document.createElement('label');
  let r4d = document.createElement('div');
  let l4d = document.createElement('label');
  
  div.className = 'row';
  div2.className = 'row';
  span.className = 'col';
  rowSep.className = 'row white linea';
  testasx.className = 'col-6';
  testadx.className = 'col-6';
  r1s.className = 'row';
  r2s.className = 'row';
  r3s.className = 'row';
  r4s.className = 'row';
  l1s.className = 'col-5';
  l2s.className = 'col-5';
  l3s.className = 'col-5';
  l4s.className = 'col-5';
  o1s.className = 'col bold';
  o2s.className = 'col bold';
  o3s.className = 'col bold';
  o4s.className = 'col bold';
  r1d.className = 'row';
  r2d.className = 'row';
  r3d.className = 'row';
  r4d.className = 'row';
  l2d.className = 'bold';
  l3d.className = 'bold';
  l4d.className = 'bold';
  
  rowSep.innerHTML = 'X';
  h1.innerHTML = 'PREVENTIVO';
  l1s.innerHTML = 'Progressivo N° ';
  l2s.innerHTML = 'Mozzecane ';
  l3s.innerHTML = 'Codice fiscale ';
  l4s.innerHTML = 'Partita IVA ';
  
  span.appendChild(h1);
  div.appendChild(span);
  preview.appendChild(div);
  preview.appendChild(br);
  
  r1s.appendChild(l1s);
  o1s.appendChild(document.createTextNode(preventivo.anno + "-" + preventivo.numero));
  r1s.appendChild(o1s);
  r2s.appendChild(l2s);
  o2s.appendChild(document.createTextNode(preventivo.dataMod));
  r2s.appendChild(o2s);
  r3s.appendChild(l3s);
  o3s.appendChild(document.createTextNode(preventivo.cliente.cdFis));
  r3s.appendChild(o3s);
  r4s.appendChild(l4s);
  o4s.appendChild(document.createTextNode(preventivo.cliente.pIva));
  r4s.appendChild(o4s);
  testasx.appendChild(r1s);
  testasx.appendChild(r2s);
  testasx.appendChild(r3s);
  testasx.appendChild(r4s);
  div2.appendChild(testasx);
  
  l1d.innerHTML = 'Spett.';
  
  r1d.appendChild(l1d);
  l2d.appendChild(document.createTextNode((preventivo.cliente.tipoCli == 'P') ? preventivo.cliente.cognome + " " + preventivo.cliente.nome : preventivo.cliente.ragSoc));
  r2d.appendChild(l2d);
  l3d.appendChild(document.createTextNode(preventivo.cliente.indirizzo + ", " + preventivo.cliente.numCiv));
  r3d.appendChild(l3d);
  l4d.appendChild(document.createTextNode(preventivo.cliente.cap + ", " + preventivo.cliente.comune + " (" + preventivo.cliente.provincia + ")"));
  r4d.appendChild(l4d);
  testadx.appendChild(r1d);
  testadx.appendChild(r2d);
  testadx.appendChild(r3d);
  testadx.appendChild(r4d);
  div2.appendChild(testadx);

  preview.appendChild(div2);
  preview.appendChild(rowSep);
}

function scriviOggetti(preventivo) {
  const titolo = document.createElement('div');
  const testOggetto = document.createElement('span');
  const testImporto = document.createElement('span');
  // const container = document.createElement('div');
  let separatore = document.createElement('div');
  let sepRow = document.createElement('div');
  
  titolo.className = 'row col bold-500';
  testOggetto.className = 'col-10';
  testImporto.className = 'col-2 text-right importo';
  // container.className = 'container';
  sepRow.className = 'row';
  separatore.className = 'linea-grey';

  testOggetto.innerHTML = 'OGGETTO';
  testImporto.innerHTML = 'IMPORTO';
  titolo.appendChild(testOggetto);
  titolo.appendChild(testImporto);
  separatore.appendChild(sepRow);
  preview.appendChild(titolo);
  preview.appendChild(separatore);

  for (var i = 0; i < preventivo.opere.length; i++) {
    let sepRow = document.createElement('div');
    let separatore = document.createElement('div');
    let riga = document.createElement('div');
    let opera = document.createElement('span');
    let importo = document.createElement('span');

    riga.className = 'row col';
    opera.className = 'col-10 word-wrap';
    importo.className = 'col-2 bottom-right-imp text-right importo';
    sepRow.className = 'row';
    separatore.className = 'linea-grey';

    opera.innerHTML = preventivo.opere[i].descrizione;
    importo.innerHTML = format.number_format(preventivo.opere[i].importo.toString().replace('.',','), 2, ',', '.') + ' €';

    separatore.appendChild(sepRow);
    riga.appendChild(opera);
    riga.appendChild(importo);
    
    checkPgBreak(preventivo.opere[i].descrizione, (i+1 < preventivo.opere.length) ? true : false);
    
    preview.appendChild(riga);
    preview.appendChild(separatore);
    
  }
}

function scriviTotali(preventivo) {
  // Ammontare delle opere
  let opera = document.createElement('span');
  let importo = document.createElement('span');
  
  opera.className = 'col-10 text-right bold-500 page-break';
  importo.className = 'col-2 bottom-right-imp text-right importo bold-500';
  opera.innerHTML = 'Totale';
  importo.innerHTML = format.number_format(preventivo.daFatt.toString().replace('.',','), 2, ',', '.') + ' €';
  
  riga.appendChild(opera);
  riga.appendChild(importo);
  preview.appendChild(riga);
  
  rowTotali2++;
  
  // TOTALI
  let sepRow = document.createElement('div');
  sepRow.className = 'row white';
  sepRow.innerHTML = 'X';
  
  preview.appendChild(sepRow);
  
  rowTotali2++;
  
  // cassa geometri
  let rowCassaGeom = document.createElement('div');
  let cassaGeom = document.createElement('span');
  let impCassaGeom = document.createElement('span');
  
  rowCassaGeom.className = 'row col';
  cassaGeom.className = 'col-9';
  impCassaGeom.className = 'col-3 text-right importo';
  
  cassaGeom.innerHTML = 'Maggiorazione Cassa Geometri del ' + preventivo.cassaGeomPerc + "% sull'importo da fatturare";
  impCassaGeom.innerHTML = format.number_format(preventivo.cassaGeom.toString().replace('.',','), 2, ',', '.') + ' €';
  rowCassaGeom.appendChild(cassaGeom);
  rowCassaGeom.appendChild(impCassaGeom);
  preview.appendChild(rowCassaGeom);
  
  rowTotali2++;
  
  // imponibile
  let rowImpon = document.createElement('div');
  let impon = document.createElement('span');
  let impImpon = document.createElement('span');
  
  rowImpon.className = 'row col';
  impon.className = 'col-9';
  impImpon.className = 'col-3 text-right importo';
  
  impon.innerHTML = 'Totale imponibile';
  impImpon.innerHTML = format.number_format(preventivo.impon.toString().replace('.',','), 2, ',', '.') + ' €';
  rowImpon.appendChild(impon);
  rowImpon.appendChild(impImpon);
  preview.appendChild(rowImpon);
  
  rowTotali2++;
  
  // iva
  let rowIva = document.createElement('div');
  let iva = document.createElement('span');
  let impIva = document.createElement('span');
  
  rowIva.className = 'row col';
  iva.className = 'col-9';
  impIva.className = 'col-3 text-right importo';
  
  iva.innerHTML = 'Iva ' + preventivo.ivaPerc + "% sull'imponibile";
  impIva.innerHTML = format.number_format(preventivo.iva.toString().replace('.',','), 2, ',', '.') + ' €';
  rowIva.appendChild(iva);
  rowIva.appendChild(impIva);
  preview.appendChild(rowIva);
  
  rowTotali2++;
  
  // Art.15
  if (preventivo.art15 !== 0) {
    let rowArt15 = document.createElement('div');
    let art15 = document.createElement('span');
    let impArt15 = document.createElement('span');
  
    rowArt15.className = 'row col';
    art15.className = 'col-9';
    impArt15.className = 'col-3 text-right importo';
  
    art15.innerHTML = 'Rimborso spese esente art. 15';
    impArt15.innerHTML = format.number_format(preventivo.art15.toString().replace('.',','), 2, ',', '.') + ' €';
    rowArt15.appendChild(art15);
    rowArt15.appendChild(impArt15);
    preview.appendChild(rowArt15);
    
    rowTotali2++;
  }
  
  // totale fattura
  let rowTotFatt = document.createElement('div');
  let totFatt = document.createElement('span');
  let impTotFatt = document.createElement('span');
  
  rowTotFatt.className = 'row col bold';
  totFatt.className = 'col-9';
  impTotFatt.className = 'col-3 text-right importo';
  
  totFatt.innerHTML = 'TOTALE FATTURA';
  impTotFatt.innerHTML = format.number_format(preventivo.totFatt.toString().replace('.',','), 2, ',', '.') + ' €';
  rowTotFatt.appendChild(totFatt);
  rowTotFatt.appendChild(impTotFatt);
  preview.appendChild(rowTotFatt);
  
  rowTotali2++;
  
  // ritenuta d'acconto
  if (preventivo.swRitenuta === "S") {
    let rowRitenuta = document.createElement('div');
    let ritenuta = document.createElement('span');
    let impRitenuta = document.createElement('span');
  
    rowRitenuta.className = 'row col';
    ritenuta.className = 'col-9';
    impRitenuta.className = 'col-3 text-right importo';
  
    ritenuta.innerHTML = "A dedurre ritenuta d'acconto " + preventivo.ritenutaPerc + "% sull'importo da fatturare";
    impRitenuta.innerHTML = format.number_format(preventivo.ritenuta.toString().replace('.',','), 2, ',', '.') + ' €';
    rowRitenuta.appendChild(ritenuta);
    rowRitenuta.appendChild(impRitenuta);
    preview.appendChild(rowRitenuta);
    
    rowTotali2++;
  
    // importo da corrispondere
    let rowImpDaCorr = document.createElement('div');
    let impDaCorr = document.createElement('span');
    let impImpDaCorr = document.createElement('span');
  
    rowImpDaCorr.className = 'row col bold';
    impDaCorr.className = 'col-9';
    impImpDaCorr.className = 'col-3 text-right importo';
  
    impDaCorr.innerHTML = 'IMPORTO DA CORRISPONDERE';
    impImpDaCorr.innerHTML = format.number_format(preventivo.impDaCorr.toString().replace('.',','), 2, ',', '.') + ' €';
    rowImpDaCorr.appendChild(impDaCorr);
    rowImpDaCorr.appendChild(impImpDaCorr);
    preview.appendChild(rowImpDaCorr);
    
    rowTotali2++;
  }
}

function scriviFooter(callPreview) {
  let footer = document.createElement('div');
  let row1 = document.createElement('div');
  let row2 = document.createElement('div');
  let indir = document.createElement('span');
  let numTel = document.createElement('span');
  let numFax = document.createElement('span');
  let pIva = document.createElement('span');
  let email = document.createElement('u');
  let sitoWeb = document.createElement('u');

  footer.className = 'container page-break';
  row1.className = 'row col d-flex justify-content-center';
  row2.className = 'row col d-flex justify-content-center';
  
  indir.innerHTML = indirizzo;
  numTel.innerHTML = tel;
  numFax.innerHTML = fax;
  pIva.innerHTML = piva;
  email.innerHTML = mail;
  sitoWeb.innerHTML = sito;
  
  row1.appendChild(indir);
  row1.appendChild(document.createTextNode(' - Tel. '));
  row1.appendChild(numTel);
  row1.appendChild(document.createTextNode(' - '));
  row1.appendChild(numFax);
  footer.appendChild(row1);
  
  row2.appendChild(document.createTextNode('P.IVA '));
  row2.appendChild(pIva);
  row2.appendChild(document.createTextNode(' - e-mail: '));
  row2.appendChild(email);
  row2.appendChild(document.createTextNode(' - sito web: '));
  row2.appendChild(sitoWeb);
  footer.appendChild(row2);
  
  if (callPreview) {
    footer.id = 'footer';
    preview.appendChild(footer);
  } else {
    preview.appendChild(footer);
  }
}

$('#creaPdf').on('click', function() {
  $('#container2').removeClass('border');
  $('#footer').addClass('footer');
  $('#creaPdf').hide();
  
  window.print();
  
  $('#container2').addClass('border');
  $('#footer').removeClass('footer');
  $('#creaPdf').show();
});

$('#esci').on('click', function() {
  var window = remote.getCurrentWindow();
  window.close();
});
// fine js
