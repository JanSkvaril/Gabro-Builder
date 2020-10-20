const {
  app,
  BrowserWindow,
  ipcMain
} = require('electron');
const path = require('path');
const fs = require('fs');
if (require('electron-squirrel-startup')) {
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
      enableRemoteModule: true,
      devTools: false
    }
  });
  mainWindow.removeMenu();

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
  let rawdata;
  try {
    rawdata = fs.readFileSync('GabroConfig.json');
    CONFIG = JSON.parse(rawdata);
  } catch (err) {
    return;
    //TODO: error message
  }

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
    let raw;
    let build;
    try {
      raw = fs.readFileSync(project_path + "/" + BUILD_FILE_NAME);
      build = JSON.parse(raw);
    } catch (err) {
      return;
      //TODO: error message
    }
    SaveAndCompile(build);
    e.reply("build_update", build);
    return;
    exec("npm start", {
      cwd: project_path
    }, (error, stdout) => {});
  });

  ipcMain.on("create", (e, input) => {
    project_path = input;

    exec("git clone https://github.com/JanSkvaril/gabro_template.git & cd gabro_template & npm i", {
      cwd: project_path
    }, (error, stdout) => {
      project_path += "/gabro_template";
      let raw;
      let build;
      try {
        raw = fs.readFileSync(project_path + "/" + BUILD_FILE_NAME);
        build = JSON.parse(raw);
      } catch (err) {
        return;
        //TODO: error message
      }
      SaveAndCompile(build);
      e.reply("build_update", build);
      exec("npm start", {
        cwd: project_path
      }, (error, stdout) => {});
    });
  });
  ipcMain.on("final-build", (e, input) => {

    exec("npm run-script build", {
      cwd: project_path
    }, (error, stdout) => {
      e.reply("final-build-done");
    });
  });





};

function SaveAndCompile(build) {
  //TODO add error messages
  try {
    fs.writeFile(project_path + "/" + BUILD_FILE_NAME, JSON.stringify(build), (e) => {

    });
    fs.writeFile(project_path + "/src/App.jsx", Compile(build, CONFIG), (e) => {

    });
  } catch (err) {
    return;
    //TODO: error message
  }
}





app.on('ready', createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});