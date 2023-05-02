// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { ipcRenderer } = require("electron");

window.addEventListener("DOMContentLoaded", () => {
  //click sur button pour ajouter contact
  document.querySelector("#btn-add-contact").addEventListener("click", (e) => {
    e.preventDefault();
    ipcRenderer.invoke("click-button");
  });
  const imagedir = "image/";
  //recevoir json data
  ipcRenderer.on("json-data", (event, datas) => {
    const liste = document.querySelector("#contact-list");
    datas = JSON.parse(datas);
    datas.map((data) => {
      const li = document.createElement("li");
      let image = document.createElement("img");
      image.setAttribute("src", imagedir + data.photo);
      image.setAttribute("height", 100);
      image.setAttribute("width", 100);
      li.appendChild(image);
      liste.appendChild(li);
      li.innerHTML += data.nom + " ";
      li.innerHTML += data.prenom + " ";
      li.innerHTML += data.email + " ";
      li.innerHTML += data.address.ville + ",";
      li.innerHTML += data.address.code + ",";
      li.innerHTML += data.address.pays;
    });
  });
  //recupere les valuer de contact
  document.querySelector("#btn-create-contact").
});
