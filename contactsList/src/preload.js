// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { ipcRenderer } = require("electron");

window.addEventListener("DOMContentLoaded", () => {
  //click sur button pour importer des contact
  document
    .querySelector("#btn-import-contact")
    .addEventListener("click", (e) => {
      e.preventDefault();
      ipcRenderer.invoke("click-for-importer");
    });

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
});
//recupere les valuer de contact
window.addEventListener("DOMContentLoaded", () => {
  document
    .querySelector("#btn-create-contact")
    .addEventListener("click", function (e) {
      e.preventDefault();
      console.log("clicked");
      let nom = document.querySelector("#first-name").value;
      let prenom = document.querySelector("#last-name").value;
      let email = document.querySelector("#email").value;
      let adressRue = document.querySelector("#adress-rue").value;
      let adresseCodePostale = document.querySelector(
        "#adress-code-postal"
      ).value;
      let adresseVille = document.querySelector("#adress-ville").value;
      let adressePays = document.querySelector("#adress-pays").value;
      let contact = {
        nom: nom,
        prenom: prenom,
        email: email,
        address: {
          addressRue: adressRue,
          code: adresseCodePostale,
          ville: adresseVille,
          pays: adressePays,
        },
      };
      //console.log(contact);
      ipcRenderer.invoke("insert-contact", contact);
    });
});
