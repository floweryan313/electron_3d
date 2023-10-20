const { app, BrowserWindow,Tray,Menu,ipcRenderer  } = require('electron')
var path = require('path')

ipcRenderer.on('setTask', (event,task) => {
    console.log('is is reives')
    document.querySelector('.reminder').innerHTML = 
       `<span>${decodeURIComponent(task)}</span>的时间到啦！`
 })
 
 var close = document.getElementById('close');
close.addEventListener('click', () => {
  console.log('click')
  ipcRenderer.send('remainWindow:close')
  
  
})




