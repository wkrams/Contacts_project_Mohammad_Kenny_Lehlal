const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}
let mainWindow;
const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "index.html"));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};
//recevoir response sur click button importer des contact
ipcMain.handle("click-for-importer", async (event) => {
  const { canceled, filePath } = await dialog.showSaveDialog();
  const jsonpath = fs.readFileSync(path.join(__dirname, "contact.json"));
  const jsondata = JSON.parse(jsonpath);
  let result = "";
  jsondata.map((data) => {
    result += data.nom + " ";
    result += data.prenom + " ,";
    result += data.email + " ,";
    result += data.address.ville + ",";
    result += data.address.code + ",";
    result += data.address.pays;
    result += "\n";
  });

  //console.log(result);
  if (!canceled) {
    fs.writeFile(filePath, result, (error) => {
      if (error) {
        return console.log(error);
      } else {
        console.log("file saved");
      }
    });
  }
});

//recevoir reponse sur click button inserer contact
ipcMain.handle("click-button", () => {
  const secodaryWinsow = new BrowserWindow({
    width: 800,
    height: 600,
    modal: true,
    x: 400,
    y: 250,
    resizable: true,
    parent: mainWindow,
    title: "Ajouter Contact",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  secodaryWinsow.loadFile(path.join(__dirname, "contact.html"));
  //lorsque contact availabe envoyer une requete a preload
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  createWindow();
  afficherJson();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
let jsondata;
let jsonbuffer;
function afficherJson() {
  jsonbuffer = fs.readFileSync(path.join(__dirname, "contact.json"));
  jsondata = jsonbuffer.toString();
  //console.log(jsondata);
  //json data envoyer ver front-end
  mainWindow.webContents.send("json-data", jsondata);
}
//recevoir requete insert-contact a fichier json
ipcMain.handle("insert-contact", (event, contact) => {
  let newData = JSON.stringify(contact);

  jsondata = JSON.parse(jsondata);
  //console.log(jsondata);
  jsondata.push(newData);
  console.log(jsondata);
  //let jsondataString = JSON.stringify(jsondata, null, 4);
  console.log(path.join(__dirname, "contact.json"));
  fs.writeFile(path.join(__dirname, "contact.json"), jsondata, (err) => {
    if (err) {
      console.error(err);
    }
  });
});
