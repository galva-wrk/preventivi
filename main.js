const electron = require('electron');
const app = electron.app;

const path = require('path');
const url = require('url');

// const {app, BrowserWindow, Menu} = electron;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;

var mainWindow;
let addWindow;

// Listen for app to be ready
app.on('ready',function(){
    // create new window
    // mainWindow = new BrowserWindow({width: 1024, height: 768});
    mainWindow = new BrowserWindow();
    // mainWindow.loadURL('http://google.com');
    mainWindow.loadURL(url.format ({
      pathname: path.join(__dirname, 'test.html'),
      protocol: 'file:',
      slashes: true
    }));

    // Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    // insert menu
    Menu.setApplicationMenu(mainMenu);
});

// Handle create add window
function createAddWindow(){
  addWindow = new BrowserWindow({
    width: 200,
    height: 300,
    title: 'Add shopping list item'
  });
  // mainWindow.loadURL('http://google.com');
  addWindow.loadURL(url.format ({
    pathname: path.join(__dirname, 'test2.html'),
    protocol: 'file:',
    slashes: true
  }));
}

// create menu template
const mainMenuTemplate = [
  {
    label: 'File',
    submenu:[
      {
        label: 'Add Item',
        click(){
          createAddWindow();
        }
      },
      {
        label: 'Clear Items'
      },
      {
        label: 'Quit',
        accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click(){
          app.quit();
        }
      }
    ]
  }

];
