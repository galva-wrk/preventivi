// *****************************************************************************
// App: Preventivi
// Version: 1.0
//
// Author: Davide Galvani
// Description: Software to produce job quote
// *****************************************************************************

const fs = require('fs');
const fsExtra = require('fs-extra');
const mkdirp = require('mkdirp');
const util = require('util');
﻿const electron = require('electron');
const path = require('path');
const url = require('url');
const database = require('better-sqlite3');
const date = require('date-and-time');
const logger = require('electron-log');
const getDirName = require('path').dirname;
const {app, BrowserWindow, Menu, ipcMain, shell} = electron;

const icoImg = path.join(__dirname, 'ico/sketch2.png');

// Variabili globali
global.sharedObj = {
  version: 1.0,
  licenseType: "MIT",
  copyrightYear: "2018",
  debug: false,
  pathLog: path.join(__dirname, 'log.txt')
};

// DEBUG console.log(util.inspect(indice));

// ---------------------------- SET ENVIRONMENT --------------------------------
if (global.sharedObj.debug) {
  process.env.NODE_ENV = 'development';
} else {
  process.env.NODE_ENV = 'production';
}
// -------------------------- FINE SET ENVIRONMENT -----------------------------

// Variables
let currentDate = new Date();
let sqlOperation;
let numBackup = 10; // Numero di backup di default

// Windows
let jobsQuotesW;
let clientsListW;
let parmsListW;
let worksListW;
let parmMngmntW;
let jobQuoteMngmntW;
let workMngmntW;
let cliMngmntW;
let confirmMngmntW;
let addWindow;
let shortcutsW;
let backupW;
let statisticsW;
let aboutW;
let licenseW;
let donateW;
let supportW;
let pdfW;

// DB definition
let dbFile = path.join(__dirname, '/db/preventivi.db');
var db = new database(dbFile);

// Listen for app to be ready
app.on('ready', function(){
  setupLogger();

  createJobsQuotes();
  jobsQuotesW.webContents.once('did-finish-load', () => {
    jobsQuotesW.webContents.send('tab-lisPrev:caricaFiltri', caricaAnni(), '', caricaCliPrev(), '', caricaOperePrev(), '');
    jobsQuotesW.webContents.send('tab-lisPrev:carica', caricaListaPrev('','',''));
  });

  // Build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  // Insert menu
  Menu.setApplicationMenu(mainMenu);
});

// Log set up
function setupLogger() {
    // logger.transports.console.level = false;
    logger.transports.file.level = true;
    // Same as for console transport
    logger.transports.file.level = 'warn';
    // logger.transports.file.format = '{h}:{i}:{s}:{ms} {text}';

    // Set approximate maximum log size in bytes. When it exceeds,
    // the archived log will be saved as the log.old.log file
    logger.transports.file.maxSize = 5 * 1024 * 1024;

    // Write to this file, must be set before first logging
    logger.transports.file.file = __dirname + '/log.txt';

    // fs.createWriteStream options, must be set before first logging
    logger.transports.file.streamConfig = {flags: 'a'};

    // set existed file stream
    logger.transports.file.stream = fs.createWriteStream(logger.transports.file.file, logger.transports.file.streamConfig);
}

// Quit application
function quit() {
  logger.info('quit');
  // Clean all temp files
  const directory = path.join(__dirname, 'tmpPdf');

  logger.info(directory);

  fs.readdir(directory, (err, files) => {
    if (err) {
      logger.error(err);
      throw err;
    }

    logger.info('readdir');
    logger.info(files);

    for (const file of files) {
      fs.unlink(path.join(directory, file), err => {
        logger.info('unlink');
        if (err) throw err;
      });
    }
  });

  // Backup del database
  backupDB();

  app.quit();
}

// WINDOWS MANAGEMENT
// Jobs quotes list (main page)
function createJobsQuotes(){
  logger.info('createJobsQuotes');

  // Create new window
  jobsQuotesW = new BrowserWindow({
    show: false,
    icon: icoImg
  });
  // Load html in window
  jobsQuotesW.loadURL(url.format({
    pathname: path.join(__dirname, 'pages/listaPreventivi.html'),
    protocol: 'file:',
    slashes:true
  }));
  // Show page only when it is ready
  jobsQuotesW.once('ready-to-show', () => {
    jobsQuotesW.maximize()
    jobsQuotesW.show()
  })

  // Quit app when closed
  jobsQuotesW.on('closed', function(){
    quit();
  });
}

// Clients list
function createClientsList(){
  logger.info('createClientsList');
  clientsListW = new BrowserWindow({
    show: false,
    icon: icoImg,
    title:'Lista clienti'
  });
  const otherMenu = Menu.buildFromTemplate(othersMenuTemplate);
  clientsListW.setMenu(otherMenu);
  clientsListW.loadURL(url.format({
    pathname: path.join(__dirname, 'pages/listaClienti.html'),
    protocol: 'file:',
    slashes:true
  }));
  // Show page only when it is ready
  clientsListW.once('ready-to-show', () => {
    clientsListW.maximize()
    clientsListW.show()
  })
  // Handle garbage collection
  clientsListW.on('close', function(){
    clientsListW = null;
  });
}

// Parms list
function createParmList(){
  logger.info('createParmList');
  parmsListW = new BrowserWindow({
    show: false,
    icon: icoImg,
    title:'Lista parametri'
  });
  const otherMenu = Menu.buildFromTemplate(othersMenuTemplate);
  parmsListW.setMenu(otherMenu);
  parmsListW.loadURL(url.format({
    pathname: path.join(__dirname, 'pages/listaParametri.html'),
    protocol: 'file:',
    slashes:true
  }));
  // Show page only when it is ready
  parmsListW.once('ready-to-show', () => {
    parmsListW.maximize()
    parmsListW.show()
  })
  // Handle garbage collection
  parmsListW.on('close', function(){
    parmsListW = null;
  });
}

// Works list
function createWorksList(){
  logger.info('createWorksList');
  worksListW = new BrowserWindow({
    show: false,
    icon: icoImg,
    title:'Lista opere'
  });
  const otherMenu = Menu.buildFromTemplate(othersMenuTemplate);
  worksListW.setMenu(otherMenu);
  worksListW.loadURL(url.format({
    pathname: path.join(__dirname, 'pages/listaOpere.html'),
    protocol: 'file:',
    slashes:true
  }));
  // Show page only when it is ready
  worksListW.once('ready-to-show', () => {
    worksListW.maximize()
    worksListW.show()
  })
  // Handle garbage collection
  worksListW.on('close', function(){
    worksListW = null;
  });
}

// Statistics
function createStats(){
  logger.info('createStats');
  statisticsW = new BrowserWindow({
    show: false,
    width: 1024,
    height: 590,
    icon: icoImg,
    title:'Statistiche'
  });
  const otherMenu = Menu.buildFromTemplate(othersMenuTemplate);
  statisticsW.setMenu(otherMenu);
  statisticsW.loadURL(url.format({
    pathname: path.join(__dirname, 'pages/statistiche.html'),
    protocol: 'file:',
    slashes:true
  }));
  // Show page only when it is ready
  statisticsW.once('ready-to-show', () => {
    // statisticsW.maximize()
    statisticsW.show()
  })
  // Handle garbage collection
  statisticsW.on('close', function(){
    statisticsW = null;
  });
}

// About
function createAbout(){
  logger.info('createAbout');
  aboutW = new BrowserWindow({
    frame: false,
    show: false,
    useContentSize: true,
    width: 500,
    height: 435,
    alwaysOnTop: true,
    icon: icoImg,
    title:'About'
  });
  const otherMenu = Menu.buildFromTemplate(othersMenuTemplate);
  aboutW.setMenu(otherMenu);
  aboutW.loadURL(url.format({
    pathname: path.join(__dirname, 'pages/about.html'),
    protocol: 'file:',
    slashes:true
  }));
  // Show page only when it is ready
  aboutW.once('ready-to-show', () => {
    aboutW.show()
  })
  aboutW.webContents.once('did-finish-load', () => {
    aboutW.webContents.send('about', icoImg);
  });
  // Handle garbage collection
  aboutW.on('close', function(){
    aboutW = null;
  });
}

// License
function createLicense(){
  logger.info('createLicense');
  licenseW = new BrowserWindow({
    frame: false,
    show: false,
    useContentSize: true,
    width: 500,
    height: 764,
    alwaysOnTop: true,
    icon: icoImg,
    title:'License'
  });
  const otherMenu = Menu.buildFromTemplate(othersMenuTemplate);
  licenseW.setMenu(otherMenu);
  licenseW.loadURL(url.format({
    pathname: path.join(__dirname, 'pages/license.html'),
    protocol: 'file:',
    slashes:true
  }));
  // Show page only when it is ready
  licenseW.once('ready-to-show', () => {
    licenseW.show()
  })
  // Handle garbage collection
  licenseW.on('close', function(){
    licenseW = null;
  });
}

// Donate
function createDonate(){
  logger.info('createDonate');
  donateW = new BrowserWindow({
    frame: true,
    show: false,
    autoHideMenuBar: true,
    alwaysOnTop: true,
    icon: icoImg,
    title:'Donate'
  });
  const otherMenu = Menu.buildFromTemplate(othersMenuTemplate);
  donateW.setMenu(otherMenu);
  donateW.loadURL(url.format({
    pathname: path.join(__dirname, 'pages/donate.html'),
    protocol: 'file:',
    slashes:true
  }));
  // Show page only when it is ready
  donateW.once('ready-to-show', () => {
    donateW.show()
  })
  // Handle garbage collection
  donateW.on('close', function(){
    donateW = null;
  });
}

// Support
function createSupport(){
  logger.info('createSupport');
  supportW = new BrowserWindow({
    // frame: false,
    // show: false,
    useContentSize: true,
    // width: 500,
    height: 280,
    alwaysOnTop: true,
    icon: icoImg,
    title:'Supporto'
  });
  const otherMenu = Menu.buildFromTemplate(othersMenuTemplate);
  supportW.setMenu(otherMenu);
  supportW.loadURL(url.format({
    pathname: path.join(__dirname, 'pages/support.html'),
    protocol: 'file:',
    slashes:true
  }));
  // Show page only when it is ready
  supportW.once('ready-to-show', () => {
    supportW.show()
  })
  supportW.webContents.once('did-finish-load', () => {
    supportW.webContents.send('support', icoImg);
  });
  // Handle garbage collection
  supportW.on('close', function(){
    supportW = null;
  });
}

// Pdf
function createPdf(){
  logger.info('createPdf');
  pdfW = new BrowserWindow({
    show: false,
    icon: icoImg,
    title:'Pdf'
  });
  const otherMenu = Menu.buildFromTemplate(othersMenuTemplate);
  pdfW.setMenu(otherMenu);
  pdfW.loadURL(url.format({
    pathname: path.join(__dirname, 'pages/pdf.html'),
    protocol: 'file:',
    slashes:true
  }));
  // Show page only when it is ready
  pdfW.once('ready-to-show', () => {
    // NON VISUALIZZO LA PAGINA DI STAMPA
    pdfW.maximize()
    pdfW.show()
  })
  // Handle garbage collection
  pdfW.on('close', function(){
    pdfW = null;
  });
}

// Client management
function createClientManagement(){
  logger.info('createClientManagement');
  cliMngmntW = new BrowserWindow({
    show: false,
    alwaysOnTop: true,
    icon: icoImg,
    title:'Gestione cliente'
  });
  const otherMenu = Menu.buildFromTemplate(othersMenuTemplate);
  cliMngmntW.setMenu(otherMenu);
  cliMngmntW.loadURL(url.format({
    pathname: path.join(__dirname, 'pages/gestioneCliente.html'),
    protocol: 'file:',
    slashes:true
  }));
  // Show page only when it is ready
  cliMngmntW.once('ready-to-show', () => {
    cliMngmntW.maximize()
    cliMngmntW.show()
  })
  // Handle garbage collection
  cliMngmntW.on('close', function(){
    cliMngmntW = null;
  });
}

// Parameter management
function createParameterManagement(){
  logger.info('createParameterManagement');
  parmMngmntW = new BrowserWindow({
    show: false,
    width: 1024,
    height:450,
    alwaysOnTop: true,
    icon: icoImg,
    title:'Gestione parametro'
  });
  const otherMenu = Menu.buildFromTemplate(othersMenuTemplate);
  parmMngmntW.setMenu(otherMenu);
  parmMngmntW.loadURL(url.format({
    pathname: path.join(__dirname, 'pages/gestioneParametro.html'),
    protocol: 'file:',
    slashes:true
  }));
  // Show page only when it is ready
  parmMngmntW.once('ready-to-show', () => {
    // parmMngmntW.maximize()
    parmMngmntW.show()
  })
  // Handle garbage collection
  parmMngmntW.on('close', function(){
    parmMngmntW = null;
  });
}

// Work management
function createWorkManagementW(){
  logger.info('createWorkManagementW');
  workMngmntW = new BrowserWindow({
    show: false,
    width: 1024,
    height:450,
    alwaysOnTop: true,
    icon: icoImg,
    title:'Gestione opera'
  });
  const otherMenu = Menu.buildFromTemplate(othersMenuTemplate);
  workMngmntW.setMenu(otherMenu);
  workMngmntW.loadURL(url.format({
    pathname: path.join(__dirname, 'pages/gestioneOpera.html'),
    protocol: 'file:',
    slashes:true
  }));
  // Show page only when it is ready
  workMngmntW.once('ready-to-show', () => {
    workMngmntW.maximize()
    workMngmntW.show()
  })
  // Handle garbage collection
  workMngmntW.on('close', function(){
    workMngmntW = null;
  });
}

// Job quote management
function createJobQuoteW(){
  logger.info('createJobQuoteW');
  jobQuoteMngmntW = new BrowserWindow({
    show: false,
    icon: icoImg,
    title:'Gestione preventivo'
  });
  const otherMenu = Menu.buildFromTemplate(othersMenuTemplate);
  jobQuoteMngmntW.setMenu(otherMenu);
  jobQuoteMngmntW.loadURL(url.format({
    pathname: path.join(__dirname, 'pages/gestionePreventivo.html'),
    protocol: 'file:',
    slashes:true
  }));
  // Show page only when it is ready
  jobQuoteMngmntW.once('ready-to-show', () => {
    jobQuoteMngmntW.maximize()
    jobQuoteMngmntW.show()
  })
  // Handle garbage collection
  jobQuoteMngmntW.on('close', function(){
    jobQuoteMngmntW = null;
  });
}

// Confirm
function createConfirmManagement(){
  logger.info('createConfirmManagement');
  confirmMngmntW = new BrowserWindow({
    frame: false,
    show: false,
    useContentSize: true,
    width: 400,
    height: 225,
    alwaysOnTop: true,
    icon: icoImg,
    title:'Conferma'
  });
  const otherMenu = Menu.buildFromTemplate(othersMenuTemplate);
  confirmMngmntW.setMenu(otherMenu);
  confirmMngmntW.loadURL(url.format({
    pathname: path.join(__dirname, 'pages/conferma.html'),
    protocol: 'file:',
    slashes:true
  }));
  // Show page only when it is ready
  confirmMngmntW.once('ready-to-show', () => {
    confirmMngmntW.show()
  })
  // Handle garbage collection
  confirmMngmntW.on('close', function(){
    confirmMngmntW = null;
  });
}

// Handle shortcuts
function createShortcuts(){
  logger.info('createShortcuts');
  shortcutsW = new BrowserWindow({
    frame: false,
    show: false,
    useContentSize: true,
    width: 500,
    height: 600,
    alwaysOnTop: true,
    icon: icoImg,
    title:'Scorciatoie'
  });
  const otherMenu = Menu.buildFromTemplate(othersMenuTemplate);
  shortcutsW.setMenu(otherMenu);
  shortcutsW.loadURL(url.format({
    pathname: path.join(__dirname, 'pages/shortcuts.html'),
    protocol: 'file:',
    slashes:true
  }));
  // Show page only when it is ready
  shortcutsW.once('ready-to-show', () => {
    shortcutsW.show()
  })
  // Handle garbage collection
  shortcutsW.on('close', function(){
    shortcutsW = null;
  });
}

// Handle backup
function createBackup(){
  logger.info('createBackup');
  backupW = new BrowserWindow({
    // frame: false,
    show: false,
    useContentSize: true,
    // width: 500,
    height: 250,
    alwaysOnTop: true,
    icon: icoImg,
    title:'Backup'
  });
  const otherMenu = Menu.buildFromTemplate(othersMenuTemplate);
  backupW.setMenu(otherMenu);
  backupW.loadURL(url.format({
    pathname: path.join(__dirname, 'pages/backup.html'),
    protocol: 'file:',
    slashes:true
  }));
  // Show page only when it is ready
  backupW.once('ready-to-show', () => {
    backupW.show()
  })
  // Handle garbage collection
  backupW.on('close', function(){
    backupW = null;
  });
}
// END WINDOWS MANAGEMENT

// DB OPERATIONS
// Caricamento Anni preventivi
function caricaAnni(){
  logger.info('caricaAnni');
  var outAnni = new Array();

  // Lettura anni
  var sqlOperation = 'SELECT DISTINCT anno FROM preventivi ORDER BY anno DESC';

  logger.info('caricaAnni: ' + sqlOperation + '<');
  // Esecuzione dell'operazione sql
  var row = db.prepare(sqlOperation).all();

  outAnni = row;

  return outAnni;
}

// Caricamento clienti preventivi
function caricaCliPrev(){
  logger.info('caricaCliPrev');
  var outCli = new Array();

  // Lettura clienti
  var sqlOperation = 'SELECT cliente, id, tipoCli FROM clientiPreventivi_view';

  logger.info('caricaCliPrev: ' + sqlOperation + '<');
  // Esecuzione dell'operazione sql
  var row = db.prepare(sqlOperation).all();

  outCli = row;

  return outCli;
}

// Caricamento opere preventivi
function caricaOperePrev(){
  logger.info('caricaOperePrev');
  var outOpere = new Array();

  // Lettura opere
  var sqlOperation = 'SELECT opera, id FROM operePreventivi_view';

  logger.info('caricaOperePrev: ' + sqlOperation + '<');
  // Esecuzione dell'operazione sql
  var row = db.prepare(sqlOperation).all();

  outOpere = row;

  return outOpere;
}

function caricaListaPrev(anno, cliente, opera){
  logger.info('caricaListaPrev');
  var outPrev = new Array();
  let swWhere = true;

  // setto ad anno corrente l'anno se non è settato
  if (anno == '') {
    anno = date.format(currentDate, 'YYYY');
  }

  // Lettura preventivi
  var sqlOperation = 'SELECT numPrev, anno, numero, cliente, daFatt, cassaGeomPerc, cassaGeom, impon, ivaPerc, iva, art15, totFatt, swRitenuta, ritenutaPerc, ritenuta, impDaCorr, dataIns, dataMod FROM preventivi';

  // Condizioni di estrazione
  if (anno != '') {
    sqlOperation += ' where anno = ' + anno;
    swWhere = false;
  }
  if (cliente != '') {
    if (swWhere) {
      sqlOperation += " where cliente = " + cliente;
      swWhere = false;
    } else {
      sqlOperation += " and cliente = " + cliente;
    }
  }
  if (opera != '') {
    if (swWhere) {
      sqlOperation += ' where numPrev in (SELECT numPrev FROM operePreventivi where id = ' + opera + ' )';
      swWhere = false;
    } else {
      sqlOperation += ' and numPrev in (SELECT numPrev FROM operePreventivi where id = ' + opera + ' )';
    }
  }

  logger.info('caricaListaPrev: ' + sqlOperation + '<');
  // Esecuzione dell'operazione sql
  var row = db.prepare(sqlOperation).all();

  // Scrittura dati e arricchimento opere
  for (var i = 0; i < row.length; i++) {

    outPrev[i] = {
      numPrev : row[i].numPrev,
      anno : row[i].anno,
      numero : row[i].numero,
      // lettura cliente
      cliente : db.prepare("SELECT id, nome, cognome, ragSoc, cdFis, pIva, indirizzo, numCiv, cap, comune, provincia, tipoCli FROM clienti WHERE id = " + row[i].cliente).get(),
      codCli : row[i].cliente,
      daFatt : row[i].daFatt,
      cassaGeomPerc : row[i].cassaGeomPerc,
      cassaGeom : row[i].cassaGeom,
      impon : row[i].impon,
      ivaPerc : row[i].ivaPerc,
      iva : row[i].iva,
      art15 : row[i].art15,
      totFatt : row[i].totFatt,
      swRitenuta : row[i].swRitenuta,
      ritenutaPerc : row[i].ritenutaPerc,
      ritenuta : row[i].ritenuta,
      impDaCorr : row[i].impDaCorr,
      dataIns : row[i].dataIns,
      dataMod : row[i].dataMod,
      // lettura opere relative al progetto
      opere : getOperePrev(row[i].numPrev)
      // opere : db.prepare("SELECT idOpera, id, opera, descrizione, importo FROM operePreventivi WHERE numPrev = " + row[i].numPrev).all(),
      }
  }

  return outPrev;
}

// Caricamento lista opere
function getOperePrev(numPrev){
  logger.info('getOperePrev');
  var outOpere = new Array();

  // Lettura opere
  var sqlOperation = 'SELECT idOperaKey, id, opera, descrizione, importo FROM operePreventivi WHERE numPrev = ' + numPrev;

  logger.info('getOperePrev: ' + sqlOperation + '<');
  var row = db.prepare(sqlOperation).all();

  // Scrittura dati e arricchimento opere
  for (var i = 0; i < row.length; i++) {
    var row2 = db.prepare("SELECT descrizione FROM opereDescrPreventivi WHERE idOpera = " + row[i].idOperaKey + " and numPrev = " + numPrev + " ORDER BY progressivo").all();
    let descr = new Array();

    for (var y = 0; y < row2.length; y++) {
      let comodo = {descrizione: row2[y].descrizione};
      descr[y] = comodo;
    }

    outOpere[i] = {
      id : row[i].id,
      opera : row[i].opera,
      // lettura descrizioni
      descrizioni : descr,
      importo : row[i].importo
      }
  }
  logger.info('outOpere: ' + util.inspect(outOpere) + '<');

  return outOpere;
}

function getPrev(numPrev){
  logger.info('getPrev');
  logger.info(numPrev);
  var outPrev = new Array();
  let swWhere = true;

  // Lettura preventivi
  var sqlOperation = 'SELECT numPrev, anno, numero, cliente, daFatt, cassaGeomPerc, cassaGeom, impon, ivaPerc, iva, art15, totFatt, swRitenuta, ritenutaPerc, ritenuta, impDaCorr, dataIns, dataMod FROM preventivi WHERE numPrev = ' + numPrev;

  logger.info('caricaListaPrev: ' + sqlOperation + '<');
  // Esecuzione dell'operazione sql
  var row = db.prepare(sqlOperation).get();

  // Scrittura dati e arricchimento opere
  outPrev = {
    numPrev : row.numPrev,
    anno : row.anno,
    numero : row.numero,
    // lettura cliente
    cliente : db.prepare("SELECT id, nome, cognome, ragSoc, cdFis, pIva, indirizzo, numCiv, cap, comune, provincia, tipoCli FROM clienti WHERE id = " + row.cliente).get(),
    codCli : row.cliente,
    daFatt : row.daFatt,
    cassaGeomPerc : row.cassaGeomPerc,
    cassaGeom : row.cassaGeom,
    impon : row.impon,
    ivaPerc : row.ivaPerc,
    iva : row.iva,
    art15 : row.art15,
    totFatt : row.totFatt,
    swRitenuta : row.swRitenuta,
    ritenutaPerc : row.ritenutaPerc,
    ritenuta : row.ritenuta,
    impDaCorr : row.impDaCorr,
    dataIns : row.dataIns,
    dataMod : row.dataMod,
    // lettura opere relative al progetto
    // opere : db.prepare("SELECT idOpera, id, opera, descrizione, importo FROM operePreventivi WHERE numPrev = " + row.numPrev).all(),
    opere : getOperePrev(numPrev),
  }

  return outPrev;
}

// Caricamento lista clienti
function caricaListaCli(tipo, id, descCli, cdFis){
  logger.info('caricaListaCli');
  var outCli = new Array();
  let swWhere = true;

  // Lettura clienti
  var sqlOperation = 'SELECT id, nome, cognome, ragSoc, cdFis, pIva, indirizzo, numCiv, cap, comune, provincia, tipoCli FROM clienti';

  // Condizioni di estrazione
  if (id != '') {
    sqlOperation += ' where id = ' + id;
  } else {
    if (tipo != '') {
      sqlOperation += " where tipoCli = '" + tipo + "'";
      swWhere = false;

      if (descCli != '') {
        if (swWhere) {
          if (tipo == 'P') {
            sqlOperation += " WHERE (nome LIKE '%" + descCli.replace(/[^a-zA-Z ]/g, "").trim() + "%' OR cognome LIKE '%" + descCli.replace(/[^a-zA-Z ]/g, "").trim() + "%')";
          } else {
            sqlOperation += " WHERE ragSoc LIKE '%" + descCli.replace(/[^a-zA-Z ]/g, "").trim() + "%'";
          }
          swWhere = false;
        } else {
          if (tipo == 'P') {
            sqlOperation += " AND (nome LIKE '%" + descCli.replace(/[^a-zA-Z ]/g, "").trim() + "%' OR cognome LIKE '%" + descCli.replace(/[^a-zA-Z ]/g, "").trim() + "%')";
          } else {
            sqlOperation += " AND ragSoc LIKE '%" + descCli.replace(/[^a-zA-Z ]/g, "").trim() + "%'";
          }
        }
      }
      if (cdFis != '') {
        if (swWhere) {
          if (tipo == 'P') {
            sqlOperation += " WHERE cdFis LIKE '%" + cdFis.replace(/[^a-zA-Z ]/g, "").trim() + "%'";
          } else {
            sqlOperation += " WHERE pIva LIKE '%" + cdFis.replace(/[^a-zA-Z ]/g, "").trim() + "%'";
          }
          swWhere = false;
        } else {
          if (tipo == 'P') {
            sqlOperation += " AND cdFis LIKE '%" + cdFis.replace(/[^a-zA-Z ]/g, "").trim() + "%'";
          } else {
            sqlOperation += " AND pIva LIKE '%" + cdFis.replace(/[^a-zA-Z ]/g, "").trim() + "%'";
          }
        }
      }
    } else {
      if (descCli != '') {
        if (swWhere) {
          sqlOperation += " WHERE (nome LIKE '%" + descCli.replace(/[^a-zA-Z ]/g, "").trim() + "%' OR cognome LIKE '%" + descCli.replace(/[^a-zA-Z ]/g, "").trim() + "%' OR ragSoc LIKE '%" + descCli.replace(/[^a-zA-Z ]/g, "").trim() + "%')";
          swWhere = false;
        } else {
          sqlOperation += " AND (nome LIKE '%" + descCli.replace(/[^a-zA-Z ]/g, "").trim() + "%' OR cognome LIKE '%" + descCli.replace(/[^a-zA-Z ]/g, "").trim() + "%' OR ragSoc LIKE '%" + descCli.replace(/[^a-zA-Z ]/g, "").trim() + "%')";
        }
      }
      if (cdFis != '') {
        if (swWhere) {
          sqlOperation += " WHERE (cdFis LIKE '%" + cdFis.replace(/[^a-zA-Z ]/g, "").trim() + "%' OR cdFis LIKE '%" + cdFis.replace(/[^a-zA-Z ]/g, "").trim() + "%')";
          swWhere = false;
        } else {
          sqlOperation += " AND (cdFis LIKE '%" + cdFis.replace(/[^a-zA-Z ]/g, "").trim() + "%' OR cdFis LIKE '%" + cdFis.replace(/[^a-zA-Z ]/g, "").trim() + "%')";
        }
      }
    }
  }

  logger.info('caricaListaCli: ' + sqlOperation + '<');
  // Esecuzione dell'operazione sql
  outCli = db.prepare(sqlOperation).all();

  return outCli;
}

// Lettura del primo codice libero per il cliente
function getNewCli(){
  logger.info('getNewCli');
  // Lettura ultimo cliente
  var sqlOperation = 'SELECT max(id) as id FROM clienti';

  logger.info('getNewCli: ' + sqlOperation + '<');
  var stmt = db.prepare(sqlOperation).get();
  var indice = stmt.id;
  // Incremento l'indice per inserire il nuovo cliente
  indice++;

  return indice;
}

// Caricamento lista parametri
function caricaListaParm(parametro, descrizione){
  var outParametri = new Array();
  let swWhere = true;

  // Lettura parametri
  var sqlOperation = 'SELECT id, codice, descrizione, valore FROM parametri';

  // Condizioni di estrazione
  if (parametro != '') {
      sqlOperation += " WHERE (codice LIKE '%" + parametro.replace(/[^a-zA-Z ]/g, "").trim() + "%' OR codice LIKE '%" + parametro.replace(/[^a-zA-Z ]/g, "").trim() + "%')";
      swWhere = false;
  }
  if (descrizione != '') {
    if (swWhere) {
      sqlOperation += " WHERE (descrizione LIKE '%" + descrizione.replace(/[^a-zA-Z ]/g, "").trim() + "%' OR descrizione LIKE '%" + descrizione.replace(/[^a-zA-Z ]/g, "").trim() + "%')";
      swWhere = false;
    } else {
      sqlOperation += " AND (descrizione LIKE '%" + descrizione.replace(/[^a-zA-Z ]/g, "").trim() + "%' OR descrizione LIKE '%" + descrizione.replace(/[^a-zA-Z ]/g, "").trim() + "%')";
    }
  }

  logger.info('caricaListaParm: ' + sqlOperation + '<');
  // Esecuzione operazione sql
  outParametri = db.prepare(sqlOperation).all();

  return outParametri;
}

// Inserimento parametro
function insParametro(parametro){
  logger.info('insParametro');
  var esito = {
    esito: 'OK',
    descErr: 'Parametro inserito correttamente!'
  };

  // inserimento parametro
  var sqlOperation = 'INSERT INTO parametri (id, codice, descrizione, valore) VALUES ((select max(id) + 1 FROM parametri), ?, ?, ?)';

  logger.info('insParametro: ' + sqlOperation + '<');
  try {
    var stmt = db.prepare(sqlOperation).run(parametro.codice, parametro.descrizione, parametro.valore);
  } catch (e) {
    logger.error('insParametro: ' + sqlOperation + '<');
    logger.error('  codice: ' + parametro.codice + '<');
    logger.error('  descrizione: ' + parametro.descrizione + '<');
    logger.error('  valore: ' + parametro.valore + '<');
    logger.error(e);
    esito.esito = 'KO';
    esito.descErr = 'Errore in inserimento parametro';
  }

  return esito;
}

// Aggiornamento parametro
function aggParametro(parametro){
  logger.info('aggParametro');
  var esito = {
    esito: 'OK',
    descErr: 'Parametro aggiornato correttamente!'
  };

  // aggiornamento parametro
  var sqlOperation = 'UPDATE parametri SET codice = ?, descrizione = ?, valore = ? WHERE id = ?';

  logger.info('aggParametro: ' + sqlOperation + '<');
  try {
    var stmt = db.prepare(sqlOperation).run(parametro.codice, parametro.descrizione, parametro.valore, parametro.id);
  } catch (e) {
    logger.error('aggParametro: ' + sqlOperation + '<');
    logger.error('  codice: ' + parametro.codice + '<');
    logger.error('  descrizione: ' + parametro.descrizione + '<');
    logger.error('  valore: ' + parametro.valore + '<');
    logger.error('  id: ' + parametro.id + '<');
    logger.error(e);
    esito.esito = 'KO';
    esito.descErr = 'Errore in aggiornamento parametro';
  }

  return esito;
}

// Cancellazione parametro
function cancParametro(indice){
  logger.info('cancParametro');
  var esito = {
    esito: 'OK',
    descErr: 'Parametro cancellato correttamente!'
  };

  var sqlOperation = 'DELETE FROM parametri WHERE id = ?';

  logger.info('cancParametro: ' + sqlOperation + '<');
  try {
    var stmt = db.prepare(sqlOperation).run(indice);
  } catch (e) {
    logger.error('cancParametro: ' + sqlOperation + '<');
    logger.error('  id: ' + indice + '<');
    logger.error(e);
    esito.esito = 'KO';
    esito.descErr = 'Errore in cancellazione parametro';
  }

  return esito;
}

// Caricamento lista opere
function caricaListaOpere(descrizione){
  logger.info('caricaListaOpere');
  var outOpere = new Array();

  // Lettura opere
  var sqlOperation = 'SELECT id, opera, descrizione, importo FROM opere';

  if (descrizione != '') {
    sqlOperation += " WHERE (opera LIKE '%" + descrizione.replace(/[^a-zA-Z ]/g, "").trim() + "%' OR descrizione LIKE '%" + descrizione.replace(/[^a-zA-Z ]/g, "").trim() + "%')";
  }

  logger.info('caricaListaOpere: ' + sqlOperation + '<');
  // outOpere = db.prepare(sqlOperation).all();
  var row = db.prepare(sqlOperation).all();

  // Scrittura dati e arricchimento opere
  for (var i = 0; i < row.length; i++) {

    outOpere[i] = {
      id : row[i].id,
      opera : row[i].opera,
      // lettura descrizioni
      descrizioni : db.prepare("SELECT descrizione FROM opereDescr WHERE idOpera = " + row[i].id + " ORDER BY progressivo").all(),
      importo : row[i].importo
      }
  }
  logger.info('outOpere: ' + util.inspect(outOpere) + '<');

  return outOpere;
}

// Lettura primo codice opera libero
function getNewOpera(){
  logger.info('getNewOpera');
  var sqlOperation = 'SELECT max(id) as id FROM opere';

  logger.info('getNewOpera: ' + sqlOperation + '<');
  var stmt = db.prepare(sqlOperation).get();
  var indice = stmt.id;
  // Incremento l'indice per inserire il nuovo cliente
  indice++;

  return indice;
}

// Lettura primo codice preventivo libero
function getNewPreventivo(){
  logger.info('getNewPreventivo');
  var sqlOperation = 'SELECT max(numero) as numero FROM preventivi WHERE anno = ?';

  logger.info('getNewPreventivo: ' + sqlOperation + '<');
  var stmt = db.prepare(sqlOperation).get(date.format(currentDate, 'YYYY'));
  var indice = stmt.numero;
  // Incremento l'indice per inserire il nuovo cliente
  indice++;
  var numero = {
    anno: date.format(currentDate, 'YYYY'),
    numero: indice,
    progr: date.format(currentDate, 'YYYY') + "-" + indice
  }

  return numero;
}

// Inserimento cliente
function insCliente(cliente){
  logger.info('insCliente');
  var esito = {
    esito: 'OK',
    descErr: 'Cliente inserito correttamente!'
  };

  // inserimento cliente
  var sqlOperation = 'INSERT INTO clienti (id, nome, cognome, ragSoc, cdFis, pIva, indirizzo, numCiv, cap, comune, provincia, tipoCli) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

  logger.info('insCliente: ' + sqlOperation + '<');
  try {
    if (cliente.tipoCli == 'P') {
      var stmt = db.prepare(sqlOperation).run(cliente.id, cliente.nome, cliente.cognome, '', cliente.cdFis, '', cliente.indirizzo, cliente.numCiv, cliente.cap, cliente.comune, cliente.provincia, cliente.tipoCli);
    } else {
      var stmt = db.prepare(sqlOperation).run(cliente.id, '', '', cliente.ragSoc, '', cliente.pIva, cliente.indirizzo, cliente.numCiv, cliente.cap, cliente.comune, cliente.provincia, cliente.tipoCli);
    }
  } catch (e) {
    logger.error('insCliente: ' + sqlOperation + '<');
    logger.error('  id: ' + cliente.id + '<');
    logger.error('  nome: ' + cliente.nome + '<');
    logger.error('  cognome: ' + cliente.cognome + '<');
    logger.error('  ragSoc: ' + cliente.ragSoc + '<');
    logger.error('  cdFis: ' + cliente.cdFis + '<');
    logger.error('  pIva: ' + cliente.pIva + '<');
    logger.error('  indirizzo: ' + cliente.indirizzo + '<');
    logger.error('  numCiv: ' + cliente.numCiv + '<');
    logger.error('  cap: ' + cliente.cap + '<');
    logger.error('  comune: ' + cliente.comune + '<');
    logger.error('  provincia: ' + cliente.provincia + '<');
    logger.error('  tipoCli: ' + cliente.tipoCli + '<');
    logger.error(e);
    esito.esito = 'KO';
    esito.descErr = 'Errore in inserimento cliente';
  }

  return esito;
}

// Aggiornamento cliente
function aggCliente(cliente){
  logger.info('aggCliente');

  var esito = {
    esito: 'OK',
    descErr: 'Cliente aggiornato correttamente!'
  };

  // aggiornamento cliente
  var sqlOperation = 'UPDATE clienti SET nome = ?, cognome = ?, ragSoc = ?, cdFis = ?, pIva = ?, indirizzo = ?, numCiv = ?, cap = ?, comune = ?, provincia = ?, tipoCli = ? WHERE id = ?';

  logger.info('aggCliente: ' + sqlOperation + '<');
  try {
    if (cliente.tipoCli == 'P') {
      var stmt = db.prepare(sqlOperation).run(cliente.nome, cliente.cognome, '', cliente.cdFis, '', cliente.indirizzo, cliente.numCiv, cliente.cap, cliente.comune, cliente.provincia, cliente.tipoCli, cliente.id);
    } else {
      var stmt = db.prepare(sqlOperation).run('', '', cliente.ragSoc, '', cliente.pIva, cliente.indirizzo, cliente.numCiv, cliente.cap, cliente.comune, cliente.provincia, cliente.tipoCli, cliente.id);
    }
  } catch (e) {
    logger.error('aggCliente: ' + sqlOperation + '<');
    logger.error('  nome: ' + cliente.nome + '<');
    logger.error('  cognome: ' + cliente.cognome + '<');
    logger.error('  ragSoc: ' + cliente.ragSoc + '<');
    logger.error('  cdFis: ' + cliente.cdFis + '<');
    logger.error('  pIva: ' + cliente.pIva + '<');
    logger.error('  indirizzo: ' + cliente.indirizzo + '<');
    logger.error('  numCiv: ' + cliente.numCiv + '<');
    logger.error('  cap: ' + cliente.cap + '<');
    logger.error('  comune: ' + cliente.comune + '<');
    logger.error('  provincia: ' + cliente.provincia + '<');
    logger.error('  tipoCli: ' + cliente.tipoCli + '<');
    logger.error('  id: ' + cliente.id + '<');
    logger.error(e);
    esito.esito = 'KO';
    esito.descErr = 'Errore in aggiornamento cliente';
  }

  return esito;
}

// Verifica cancellazione cliente
function cancCliente(indice){
  logger.info('cancCliente');
  var esito = {
    esito: 'OK',
    descErr: 'Cliente cancellato correttamente!'
  };

  var sqlOperation = 'DELETE FROM clienti WHERE id = ?';

  logger.info('cancCliente: ' + sqlOperation + '<');
  try {
    var stmt = db.prepare(sqlOperation).run(indice);
  } catch (e) {
    logger.error('cancCliente: ' + sqlOperation + '<');
    logger.error('  id: ' + indice + '<');
    logger.error(e);
    esito.esito = 'KO';
    esito.descErr = 'Errore in cancellazione cliente';
  }

  return esito;
}

// Inserimento opera
function insOpera(opera){
  logger.info('insOpera');

  var esito = {
    esito: 'OK',
    descErr: 'Opera inserita correttamente!'
  };

  // inserimento opera
  var sqlOperation = 'INSERT INTO opere (id, opera, importo) VALUES (?, ?, ?)';

  logger.info('insOpera: ' + sqlOperation + '<');
  try {
    var stmt = db.prepare(sqlOperation).run(opera.id, opera.opera, opera.importo);
  } catch (e) {
    logger.error('insOpera: ' + sqlOperation + '<');
    logger.error('  id: ' + opera.id + '<');
    logger.error('  opera: ' + opera.opera + '<');
    logger.error('  importo: ' + opera.importo + '<');
    logger.error(e);
    esito.esito = 'KO';
    esito.descErr = 'Errore in inserimento opera';
  }

  // inserimento descrizioni
  for (var i = 0; i < opera.descrizioni.length; i++) {
    var sqlOperation = 'INSERT INTO opereDescr (idOpera, progressivo, descrizione) VALUES (?, ?, ?)';

    logger.info('insOperaDescr: ' + sqlOperation + '<');
    try {
      var stmt = db.prepare(sqlOperation).run(opera.id, i, opera.descrizioni[i].descrizione);
    } catch (e) {
      logger.error('insOperaDescr: ' + sqlOperation + '<');
      logger.error('  id: ' + opera.id + '<');
      logger.error('  progressivo: ' + i + '<');
      logger.error('  descrizione: ' + opera.descrizioni[i] + '<');
      logger.error(e);
      esito.esito = 'KO';
      esito.descErr = 'Errore in inserimento descrizione opera';
    }
  }

  return esito;
}

// Aggiornamento opera
function aggOpera(opera){
  logger.info('aggOpera');

  var esito = {
    esito: 'OK',
    descErr: 'Opera aggiornata correttamente!'
  };

  // aggiornamento opera
  var sqlOperation = 'UPDATE opere SET opera = ?, descrizione = ?, importo = ? WHERE id = ? ';

  logger.info('aggOpera: ' + sqlOperation + '<');
  try {
    var stmt = db.prepare(sqlOperation).run(opera.opera, opera.descrizione, opera.importo, opera.id);
  } catch (e) {
    logger.error('aggOpera: ' + sqlOperation + '<');
    logger.error('  opera: ' + opera.opera + '<');
    logger.error('  descrizione: ' + opera.descrizione + '<');
    logger.error('  importo: ' + opera.importo + '<');
    logger.error('  id: ' + opera.id + '<');
    logger.error(e);
    esito.esito = 'KO';
    esito.descErr = 'Errore in aggiornamento opera';
  }

  return esito;
}

// Verifica cancellazione opera
function cancOpera(indice){
  logger.info('cancOpera');
  var esito = {
    esito: 'OK',
    descErr: 'Opera cancellata correttamente!'
  };

  var sqlOperation = 'DELETE FROM opere WHERE id = ?';

  logger.info('cancOpera: ' + sqlOperation + '<');
  try {
    var stmt = db.prepare(sqlOperation).run(indice);
  } catch (e) {
    logger.error('cancOpera: ' + sqlOperation + '<');
    logger.error('  id: ' + id + '<');
    logger.error(e);
    esito.esito = 'KO';
    esito.descErr = 'Errore in cancellazione opera';
  }

  var sqlOperation = 'DELETE FROM opereDescr WHERE idOpera = ?';

  logger.info('cancOpera: ' + sqlOperation + '<');
  try {
    var stmt = db.prepare(sqlOperation).run(indice);
  } catch (e) {
    logger.error('cancOpera: ' + sqlOperation + '<');
    logger.error('  idOpera: ' + id + '<');
    logger.error(e);
    esito.esito = 'KO';
    esito.descErr = 'Errore in cancellazione descrizioni opera';
  }

  return esito;
}

// Inserimento preventivo
function insPreventivo(prv){
  logger.info('insPreventivo');

  var esito = {
    esito: 'OK',
    descErr: 'Preventivo inserito correttamente!'
  };

  // inserimento preventivo
  var sqlOperation = 'INSERT INTO preventivi (numPrev, anno, numero, cliente, daFatt, cassaGeomPerc, cassaGeom, impon, ivaPerc, iva, art15, totFatt, swRitenuta, ritenutaPerc, ritenuta, impDaCorr, dataIns, dataMod) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

  logger.info('insPreventivo: ' + sqlOperation + '<');
  try {
    var stmt = db.prepare(sqlOperation).run(prv.numPrev, prv.anno, prv.numero, prv.cliente, prv.daFatt, prv.cassaGeomPerc, prv.cassaGeom, prv.impon, prv.ivaPerc, prv.iva,
                                            prv.art15, prv.totFatt, prv.swRitenuta, prv.ritenutaPerc, prv.ritenuta, prv.impDaCorr, prv.dataIns, prv.dataMod);
  } catch (e) {
    logger.error('insPreventivo: ' + sqlOperation + '<');
    logger.error('  numPrev: ' + prv.numPrev + '<');
    logger.error('  anno: ' + prv.anno + '<');
    logger.error('  numero: ' + prv.numero + '<');
    logger.error('  cliente: ' + prv.cliente + '<');
    logger.error('  daFatt: ' + prv.daFatt + '<');
    logger.error('  cassaGeomPerc: ' + prv.cassaGeomPerc + '<');
    logger.error('  cassaGeom: ' + prv.cassaGeom + '<');
    logger.error('  impon: ' + prv.impon + '<');
    logger.error('  ivaPerc: ' + prv.ivaPerc + '<');
    logger.error('  iva: ' + prv.iva + '<');
    logger.error('  art15: ' + prv.art15 + '<');
    logger.error('  totFatt: ' + prv.totFatt + '<');
    logger.error('  swRitenuta: ' + prv.swRitenuta + '<');
    logger.error('  ritenutaPerc: ' + prv.ritenutaPerc + '<');
    logger.error('  ritenuta: ' + prv.ritenuta + '<');
    logger.error('  impDaCorr: ' + prv.impDaCorr + '<');
    logger.error('  dataIns: ' + prv.dataIns + '<');
    logger.error('  dataMod: ' + prv.dataMod + '<');
    logger.error(e);
    esito.esito = 'KO';
    esito.descErr = 'Errore in inserimento preventivo';
  }

  return esito;
}

// Aggiornamento preventivo
function aggPreventivo(prv){
  logger.info('aggPreventivo');

  var esito = {
    esito: 'OK',
    descErr: 'Preventivo aggiornato correttamente!'
  };

  // aggiornamento preventivo
  var sqlOperation = 'UPDATE preventivi SET cliente = ?, daFatt = ?, cassaGeomPerc = ?, cassaGeom = ?, impon = ?, ivaPerc = ?, iva = ?, art15 = ?, totFatt = ?, swRitenuta = ?, ritenutaPerc = ?, ritenuta = ?, impDaCorr = ?, dataMod = ? WHERE numPrev = ? ';

  logger.info('aggPreventivo: ' + sqlOperation + '<');
  try {
    var stmt = db.prepare(sqlOperation).run(prv.cliente, prv.daFatt, prv.cassaGeomPerc, prv.cassaGeom, prv.impon, prv.ivaPerc, prv.iva, prv.art15, prv.totFatt, prv.swRitenuta, prv.ritenutaPerc, prv.ritenuta, prv.impDaCorr, prv.dataMod, prv.numPrev);
  } catch (e) {
    logger.error('aggPreventivo: ' + sqlOperation + '<');
    logger.error('  cliente: ' + prv.cliente + '<');
    logger.error('  daFatt: ' + prv.daFatt + '<');
    logger.error('  cassaGeomPerc: ' + prv.cassaGeomPerc + '<');
    logger.error('  cassaGeom: ' + prv.cassaGeom + '<');
    logger.error('  impon: ' + prv.impon + '<');
    logger.error('  ivaPerc: ' + prv.ivaPerc + '<');
    logger.error('  iva: ' + prv.iva + '<');
    logger.error('  art15: ' + prv.art15 + '<');
    logger.error('  totFatt: ' + prv.totFatt + '<');
    logger.error('  swRitenuta: ' + prv.swRitenuta + '<');
    logger.error('  ritenutaPerc: ' + prv.ritenutaPerc + '<');
    logger.error('  ritenuta: ' + prv.ritenuta + '<');
    logger.error('  impDaCorr: ' + prv.impDaCorr + '<');
    logger.error('  dataMod: ' + prv.dataMod + '<');
    logger.error('  numPrev: ' + prv.numPrev + '<');
    logger.error(e);
    esito.esito = 'KO';
    esito.descErr = 'Errore in aggiornamento preventivo';
  }

  return esito;
}

// Verifica cancellazione preventivo
function cancPreventivo(numPrev){
  logger.info('cancPreventivo');
  var esito = {
    esito: 'OK',
    descErr: 'Preventivo cancellato correttamente!'
  };

  var sqlOperation = 'DELETE FROM preventivi WHERE numPrev = ?';

  logger.info('cancPreventivo: ' + sqlOperation + '<');
  try {
    var stmt = db.prepare(sqlOperation).run(numPrev);
  } catch (e) {
    logger.error('cancPreventivo: ' + sqlOperation + '<');
    logger.error('  numPrev: ' + numPrev + '<');
    logger.error(e);
    esito.esito = 'KO';
    esito.descErr = 'Errore in cancellazione preventivo';
  }

  var sqlOperation = 'DELETE FROM operePreventivi WHERE numPrev = ?';

  logger.info('cancPreventivo: ' + sqlOperation + '<');
  try {
    var stmt = db.prepare(sqlOperation).run(numPrev);
  } catch (e) {
    logger.error('cancPreventivo: ' + sqlOperation + '<');
    logger.error('  numPrev: ' + numPrev + '<');
    logger.error(e);
    esito.esito = 'KO';
    esito.descErr = 'Errore in cancellazione opere preventivo';
  }

  var sqlOperation = 'DELETE FROM opereDescrPreventivi WHERE numPrev = ?';

  logger.info('cancPreventivo: ' + sqlOperation + '<');
  try {
    var stmt = db.prepare(sqlOperation).run(numPrev);
  } catch (e) {
    logger.error('cancPreventivo: ' + sqlOperation + '<');
    logger.error('  numPrev: ' + numPrev + '<');
    logger.error(e);
    esito.esito = 'KO';
    esito.descErr = 'Errore in cancellazione descrizioni opere preventivo';
  }

  return esito;
}

// Inserimento opere preventivo
function insOperaPrev(opera, numPrev, idOperaKey){
  logger.info('insOperaPrev');

  var esito = {
    esito: 'OK',
    descErr: 'Opera del preventivo inserita correttamente!'
  };

  // inserimento preventivo
  var sqlOperation = 'INSERT INTO operePreventivi (id, opera, descrizione, importo, numPrev, idOperaKey) VALUES (?, ?, ?, ?, ?, ?)';

  logger.info('insOperaPrev: ' + sqlOperation + '<');
  try {
    var stmt = db.prepare(sqlOperation).run(opera.id, opera.opera, '', opera.importo, numPrev, idOperaKey);
  } catch (e) {
    logger.error('insOperaPrev: ' + sqlOperation + '<');
    logger.error('  id: ' + opera.id + '<');
    logger.error('  opera: ' + opera.opera + '<');
    logger.error('  importo: ' + opera.importo + '<');
    logger.error('  numPrev: ' + numPrev + '<');
    logger.error('  idOperaKey: ' + idOperaKey + '<');
    logger.error(e);
    esito.esito = 'KO';
    esito.descErr = 'Errore in inserimento opera del preventivo';
  }

  // inserimento descrizioni
  for (var i = 0; i < opera.descrizioni.length; i++) {
    var sqlOperation = 'INSERT INTO opereDescrPreventivi (idOpera, progressivo, descrizione, numPrev) VALUES (?, ?, ?, ?)';

    logger.info('insOperaPrev: ' + sqlOperation + '<');
    try {
      var stmt = db.prepare(sqlOperation).run(idOperaKey, i, opera.descrizioni[i].descrizione, numPrev);
    } catch (e) {
      logger.error('insOperaPrev: ' + sqlOperation + '<');
      logger.error('  id: ' + idOperaKey + '<');
      logger.error('  progressivo: ' + i + '<');
      logger.error('  descrizione: ' + opera.descrizioni[i] + '<');
      logger.error('  numPrev: ' + numPrev + '<');
      logger.error(e);
      esito.esito = 'KO';
      esito.descErr = 'Errore in inserimento descrizione opera del preventivo';
    }
  }

  return esito;
}

// Verifica cancellazione preventivo
function cancOperePrev(numPrev){
  logger.info('cancOperePrev');

  var esito = {
    esito: 'OK',
    descErr: 'Opere del preventivo cancellate correttamente!'
  };

  var sqlOperation = 'DELETE FROM operePreventivi WHERE numPrev = ?';

  logger.info('cancOperePrev: ' + sqlOperation + '<');
  try {
    var stmt = db.prepare(sqlOperation).run(numPrev);
  } catch (e) {
    logger.error('cancOperePrev: ' + sqlOperation + '<');
    logger.error('  numPrev: ' + numPrev + '<');
    logger.error(e);
    esito.esito = 'KO';
    esito.descErr = 'Errore in cancellazione opere del preventivo';
  }

  // Cancellazione descrizioni opere
  var sqlOperation = 'DELETE FROM opereDescrPreventivi WHERE numPrev = ?';

  logger.info('cancOperePrev 2: ' + sqlOperation + '<');
  try {
    var stmt = db.prepare(sqlOperation).run(numPrev);
  } catch (e) {
    logger.error('cancOperePrev 2: ' + sqlOperation + '<');
    logger.error('  numPrev: ' + numPrev + '<');
    logger.error(e);
    esito.esito = 'KO';
    esito.descErr = 'Errore in cancellazione descrizioni opere del preventivo';
  }

  return esito;
}

// Lettura statistiche
function caricaStats(){
  logger.info('caricaStats');
  var outStats = new Array();

  // Lettura opere
  var sqlOperation = 'SELECT daFatt, totFatt, anno, mese FROM statistiche_view';

  logger.info('caricaStats: ' + sqlOperation + '<');
  outStats = db.prepare(sqlOperation).all();

  return outStats;
}
// FINE OPERAZIONI DB

// FUNZIONI
// Esportazione del backup
function esportaDB(dir){
  logger.info('esportaDB');

  var esito = {
    esito: 'OK',
    descErr: 'Esportazione database effettuata correttamente!'
  };

  // let dtSave = new Date();
  let tsBackup = date.format(new Date(), 'YYYYMMDD-HHmmss');

  let dbInp = path.join(__dirname, '/db/preventivi.db');
  let dbOut = dir + '/preventivi-' + tsBackup + '.db';

  try {
    fsExtra.copySync(dbInp, dbOut);
  } catch (e) {
    logger.error('esportaDB');
    logger.error('  pathI: ' + dbInp);
    logger.error('  pathO: ' + dbOut);
    logger.error(e);
    esito.esito = 'KO';
    esito.descErr = 'Errore in esportazione database'
  }

  return esito;
}

// backup database
function backupDB(){
  logger.info('backupDB');

  var esito = {
    esito: 'OK',
    descErr: 'Backup effettuato correttamente!'
  };

  let tsBackup = date.format(new Date(), 'YYYYMMDD-HHmmss');

  let dbInp = path.join(__dirname, '/db/preventivi.db');
  let dbOut = path.join(__dirname, '/db/backup/preventivi-' + tsBackup + '.db');

  // Tengo solo n copie di backup
  const directory = path.join(__dirname, 'db/backup');

  fs.readdir(directory, (err, files) => {
    if (err) {
      logger.error(err);
      throw err;
    }

    files.sort();
    files.reverse();

    let parametri = caricaListaParm('numBackup', '');
    if (parametri.length === 1) {
      numBackup = parametri[0].valore;
    }

    for (var i = files.length; i >= numBackup; i--) {
      fs.unlink(path.join(directory, files[i-1]), err => {
        logger.info('unlink');
        if (err) throw err;
      });
    }
  });

  try {
    fsExtra.copySync(dbInp, dbOut);
  } catch (e) {
    logger.error('backupDB');
    logger.error('  pathI: ' + dbInp);
    logger.error('  pathO: ' + dbOut);
    logger.error(e);
    esito.esito = 'KO';
    esito.descErr = 'Errore in backup database'
  }

  logger.info(util.inspect(esito));

  return esito;
}

// Creazione pdf
function stampaPdf(dati, nomePdf){
  logger.info('stampaPdf');

  var esito = {
    esito: 'OK',
    descErr: 'Aprire ' + nomePdf + '.html per effettuare la stampa del PDF',
    path: ''
  };

  let pathFile = path.join(__dirname, '/tmpPdf/' + nomePdf + '.html');
  esito.path = pathFile;

  mkdirp(getDirName(pathFile), function (err) {
    if (err) {
      logger.error(err);
      esito.esito = 'KO';
      esito.descErr = 'Errore in creazione PDF';
      return cb(err);
    }

    try {
      fs.writeFileSync(pathFile, dati, 'utf-8');
    } catch (e) {
      logger.error(e);
      esito.esito = 'KO';
      esito.descErr = 'Errore in creazione PDF';
    }
  });

  return esito;
}

// TODO: Finire la scrittura su pdf https://www.npmjs.com/package/phantom-html-to-pdf
// function stampaPdf2(dati, nomePdf){
//   logger.info('stampaPdf2');
//   logger.warn(util.inspect(dati));
//   logger.warn(nomePdf);
//
//   let header = '<div id="header" class="container"><div class="row"><span class="col-1"><img id="logo"></span><span id="descr" class="col-10"><h4 id="soc"></h4></span><span class="col-1"></span></div></div>';
//   let footer = '<div id="footer" class="container"><div id="row1" class="row"><span id="indir"></span>&nbsp;-&nbsp;Tel.&nbsp;<span id="tel"></span>&nbsp;-&nbsp;Fax&nbsp;<span id="fax"></span></div><div id="row2" class="row">P.IVA&nbsp;<span id="piva"></span>&nbsp;-&nbsp;e-mail:&nbsp;<span id="email"></span>&nbsp;-&nbsp;sito&nbsp;web:&nbsp;<span id="sito"></span></div></div>';
//
//   var esito = {
//     esito: 'OK',
//     descErr: 'Pdf creato correttamente',
//     path: ''
//   };
//
//   let pathFile = path.join(__dirname, '/Pdf/' + nomePdf + '.pdf');
//   esito.path = pathFile;
//
//   mkdirp(getDirName(pathFile), function (err) {
//     logger.warn('mkdirp');
//     if (err) {
//       logger.error(err);
//       return cb(err);
//     }
//
//     var conversion = require("phantom-html-to-pdf")({
//       // tmpDir: "os/tmpdir",
//       // phantomPath: require("phantomjs-prebuilt").path
//     });
//
//     conversion({
//       html: "<h1>Hello World</h1>",
//       header: header,
//       footer: footer,
//       allowLocalFilesAccess: true
//     }, function (err, pdf){
//       var output = fs.createWriteStream(pathFile);
//       // console.log(util.inspect(pdf));
//       // console.log(pdf.logs);
//       // console.log(pdf.numberOfPages);
//       // pdf.stream.pipe(output);
//     });
//
//
//     // try {
//     //   fs.writeFileSync(pathFile, dati, 'utf-8');
//     //   logger.warn('file creato');
//     // } catch (e) {
//     //   logger.error(e);
//     //   esito.esito = 'KO';
//     //   esito.descErr = 'Errore in creazione PDF';
//     // }
//   });
//
//   return esito;
// }
// FINE FUNZIONI

// IPCMAIN
// Catch tab-lisPrev:carica
ipcMain.on('tab-lisPrev:carica', function(e){
  logger.info('tab-lisPrev:carica');
  jobsQuotesW.webContents.send('tab-lisPrev:carica', caricaListaPrev('','',''));
});

// Catch tab-lisPrev:aggiorna
ipcMain.on('tab-lisPrev:aggiorna', function(e, anno, cliente, opera){
  logger.info('tab-lisPrev:aggiorna');
  logger.info('tab-lisPrev:aggiorna' + anno + cliente + opera);
  jobsQuotesW.webContents.once('did-finish-load', () => {
    jobsQuotesW.webContents.send('tab-lisPrev:caricaFiltri', caricaAnni(), anno, caricaCliPrev(), cliente, caricaOperePrev(), opera);
    jobsQuotesW.webContents.send('tab-lisPrev:aggiorna', caricaListaPrev(anno, cliente, opera), anno, cliente, opera);
  });
});

// Catch tab-lisCli:carica
ipcMain.on('tab-lisCli:carica', function(e, tipo, id, descCli, cdFis){
  logger.info('tab-lisCli:carica');
  clientsListW.webContents.send('tab-lisCli:carica', caricaListaCli('', '', '', ''));
});

// Catch tab-lisCli:carica
ipcMain.on('tab-lisCli:aggiorna', function(e, tipo, id, descCli, cdFis){
  logger.info('tab-lisCli:aggiorna');
  clientsListW.webContents.once('did-finish-load', () => {
    clientsListW.webContents.send('tab-lisCli:aggiorna', caricaListaCli(tipo, id, descCli, cdFis), tipo, id, descCli, cdFis);
  });
});

// Catch tab-lisParm:carica
ipcMain.on('tab-lisParm:carica', function(e){
  logger.info('tab-lisParm:carica');
  parmsListW.webContents.send('tab-lisParm:carica', caricaListaParm('', ''));
});

// Catch tab-lisParm:aggiorna
ipcMain.on('tab-lisParm:aggiorna', function(e, parametro, descrizione){
  logger.info('tab-lisParm:aggiorna');
  parmsListW.webContents.once('did-finish-load', () => {
    parmsListW.webContents.send('tab-lisParm:aggiorna', caricaListaParm(parametro, descrizione), parametro, descrizione);
  });
});

// Catch tab-lisOpere:carica
ipcMain.on('tab-lisOpere:carica', function(e){
  logger.info('tab-lisOpere:carica');
  worksListW.webContents.send('tab-lisOpere:carica', caricaListaOpere(''));
});

// Catch tab-lisOpere:aggiorna
ipcMain.on('tab-lisOpere:aggiorna', function(e, descrizione){
  logger.info('tab-lisOpere:aggiorna');
  worksListW.webContents.once('did-finish-load', () => {
    worksListW.webContents.send('tab-lisOpere:aggiorna', caricaListaOpere(descrizione), descrizione);
  });
});

// Catch nuovoParametro
ipcMain.on('nuovoParametro', function(e){
  logger.info('nuovoParametro');
  createParameterManagement();
  parmMngmntW.webContents.once('did-finish-load', () => {
    parmMngmntW.webContents.send('nuovoParametro');
  });
});

// Catch modificaParametro
ipcMain.on('modificaParametro', function(e, parametro){
  logger.info('modificaParametro');
  createParameterManagement();
  parmMngmntW.webContents.once('did-finish-load', () => {
    parmMngmntW.webContents.send('modificaParametro', parametro);
  });
});

// Catch inserisciParametro
ipcMain.on('inserisciParametro', function(e, parametro, indice, parmFilt, descParm){
  logger.info('inserisciParametro');
  esito = insParametro(parametro);
  // chiudo finestra parametri
  parmMngmntW.close();
  cliMngmntW = null;
  // chiudo finestra conferma
  confirmMngmntW.close();
  confirmMngmntW = null;
  parmsListW.webContents.send('tab-lisParm:carica', caricaListaParm('', ''));
  parmsListW.webContents.send('esitoOpParametri', esito);
});

// Catch inserisciParametro
ipcMain.on('aggiornaParametro', function(e, parametro, indice, parmFilt, descParm){
  logger.info('aggiornaParametro');
  esito = aggParametro(parametro);
  // chiudo finestra parametri
  parmMngmntW.close();
  cliMngmntW = null;
  // chiudo finestra conferma
  confirmMngmntW.close();
  confirmMngmntW = null;
  parmsListW.webContents.send('tab-lisParm:carica', caricaListaParm('', ''));
  parmsListW.webContents.send('esitoOpParametri', esito);
});

// Catch cancellaParametro
ipcMain.on('cancellaParametro', function(e, parametro, indice, tipo, id, descCli, cdFis, descOpera, parmFilt, descParm){
  logger.info('cancellaParametro');
  esito = cancParametro(indice);
  // chiudo finestra conferma
  confirmMngmntW.close();
  confirmMngmntW = null;
  parmsListW.webContents.send('tab-lisParm:aggiorna', caricaListaParm(parmFilt, descParm), parmFilt, descParm);
  parmsListW.webContents.send('esitoOpParametri', esito);
});

// Catch conferma
ipcMain.on('confermaInsParametro', function(e, testata, descrizione, btnConf, tipoOperazione, dati){
  logger.info('confermaInsParametro');
  createConfirmManagement();
  confirmMngmntW.webContents.once('did-finish-load', () => {
    confirmMngmntW.webContents.send('confermaInsParametro', testata, descrizione, btnConf, tipoOperazione, dati);
  });
});

// Catch conferma
ipcMain.on('confermaAggParametro', function(e, testata, descrizione, btnConf, tipoOperazione, dati){
  logger.info('confermaAggParametro');
  createConfirmManagement();
  confirmMngmntW.webContents.once('did-finish-load', () => {
    confirmMngmntW.webContents.send('confermaAggParametro', testata, descrizione, btnConf, tipoOperazione, dati);
  });
});
// Catch conferma
ipcMain.on('confermaCancParametro', function(e, testata, descrizione, btnConf, tipoOperazione, dati, indice, parametro, descrizioneFilt){
  logger.info('confermaCancParametro');
  createConfirmManagement();
  confirmMngmntW.webContents.once('did-finish-load', () => {
    confirmMngmntW.webContents.send('confermaCancParametro', testata, descrizione, btnConf, tipoOperazione, indice, parametro, descrizioneFilt);
  });
});

// Catch nuovoCliente
ipcMain.on('nuovoCliente', function(e){
  logger.info('nuovoCliente');
  createClientManagement();
  cliMngmntW.webContents.once('did-finish-load', () => {
    cliMngmntW.webContents.send('nuovoCliente', getNewCli());
  });
});

// Catch nuovoClientePrev
ipcMain.on('nuovoClientePrev', function(e){
  logger.info('nuovoClientePrev');
  createClientManagement();
  cliMngmntW.webContents.once('did-finish-load', () => {
    cliMngmntW.webContents.send('nuovoClientePrev', getNewCli());
  });
});

// Catch modificaCliente
ipcMain.on('modificaCliente', function(e, cliente){
  logger.info('modificaCliente');
  createClientManagement();
  cliMngmntW.webContents.once('did-finish-load', () => {
    cliMngmntW.webContents.send('modificaCliente', cliente);
  });
});

// Catch inserisciCliente
ipcMain.on('inserisciCliente', function(e, cliente, indice, tipo, id, descCli, cdFis){
  logger.info('inserisciCliente');
  esito = insCliente(cliente);
  // chiudo finestra clienti
  cliMngmntW.close();
  cliMngmntW = null;
  // chiudo finestra conferma
  confirmMngmntW.close();
  confirmMngmntW = null;
  clientsListW.webContents.send('tab-lisCli:carica', caricaListaCli('', '', '', ''));
  clientsListW.webContents.send('esitoOpCli', esito);
});

// Catch inserisciCliente
ipcMain.on('inserisciClientePrev', function(e, cliente, indice, tipo, id, descCli, cdFis){
  logger.info('inserisciClientePrev');
  esito = insCliente(cliente);
  // chiudo finestra clienti
  cliMngmntW.close();
  cliMngmntW = null;
  // chiudo finestra conferma
  confirmMngmntW.close();
  confirmMngmntW = null;
  jobQuoteMngmntW.webContents.send('prv:listaCli', caricaListaCli('', '', '', ''));
  jobQuoteMngmntW.webContents.send('aggiornaCli', cliente);
});

// Catch inserisciCliente
ipcMain.on('aggiornaCliente', function(e, cliente, indice, tipo, id, descCli, cdFis){
  logger.info('aggiornaCliente');
  esito = aggCliente(cliente);
  // chiudo finestra clienti
  cliMngmntW.close();
  cliMngmntW = null;
  // chiudo finestra conferma
  confirmMngmntW.close();
  confirmMngmntW = null;
  clientsListW.webContents.send('tab-lisCli:carica', caricaListaCli('', '', '', ''));
  clientsListW.webContents.send('esitoOpCli', esito);
});

// Catch cancellaCliente
ipcMain.on('cancellaCliente', function(e, cliente, indice, tipo, id, descCli, cdFis){
  logger.info('cancellaCliente');
  esito = cancCliente(indice);
  // chiudo finestra conferma
  confirmMngmntW.close();
  confirmMngmntW = null;
  clientsListW.webContents.send('tab-lisCli:aggiorna', caricaListaCli(tipo, id, descCli, cdFis), tipo, id, descCli, cdFis);
  clientsListW.webContents.send('esitoOpCli', esito);
});

// Catch nuovaOpera
ipcMain.on('nuovaOpera', function(e){
  logger.info('nuovaOpera');
  createWorkManagementW();
  workMngmntW.webContents.once('did-finish-load', () => {
    workMngmntW.webContents.send('nuovaOpera', getNewOpera());
  });
});

// Catch nuovaOperaPrev
ipcMain.on('nuovaOperaPrev', function(e){
  logger.info('nuovaOperaPrev');
  createWorkManagementW();
  workMngmntW.webContents.once('did-finish-load', () => {
    workMngmntW.webContents.send('nuovaOperaPrev', getNewOpera());
  });
});

// Catch modifica opera
ipcMain.on('modificaOpera', function(e, opera){
  logger.info('modificaOpera');
  createWorkManagementW();
  workMngmntW.webContents.once('did-finish-load', () => {
    workMngmntW.webContents.send('modificaOpera', opera);
  });
});

// Catch modifica opera preventivo
ipcMain.on('modificaOperaPrev', function(e, opera, indice){
  logger.info('modificaOperaPrev');
  createWorkManagementW();
  workMngmntW.webContents.once('did-finish-load', () => {
    workMngmntW.webContents.send('modificaOperaPrev', opera, indice);
  });
});

// Catch modifica opera
ipcMain.on('selezionaOpera', function(e, opera){
  logger.info('selezionaOpera');
  createWorkManagementW();
  workMngmntW.webContents.once('did-finish-load', () => {
    workMngmntW.webContents.send('selezionaOpera', opera);
  });
});

// Catch inserisciOpera
ipcMain.on('inserisciOpera', function(e, opera, indice, tipo, id, descCli, cdFis, descOpera){
  logger.info('inserisciOpera');
  esito = insOpera(opera);
  // chiudo finestra opera
  workMngmntW.close();
  workMngmntW = null;
  // chiudo finestra conferma
  confirmMngmntW.close();
  confirmMngmntW = null;
  worksListW.webContents.send('tab-lisOpere:carica', caricaListaOpere(''));
  worksListW.webContents.send('esitoOpOpere', esito);
});

// Catch inserisciOperaPrev
ipcMain.on('inserisciOperaPrev', function(e, opera, indice, tipo, id, descCli, cdFis, descOpera){
  logger.info('inserisciOperaPrev');
  esito = insOpera(opera);
  // chiudo finestra clienti
  workMngmntW.close();
  workMngmntW = null;
  // chiudo finestra conferma
  confirmMngmntW.close();
  confirmMngmntW = null;
  jobQuoteMngmntW.webContents.send('prv:listaOpere', caricaListaOpere(''));
  jobQuoteMngmntW.webContents.send('caricaOpera', opera);
});

// Catch inserisciCliente
ipcMain.on('aggiornaOpera', function(e, opera, indice, tipo, id, descCli, cdFis, descOpera){
  logger.info('aggiornaOpera');
  esito = aggOpera(opera);
  // chiudo finestra opera
  workMngmntW.close();
  workMngmntW = null;
  // chiudo finestra conferma
  confirmMngmntW.close();
  confirmMngmntW = null;
  worksListW.webContents.send('tab-lisOpere:carica', caricaListaOpere(''));
  worksListW.webContents.send('esitoOpOpere', esito);
});

// Catch carica opera su preventivo
ipcMain.on('caricaOpera', function(e, opera, indice, tipo, id, descCli, cdFis, descOpera){
  logger.info('caricaOpera');
  // chiudo finestra opera
  workMngmntW.close();
  workMngmntW = null;
  // chiudo finestra conferma
  confirmMngmntW.close();
  confirmMngmntW = null;
  jobQuoteMngmntW.webContents.send('caricaOpera', opera);
});

// Catch carica opera su preventivo
ipcMain.on('aggiornaOperaPrev', function(e, opera, indice, tipo, id, descCli, cdFis, descOpera){
  logger.info('aggiornaOperaPrev');

  // chiudo finestra opera
  workMngmntW.close();
  workMngmntW = null;
  // chiudo finestra conferma
  confirmMngmntW.close();
  confirmMngmntW = null;
  jobQuoteMngmntW.webContents.send('aggiornaOperaPrev', opera, indice);
});

// Catch cancellaCliente
ipcMain.on('cancellaOpera', function(e, opera, indice, tipo, id, descCli, cdFis, descOpera){
  logger.info('cancellaOpera');
  esito = cancOpera(indice);
  // chiudo finestra conferma
  confirmMngmntW.close();
  confirmMngmntW = null;
  worksListW.webContents.send('tab-lisOpere:aggiorna', caricaListaOpere(descOpera), descOpera);
  worksListW.webContents.send('esitoOpOpere', esito);
});

// Catch nuovoPreventivo
ipcMain.on('nuovoPreventivo', function(e){
  logger.info('nuovoPreventivo');
  createJobQuoteW();
  jobQuoteMngmntW.webContents.once('did-finish-load', () => {
    jobQuoteMngmntW.webContents.send('prv:listaParm',caricaListaParm('', ''));
    jobQuoteMngmntW.webContents.send('nuovoPreventivo', getNewPreventivo());
    jobQuoteMngmntW.webContents.send('prv:listaCli',caricaListaCli('', '', '', ''));
    jobQuoteMngmntW.webContents.send('prv:listaOpere',caricaListaOpere(''));
  });
});

// Catch clonaPreventivo
ipcMain.on('clonaPreventivo', function(e, preventivo){
  logger.info('clonaPreventivo');
  createJobQuoteW();
  jobQuoteMngmntW.webContents.once('did-finish-load', () => {
    jobQuoteMngmntW.webContents.send('prv:listaParm',caricaListaParm('', ''));
    jobQuoteMngmntW.webContents.send('clonaPreventivo', preventivo, getNewPreventivo());
    jobQuoteMngmntW.webContents.send('prv:listaCli',caricaListaCli('', '', '', ''));
    jobQuoteMngmntW.webContents.send('prv:listaOpere',caricaListaOpere(''));
  });
});

// Catch modificaPreventivo
ipcMain.on('modificaPreventivo', function(e, preventivo){
  logger.info('modificaPreventivo');
  createJobQuoteW();
  jobQuoteMngmntW.webContents.once('did-finish-load', () => {
    jobQuoteMngmntW.webContents.send('prv:listaParm',caricaListaParm('', ''));
    jobQuoteMngmntW.webContents.send('modificaPreventivo', preventivo);
    jobQuoteMngmntW.webContents.send('prv:listaCli',caricaListaCli('', '', '', ''));
    jobQuoteMngmntW.webContents.send('prv:listaOpere',caricaListaOpere(''));
  });
});

// Catch creaPdf
ipcMain.on('creaPdf', function(e, preventivo){
  logger.info('creaPdf');
  createPdf();
  pdfW.webContents.once('did-finish-load', () => {
    pdfW.webContents.send('pdf:carica', getPrev(preventivo.numPrev), caricaListaParm('', ''), path.join(__dirname, '/ico/logo.png'));
  });
});

// Catch stampaPdf
ipcMain.on('stampaPdf', function(e, dati, nomePdf){
  logger.info('stampaPdf');
  let esito = stampaPdf(dati, nomePdf);
  // let esito2 = stampaPdf2(dati, nomePdf);

  logger.info(util.inspect(esito));
  if (esito.esito === 'OK') {
    // Apro il folder dove ho salvato il pdf da stampare
    shell.showItemInFolder(esito.path);
    jobsQuotesW.webContents.send('esitoOpPreventivo', esito);
  }
});

// Catch scarica Pdf
// ipcMain.on('scaricaPdf', function(e, preventivo){
//   logger.info('scaricaPdf');
//   stampaPdf();
// });

// Catch inserisciPreventivo
ipcMain.on('inserisciPreventivo', function(e, preventivo){
  logger.info('inserisciPreventivo');
  esito = insPreventivo(preventivo);
  var esitoComodo = {esito: 'OK', descrizione: ''};
  // carica opere
  if (esito.esito == 'OK') {
    for (var i = 0; i < preventivo.opera.length; i++) {
      if (preventivo.opera[i]) {
        logger.info('inserisco opera');
        esitoComodo = insOperaPrev(preventivo.opera[i], preventivo.numPrev, i);
      }
    }
    if (esitoComodo.esito != 'OK') {
      esito = esitoComodo;
    }
  }
  // chiudo finestra parametri
  jobQuoteMngmntW.close();
  jobQuoteMngmntW = null;
  // chiudo finestra conferma
  confirmMngmntW.close();
  confirmMngmntW = null;
  jobsQuotesW.webContents.send('tab-lisPrev:carica', caricaListaPrev('','',''));
  jobsQuotesW.webContents.send('esitoOpPreventivo', esito);
});

// Catch aggiornaPreventivo
ipcMain.on('aggiornaPreventivo', function(e, preventivo){
  logger.info('aggiornaPreventivo');
  var esitoComodo;
  esito = aggPreventivo(preventivo);
  // carica opere
  if (esito.esito == 'OK') {
    esitoComodo = cancOperePrev(preventivo.numPrev);
    if (esitoComodo.esito == 'OK') {
      for (var i = 0; i < preventivo.opera.length; i++) {
        if (preventivo.opera[i]) {
          esitoComodo = insOperaPrev(preventivo.opera[i], preventivo.numPrev, i);
        }
      }
    }
    if (esitoComodo.esito != 'OK') {
      esito = esitoComodo;
    }
  }
  // chiudo finestra preventivo
  jobQuoteMngmntW.close();
  jobQuoteMngmntW = null;
  // chiudo finestra conferma
  confirmMngmntW.close();
  confirmMngmntW = null;
  jobsQuotesW.webContents.send('tab-lisPrev:carica', caricaListaPrev('','',''), preventivo.numPrev);
  jobsQuotesW.webContents.send('esitoOpPreventivo', esito);
});

// Catch inserisciPrev+pdf
ipcMain.on('inserisciPrev+pdf', function(e, preventivo){
  logger.info('inserisciPrev+pdf');
  esito = insPreventivo(preventivo);
  var esitoComodo = {esito: 'OK', descrizione: ''};
  // carica opere
  if (esito.esito == 'OK') {
    for (var i = 0; i < preventivo.opera.length; i++) {
      if (preventivo.opera[i]) {
        logger.info('inserisco opera');
        esitoComodo = insOperaPrev(preventivo.opera[i], preventivo.numPrev, i);
      }
    }
    if (esitoComodo.esito != 'OK') {
      esito = esitoComodo;
    }
  }
  // chiudo finestra parametri
  jobQuoteMngmntW.close();
  jobQuoteMngmntW = null;
  // chiudo finestra conferma
  confirmMngmntW.close();
  confirmMngmntW = null;
  jobsQuotesW.webContents.send('tab-lisPrev:carica', caricaListaPrev('','',''));
  jobsQuotesW.webContents.send('esitoOpPreventivo', esito);

  createPdf();
  pdfW.webContents.once('did-finish-load', () => {
    pdfW.webContents.send('pdf:carica', getPrev(preventivo.numPrev), caricaListaParm('', ''), path.join(__dirname, '/ico/logo.png'));
  });
});

// Catch aggiornaPrev+pdf
ipcMain.on('aggiornaPrev+pdf', function(e, preventivo){
  logger.info('aggiornaPrev+pdf');
  var esitoComodo;
  esito = aggPreventivo(preventivo);
  // carica opere
  if (esito.esito == 'OK') {
    esitoComodo = cancOperePrev(preventivo.numPrev);
    if (esitoComodo.esito == 'OK') {
      for (var i = 0; i < preventivo.opera.length; i++) {
        if (preventivo.opera[i]) {
          esitoComodo = insOperaPrev(preventivo.opera[i], preventivo.numPrev, i);
        }
      }
    }
    if (esitoComodo.esito != 'OK') {
      esito = esitoComodo;
    }
  }
  // chiudo finestra preventivo
  jobQuoteMngmntW.close();
  jobQuoteMngmntW = null;
  // chiudo finestra conferma
  confirmMngmntW.close();
  confirmMngmntW = null;
  jobsQuotesW.webContents.send('tab-lisPrev:carica', caricaListaPrev('','',''), preventivo.numPrev);
  jobsQuotesW.webContents.send('esitoOpPreventivo', esito);

  // Create pdf
  createPdf();
  pdfW.webContents.once('did-finish-load', () => {
    pdfW.webContents.send('pdf:carica', getPrev(preventivo.numPrev), caricaListaParm('', ''), path.join(__dirname, '/ico/logo.png'));
  });
  // createPdf();
  // pdfW.webContents.once('did-finish-load', () => {
  //   pdfW.webContents.send('pdf:carica', preventivo, caricaListaParm('', ''), path.join(__dirname, '/ico/logo.png'));
  // });
});

// Catch cancellaPreventivo
ipcMain.on('cancellaPreventivo', function(e, preventivo, indice, tipo, id, descCli, cdFis, descOpera, parmFilt, descParm, anno, cliente, opera){
  logger.info('cancellaPreventivo');
  esito = cancPreventivo(indice);
  // chiudo finestra conferma
  confirmMngmntW.close();
  confirmMngmntW = null;
  jobsQuotesW.webContents.send('tab-lisPrev:aggiorna', caricaListaPrev(anno, cliente, opera), anno, cliente, opera);
  jobsQuotesW.webContents.send('esitoOpPreventivo', esito);
});


// Catch conferma
ipcMain.on('confermaInsPreventivo', function(e, testata, descrizione, btnConf, tipoOperazione, dati){
  logger.info('confermaInsPreventivo');
  createConfirmManagement();
  confirmMngmntW.webContents.once('did-finish-load', () => {
    confirmMngmntW.webContents.send('confermaInsPreventivo', testata, descrizione, btnConf, tipoOperazione, dati);
  });
});

// Catch conferma
ipcMain.on('confermaAggPreventivo', function(e, testata, descrizione, btnConf, tipoOperazione, dati){
  logger.info('confermaAggPreventivo');
  createConfirmManagement();
  confirmMngmntW.webContents.once('did-finish-load', () => {
    confirmMngmntW.webContents.send('confermaAggPreventivo', testata, descrizione, btnConf, tipoOperazione, dati);
  });
});
// Catch conferma
ipcMain.on('confermaCancPreventivo', function(e, testata, descrizione, btnConf, tipoOperazione, dati, indice, anno, cliente, opera){
  logger.info('confermaCancPreventivo');
  createConfirmManagement();
  confirmMngmntW.webContents.once('did-finish-load', () => {
    confirmMngmntW.webContents.send('confermaCancPreventivo', testata, descrizione, btnConf, tipoOperazione, indice, anno, cliente, opera);
  });
});

// Catch conferma
ipcMain.on('confermaInsCli', function(e, testata, descrizione, btnConf, tipoOperazione, dati, indice, tipo, id, descCli, cdFis){
  logger.info('confermaInsCli');
  createConfirmManagement();
  confirmMngmntW.webContents.once('did-finish-load', () => {
    confirmMngmntW.webContents.send('confermaInsCli', testata, descrizione, btnConf, tipoOperazione, dati);
  });
});

// Catch conferma
ipcMain.on('confermaAggCli', function(e, testata, descrizione, btnConf, tipoOperazione, dati, indice, tipo, id, descCli, cdFis){
  logger.info('confermaAggCli');
  createConfirmManagement();
  confirmMngmntW.webContents.once('did-finish-load', () => {
    confirmMngmntW.webContents.send('confermaAggCli', testata, descrizione, btnConf, tipoOperazione, dati);
  });
});

// Catch conferma
ipcMain.on('confermaCancCli', function(e, testata, descrizione, btnConf, tipoOperazione, dati, indice, tipo, id, descCli, cdFis){
  logger.info('confermaCancCli');
  createConfirmManagement();
  confirmMngmntW.webContents.once('did-finish-load', () => {
    confirmMngmntW.webContents.send('confermaCancCli', testata, descrizione, btnConf, tipoOperazione, indice, tipo, id, descCli, cdFis);
  });
});

// Catch conferma
ipcMain.on('confermaInsOpera', function(e, testata, descrizione, btnConf, tipoOperazione, dati){
  logger.info('confermaInsOpera');
  createConfirmManagement();
  confirmMngmntW.webContents.once('did-finish-load', () => {
    confirmMngmntW.webContents.send('confermaInsOpera', testata, descrizione, btnConf, tipoOperazione, dati);
  });
});

// Catch conferma
ipcMain.on('confermaAggOpera', function(e, testata, descrizione, btnConf, tipoOperazione, dati){
  logger.info('confermaAggOpera');
  createConfirmManagement();
  confirmMngmntW.webContents.once('did-finish-load', () => {
    confirmMngmntW.webContents.send('confermaAggOpera', testata, descrizione, btnConf, tipoOperazione, dati);
  });
});

// Catch conferma
ipcMain.on('confermaCaricaOpera', function(e, testata, descrizione, btnConf, tipoOperazione, dati, indice){
  logger.info('confermaCaricaOpera');
  createConfirmManagement();
  confirmMngmntW.webContents.once('did-finish-load', () => {
    confirmMngmntW.webContents.send('confermaCaricaOpera', testata, descrizione, btnConf, tipoOperazione, dati, indice);
  });
});

// Catch conferma
ipcMain.on('confermaCancOpera', function(e, testata, descrizione, btnConf, tipoOperazione, dati, indice, descOpera){
  logger.info('confermaCancOpera');
  createConfirmManagement();
  confirmMngmntW.webContents.once('did-finish-load', () => {
    confirmMngmntW.webContents.send('confermaCancOpera', testata, descrizione, btnConf, tipoOperazione, indice, descOpera);
  });
});

// Catch conferma
ipcMain.on('esportaDB', function(e, path){
  logger.info('esportaDB');
  esito = esportaDB(path);
  backupW.webContents.send('esitoBackup', esito);
});


// Create menu template
const mainMenuTemplate =  [
  // Each object is a dropdown
  {
    label: 'File',
    submenu:[
      {
        label:'Gestione cliente',
        accelerator:process.platform == 'darwin' ? 'Command+B' : 'Ctrl+B',
        click(){
          createClientsList();
          clientsListW.webContents.once('did-finish-load', () => {
            clientsListW.webContents.send('tab-lisCli:carica', caricaListaCli('', '', '', ''));
          });
        }
      },
      {
        label:'Gestione opere',
        accelerator:process.platform == 'darwin' ? 'Command+O' : 'Ctrl+O',
        click(){
          createWorksList();
          worksListW.webContents.once('did-finish-load', () => {
            worksListW.webContents.send('tab-lisOpere:carica', caricaListaOpere('', ''));
          });
        }
      },
      {
        type: 'separator'
      },
      {
        label:'Statistiche',
        accelerator:process.platform == 'darwin' ? 'Command+Alt+S' : 'Ctrl+Alt+S',
        click(){
          createStats();
          statisticsW.webContents.once('did-finish-load', () => {
            statisticsW.webContents.send('statistiche:carica', caricaStats());
          });
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Impostazioni',
        submenu:[
          {
            label:'Gestione parametri',
            accelerator:process.platform == 'darwin' ? 'Command+P' : 'Ctrl+P',
            click(){
              createParmList();
              parmsListW.webContents.once('did-finish-load', () => {
                parmsListW.webContents.send('tab-lisParm:carica', caricaListaParm('', ''));
              });
            }
          },
          {
            type: 'separator'
          },
          {
            label:'Backup database',
            accelerator:process.platform == 'darwin' ? 'Command+Alt+D' : 'Ctrl+Alt+D',
            click(){
              createBackup();
            }
          }
        ]
      },
      {
        type: 'separator'
      },
      {
        label: 'Quit',
        accelerator:process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click(){
          quit();
        }
      }
    ]
  },
  {
    label: 'Help',
    submenu:[
      {
        label:'Scorciatoie',
        accelerator:process.platform == 'darwin' ? 'Command+S' : 'Ctrl+S',
        click(){
          createShortcuts();
        }
      },
      {
        type: 'separator'
      },
      {
        label:'Support',
        click(){
          createSupport();
        }
      },
      {
        label:'Donate',
        click(){
          createDonate();
        }
      },
      {
        type: 'separator'
      },
      {
        label:'License',
        click(){
          createLicense();
        }
      },
      {
        label:'About',
        click(){
          createAbout();
        }
      }
    ]
  }
];

// Create others menu template
const othersMenuTemplate =  [
  // Each object is a dropdown
  {
    label: 'Help',
    submenu:[
      {
        label:'Scorciatoie',
        accelerator:process.platform == 'darwin' ? 'Command+S' : 'Ctrl+S',
        click(){
          createShortcuts();
        }
      },
      {
        type: 'separator'
      },
      {
        label:'Support',
        click(){
          createSupport();
        }
      },
      {
        label:'Donate',
        click(){
          createDonate();
        }
      },
      {
        type: 'separator'
      },
      {
        label:'License',
        click(){
          createLicense();
        }
      },
      {
        label:'About',
        click(){
          createAbout();
        }
      }
    ]
  }
];

// If OSX, add empty object to menu
if(process.platform == 'darwin'){
  mainMenuTemplate.unshift({});
  othersMenuTemplate.unshift({});
}

// Add developer tools option if in dev
if(process.env.NODE_ENV !== 'production'){
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu:[
      {
        role: 'reload'
      },
      {
        label: 'Toggle DevTools',
        accelerator:process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools();
        }
      }
    ]
  });
  othersMenuTemplate.push({
    label: 'Developer Tools',
    submenu:[
      {
        role: 'reload'
      },
      {
        label: 'Toggle DevTools',
        accelerator:process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools();
        }
      }
    ]
  });
}
// fine electron
