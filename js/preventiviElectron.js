const electron = require('electron');
const {ipcRenderer} = electron;
const ul = document.querySelector('ul');

// Add item
ipcRenderer.on('item:add', function(e, item){
  const li = document.createElement('li');
  const itemText = document.createTextNode(item);
  li.appendChild(itemText);
  ul.appendChild(li);
});

// Clear item
ipcRenderer.on('item:clear', function(){
  ul.innerHTML = '';
});
