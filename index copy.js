//引入两个模块：app 和 BrowserWindow

//app 模块，控制整个应用程序的事件生命周期。
//BrowserWindow 模块，它创建和管理程序的窗口。

const { app, BrowserWindow,Tray,Menu,ipcMain,ipcRenderer,dialog } = require('electron')

// Object.defineProperty(app, 'isPackaged', {
//   get() {
//     return true;
//   }
// });
var path = require('path')
const { autoUpdater } = require('electron-updater')
let remindWindow
const iconPath = path.join(__dirname, './src/img/a.png')   //应用运行时的标题栏图标
let mainWindow
app.on('ready', () => {
  checkUpdate()
  mainWindow = new BrowserWindow({
    frame: false,
    resizable: false,   //不允许用户改变窗口大小
    width: 800,        //设置窗口宽高
    height: 600,
    icon: iconPath,     //应用运行时的标题栏图标
    webPreferences:{    
      backgroundThrottling: false,   //设置应用在后台正常运行
      nodeIntegration:true,     //设置能在页面使用nodejs的API
      contextIsolation: false
    }
  })
  // mainWindow.webContents.openDevTools()
  mainWindow.loadURL(`file://${__dirname}/src/main.html`)
  mainWindow.removeMenu()
  tray = new Tray(iconPath)  

  tray.setToolTip('Tasky') 

  tray.on('click', () => {       //点击图标的响应事件，这里是切换主窗口的显示和隐藏
    if(mainWindow.isVisible()){
      mainWindow.hide()
    }else{
      mainWindow.show()
    }
  })

  tray.on('right-click', () => {    //右键点击图标时，出现的菜单，通过Menu.buildFromTemplate定制，这里只包含退出程序的选项。
    const menuConfig = Menu.buildFromTemplate([
      {
        label: 'Quit',
        click: () => app.quit()
      }
    ])
    tray.popUpContextMenu(menuConfig)
  })


  ipcMain.on('mainWindow:close', () => {
    console.log('revices')
    mainWindow.hide()
  })


  ipcMain.on('mainWindow:create', () => {
    console.log('create')
    createRemindWindow("做饭");
  })

  
  function createRemindWindow (task) {
    const iconPath = path.join(__dirname, './src/img/a.png')
      console.log("----aaa----")
      remindWindow = new BrowserWindow({
          frame: false,
          resizable: false,   //不允许用户改变窗口大小
          width: 200,        //设置窗口宽高
          height: 200,
          icon: iconPath,     //应用运行时的标题栏图标
          webPreferences:{    
            backgroundThrottling: false,   //设置应用在后台正常运行
            nodeIntegration:true,     //设置能在页面使用nodejs的API
            contextIsolation: false,
            preload: path.join(__dirname, 'preload.js')
          }
      })
      remindWindow.loadURL(`file://${__dirname}/src/remind.html`)
      
      //主进程发送消息给渲染进程
      remindWindow.webContents.send('setTask', task)
    
  }

  ipcMain.on('remainWindow:close', () => {
    console.log('----close----')
    remindWindow.close()
    remindWindow = null
    
  })
  
  function checkUpdate(){
    console.log("process.platform::"+process.platform)

      
    if(process.platform == 'darwin'){  
    
      //我们使用koa-static将静态目录设置成了static文件夹，
      //所以访问http://127.0.0.1:9005/darwin，就相当于访问了static/darwin文件夹，win32同理
      autoUpdater.setFeedURL('http://127.0.0.1:9005/darwin')  //设置要检测更新的路径
      
    }else{
      console.log('--sss---')
      autoUpdater.setFeedURL('http://127.0.0.1:9005/win32')
    }
    
    //检测更新
    autoUpdater.checkForUpdates()
    
    //监听'error'事件
    autoUpdater.on('error', (err) => {
      console.log('--err---')
      console.log(err)
    })
    
    //监听'update-available'事件，发现有新版本时触发
    autoUpdater.on('update-available', () => {
      console.log('found new version')
    })
    
    //默认会自动下载新版本，如果不想自动下载，设置autoUpdater.autoDownload = false
    
    //监听'update-downloaded'事件，新版本下载完成时触发
    autoUpdater.on('update-downloaded', () => {
      dialog.showMessageBox({
        type: 'info',
        title: '应用更新',
        message: '发现新版本，是否更新？',
        buttons: ['是', '否']
      }).then((buttonIndex) => {
        if(buttonIndex.response == 0) {  //选择是，则退出程序，安装新版本
          autoUpdater.quitAndInstall() 
          app.quit()
        }
      })
    })
  }
  


})

  
