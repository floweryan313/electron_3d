const electron = require('electron')
const { ipcRenderer,BrowserWindow } = electron
var path = require('path')

var closeDom = document.getElementById('closeDom');
closeDom.addEventListener('click', () => {
  console.log('click')
  ipcRenderer.send('mainWindow:close')
})

var btns = document.getElementById('closeDom1');
btns.addEventListener('click', () => {
  console.log('click-aaa')
  ipcRenderer.send('mainWindow:create')
  
 
})



window.addEventListener('DOMContentLoaded', () => {

 console.log("--DOMContentLoaded--")
})
