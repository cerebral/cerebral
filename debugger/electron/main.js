'use strict'
const electron = require('electron')
const WebSocketServer = require('ws').Server
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  const clients = {}

  mainWindow = new BrowserWindow({icon: path.resolve('icons', 'icon.png'), width: 800, height: 600})
  mainWindow.on('closed', function () { mainWindow = null })
  mainWindow.loadURL(url.format({
    pathname: __dirname + '/index.html', // eslint-disable-line
    protocol: 'file:',
    slashes: true
  }))

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools()
  }

  electron.ipcMain.on('message', function (event, payload) {
    if (!clients[payload.port] || !clients[payload.port].ws) {
      return
    }
    clients[payload.port].ws.send(JSON.stringify(payload))
  })

  electron.ipcMain.on('port:add', function (event, port) {
    if (clients[port]) {
      mainWindow.webContents.send('port:added', port)
      return
    }

    clients[port] = {
      wss: new WebSocketServer({ port: Number(port) })
    }
    clients[port].wss.on('connection', function (ws) {
      clients[port].ws = ws

      ws.on('message', function (message) {
        mainWindow.webContents.send('message', Object.assign(JSON.parse(message), {
          port
        }))
      })
    })
    mainWindow.webContents.send('port:added', port)
  })

  electron.ipcMain.on('port:remove', function (event, port) {
    clients[port].wss.close()

    delete clients[port]
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
