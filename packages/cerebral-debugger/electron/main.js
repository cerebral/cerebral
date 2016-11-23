'use strict'
const electron = require('electron')
const WebSocketServer = require('ws').Server
const defaultMenu = require('electron-default-menu')
const storage = require('electron-json-storage')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  const menu = defaultMenu(electron.app, electron.shell)
  let currentClient
  let wss

  mainWindow = new BrowserWindow({width: 800, height: 600})
  mainWindow.on('closed', function () { mainWindow = null })
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools()
  }

  electron.ipcMain.on('message', function (event, payload) {
    if (!currentClient) {
      return
    }
    currentClient.send(JSON.stringify(payload))
  })

  function initializeWebsocket () {
    wss.on('connection', function (ws) {
      ws.on('message', function (message) {
        mainWindow.webContents.send('message', JSON.parse(message))
      })
      currentClient = ws
    })
  }

  storage.get('selectedPort', (error, selectedPort) => {
    if (error) {
      throw error
    }

    wss = new WebSocketServer({ port: parseInt(selectedPort || 8585) })
    menu.splice(4, 0, {
      label: 'Port',
      submenu: [
        '8585 (default)',
        '8686',
        '8787',
        '8888',
        '8989'
      ].map((label) => {
        return {
          checked: label === selectedPort,
          type: 'radio',
          label,
          click: (item, focusedWindow) => {
            wss.close()
            wss = new WebSocketServer({ port: parseInt(label) })
            initializeWebsocket()
            storage.set('selectedPort', label)
          }
        }
      })
    })

    electron.Menu.setApplicationMenu(electron.Menu.buildFromTemplate(menu))
    initializeWebsocket()
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
