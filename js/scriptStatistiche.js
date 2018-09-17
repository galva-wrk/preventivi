const electron = require('electron');
const {ipcRenderer} = electron;

let colori = new Array('rgb(233, 75, 60)', 'rgb(111, 159, 216)', 'rgb(0, 165, 145)', 'rgb(191, 214, 65)');
var ctx = $("#myChart");
let statisticheOut = new Array();
let statisticheComodo;

ipcRenderer.on('statistiche:carica', function(e, statistiche){
  statisticheComodo = statistiche;
  
  creaGrafico(statistiche,true);
});

function creaGrafico(statistiche, totaleFattura) {
  let ixO = 0;
  
  for (var i = 0; i < statistiche.length;) {
    let annoOld = statistiche[i].anno;
    let mesiComodo;
    let impOut = new Array();
    let ix = 0;
    
    while (i < statistiche.length && annoOld === statistiche[i].anno) {
         let importiComodo = {
           mese: 0,
           daFatt: 0,
           totFatt: 0
         }
         importiComodo.mese = statistiche[i].mese;
         importiComodo.daFatt = statistiche[i].daFatt;
         importiComodo.totFatt = statistiche[i].totFatt;
         impOut[ix] = importiComodo;
         ix++;
         i++;
    }
    
    let statisticheComodo = {
      anno: annoOld,
      importi: impOut
    }
    statisticheOut[ixO] = statisticheComodo;
    ixO++;
  }
  
  let ixCol = 0;
  let ix = 0;
  
  let ds = new Array();
  
  for (var i = 0; i < statisticheOut.length; i++) {
    let datasetsComodo = {
      label: statisticheOut[i].anno,
      data: caricaImporti(statisticheOut[i].importi,totaleFattura),
      borderColor: colori[ixCol],
      backgroundColor: colori[ixCol],
      fill: false
    }
    ds[ix] = datasetsComodo;
    ix++;
    ixCol++;
  }
  
  let config = {
    type: 'line',
    data: {
      labels: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
      datasets: ds
    },
    options: {
      responsive: true,
      title: {
        display: true,
        text: setTestata(totaleFattura)
      },
      tooltips: {
        mode: 'index'
      },
      scales: {
        xAxes: [{
          display: true,
          scaleLabel: {
            display: true
          }
        }],
        yAxes: [{
          ticks: {
           callback: function(value, index, values) {
             return value.toLocaleString("it-IT",{style:"currency", currency:"EUR"});
           }
         }
        }]
      }
    }
  };
  
  var chart = new Chart(ctx, config);
}

function setTestata(totaleFattura) {
  let testata;
  if (totaleFattura) {
    testata = 'Totali fattura';
  } else {
    testata = 'Totali da fatturare';
  }
  return testata;
}

function caricaImporti(importi,totaleFattura) {
  let importo = new Array();
  let ix = 0;
  for (var i = 0; i < 12; i++) {
    if (ix < importi.length && ix < 12 && importi[ix].mese - 1 == i) {
      if (totaleFattura) {
        importo[i] = importi[ix].totFatt;
      } else {
        importo[i] = importi[ix].daFatt;
      }
      ix++;
    } else {
      importo[i] = 0;
    }
  }
  return importo;
}

$('#daFatt').click(function () {
  creaGrafico(statisticheComodo,false);
});

$('#totFatt').click(function () {
  creaGrafico(statisticheComodo,true);
});

// fine js