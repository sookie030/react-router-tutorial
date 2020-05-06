const { app, BrowserWindow, ipcMain } = require("electron");

const path = require("path");
const isDev = require("electron-is-dev");

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
      preload: path.join(__dirname, "preload.js"),
    },
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

ipcMain.on("asynchronous-message", (event, arg) => {
  console.log(arg); // "ping" 출력
  event.sender.send("asynchronous-reply", "pong");
});

ipcMain.on("synchronous-message", (event, args) => {
  // console.log(args)  // "ping" 출력
  // console.log(args.data)  // "ping" 출력
  // console.log(args['data'])  // "ping" 출력
  // event.returnValue = [ 'pong', 'test' ]
  visionlib.cropImage(args);
  event.returnValue = "pong";
});

ipcMain.on("crop-image", (event, ...args) => {
  visionlib.cropImage(args);
});
