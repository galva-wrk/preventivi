const electron = require('electron');
const app = electron.app;

const path = require('path');
const url = require('url');

// const {app, BrowserWindow, Menu} = electron;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const ipcMain = electron.ipcMain;

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

    // Quit app when closed
    mainWindow.on('closed', function(){
      app.quit();
    });

    // Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    // insert menu
    Menu.setApplicationMenu(mainMenu);
});

// Handle create add window
function createAddWindow(){
  addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: 'Add shopping list item'
  });
  // mainWindow.loadURL('http://google.com');
  addWindow.loadURL(url.format ({
    pathname: path.join(__dirname, 'test2.html'),
    protocol: 'file:',
    slashes: true
  }));

  // garbage collection Handle
  addWindow.on('close', function(){
    addWindow = null;
  });
}

// Catch item:add
ipcMain.on('item:add',function(e, item){
  mainWindow.webContents.send('item:add', item);
  addWindow.close();
});

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
        label: 'Clear Items',
        click(){
          mainWindow.webContents.send('item:clear');
        }
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

// If mac, add empty object to menu
if (process.platform == 'darwin') {
  mainMenuTemplate.unshift({});
}

// Add developer tools item if not in prod
if (process.env.NODE_ENV !== 'production') {
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu:[
      {
        label: 'Toggle DevTools',
        accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools();
        }
      },
      {
        role: 'reload'
      }
    ]
  })
}
