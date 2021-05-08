//const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');
import { app, BrowserWindow } from 'electron';

let electronWindow: BrowserWindow = null;

// Wait until the app is ready
app.once('ready', () => {
  // Create a new electronWindow
  electronWindow = new BrowserWindow({
    // Set the initial width to 500px
    width: 500,
    // Set the initial height to 400px
    height: 400,
    // set the title bar style
    titleBarStyle: 'hiddenInset',
    // set the background color to black
    backgroundColor: "#111",
    // Don't show the electronWindow until it's ready, this prevents any white flickering
    show: false,
    webPreferences: {
      nodeIntegration: true
    }

  })

  electronWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  electronWindow.once('ready-to-show', () => {
    electronWindow.show()
  })
})