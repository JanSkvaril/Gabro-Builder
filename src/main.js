const {
  app,
  BrowserWindow,
  ipcMain
} = require('electron');
const path = require('path');
const fs = require('fs');
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

let project_path = "../gabro_template";
const {
  exec
} = require('child_process')

const Compile = require("./GabroCompiler").Compile;
let CONFIG;

const BUILD_FILE_NAME = "Gabro-Build.json";

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
  let rawdata = fs.readFileSync('GabroConfig.json');
  CONFIG = JSON.parse(rawdata);

  ipcMain.on("send-build", (e, input) => {
    SaveAndCompile(input);
  });

  ipcMain.on("get-config", (e) => {

    e.reply("receive_config", CONFIG);
  });

  ipcMain.on("set-path", (e, input) => {
    if (input != "") {
      project_path = input;
    }

    let raw = fs.readFileSync(project_path + "/" + BUILD_FILE_NAME);
    let build = JSON.parse(raw);
    SaveAndCompile(build);
    e.reply("build_update", build);

    //console.log("Executing: " + "cd " + project_path + " ; npm start")
    exec("npm start", {
      cwd: project_path
    }, (error, stdout) => {
      // console.log("ERROR: " + error);
      // console.log("stdout: " + stdout);
    });
  });
};

function SaveAndCompile(build) {

  fs.writeFile(project_path + "/" + BUILD_FILE_NAME, JSON.stringify(build), (e) => {

  });
  fs.writeFile(project_path + "/src/App.jsx", Compile(build, CONFIG), (e) => {
    //console.log(e);
  });
}




// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.