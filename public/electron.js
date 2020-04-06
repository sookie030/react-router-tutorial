// const electron = require("electron");
// const app = electron.app;
// const BrowserWindow = electron.BrowserWindow;

const { app, BrowserWindow, ipcMain } = require('electron');

const path = require("path");
const isDev = require("electron-is-dev");

// Load modules about ffi
const ffi = require('ffi-napi');
const ref = require('ref-napi');
const visionlib = require('../lib/vision/corewrap');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1350,
    height: 960,
    minWidth: 1350,
    minHeight: 960,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js")
    }
  });
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  if (isDev) {
    // Open the DevTools.
    //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
    mainWindow.webContents.openDevTools();
  }
  mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('test', (event, arg) => {
  console.log(arg);
  event.sender.send('test-reply', '하이', '헬로우');
})

// require('../server/index');