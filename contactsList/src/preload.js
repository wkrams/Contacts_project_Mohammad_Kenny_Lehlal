// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { ipcRenderer } = require("electron");

window.addEventListener("DOMContentLoaded", () => {
  //click sur button pour ajouter contact
  document.querySelector("#button").addEventListener("click", () => {
    ipcRenderer.invoke("click-button");
  });

  //recevoir json data
  ipcRenderer.on("json-data", (event, data) => {
    //console.log(data);
  });
});
