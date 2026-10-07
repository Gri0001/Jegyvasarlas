let esemenyek = [];
let rendelesSzam = 0;

const urlap = document.getElementById("rendelesUrlap");
const valaszto = document.getElementById("esemenyValaszto");
const darabInput = document.getElementById("darab");
const osszegMezo = document.getElementById("osszeg");

function penz(ertek) {
  return ertek.toLocaleString("hu-HU") + " Ft";
}

function adatBetoltes() {
  const keres = new XMLHttpRequest();
  keres.open("GET", "data.json", true);
  keres.onreadystatechange = function () {
    if (keres.readyState !== 4) {
      return;
    }
    if (keres.status === 200) {
      const adat = JSON.parse(keres.responseText);
      esemenyek = adat.esemenyek;
      diaKirajzolas(adat.diak);
      esemenyKirajzolas();
      valasztoFeltoltes();
    } else {
      document.getElementById("esemenyLista").innerHTML =
        '<div class="col-12 text-center text-danger">Az adatok betöltése nem sikerült.</div>';
    }
  };
  keres.send();
}

function diaKirajzolas(diak) {
  const jelzok = document.getElementById("diaJelzok");
  const tartalom = document.getElementById("diaTartalom");
  let jelzoHtml = "";
  let tartalomHtml = "";

  diak.forEach(function (dia, i) {
    const aktiv = i === 0 ? "active" : "";
    jelzoHtml +=
      '<button type="button" data-bs-target="#diavetites" data-bs-slide-to="' +
      i + '" class="' + aktiv + '"></button>';
    tartalomHtml +=
      '<div class="carousel-item ' + aktiv + '">' +
      '<div class="dia" style="background:' + dia.hatter + '">' +
      "<div><h1>" + dia.cim + "</h1><p>" + dia.szoveg + "</p>" +
      '<a href="#rendeles" class="btn btn-warning fw-bold">Jegyet kérek</a></div>' +
      "</div></div>";
  });

  jelzok.innerHTML = jelzoHtml;
  tartalom.innerHTML = tartalomHtml;
}

function esemenyKirajzolas() {
  const lista = document.getElementById("esemenyLista");
  let html = "";

  esemenyek.forEach(function (e) {
    html +=
      '<div class="col-md-6 col-lg-3">' +
      '<div class="esemeny-kartya">' +
      '<div class="esemeny-fejlec" style="background:' + e.szin + '">' + e.ikon + "</div>" +
      '<div class="esemeny-torzs">' +
      "<h5>" + e.nev + "</h5>" +
      '<div class="text-secondary">' + e.datum + "</div>" +
      '<div class="text-secondary mb-3">' + e.helyszin + "</div>" +
      '<div class="ar mb-3">' + penz(e.ar) + "</div>" +
      '<button class="btn btn-outline-warning kivalaszt" data-id="' + e.id + '">Jegyvásárlás</button>' +
      "</div></div></div>";
  });

  lista.innerHTML = html;

  document.querySelectorAll(".kivalaszt").forEach(function (gomb) {
    gomb.addEventListener("click", function () {
      valaszto.value = gomb.dataset.id;
      osszegFrissites();
      document.getElementById("rendeles").scrollIntoView({ behavior: "smooth" });
    });
  });
}

function valasztoFeltoltes() {
  esemenyek.forEach(function (e) {
    const opcio = document.createElement("option");
    opcio.value = e.id;
    opcio.textContent = e.nev + " – " + e.datum;
    valaszto.appendChild(opcio);
  });
}

function aktualisEsemeny() {
  return esemenyek.find(function (e) {
    return String(e.id) === valaszto.value;
  });
}

function osszegFrissites() {
  const esemeny = aktualisEsemeny();
  const darab = parseInt(darabInput.value, 10) || 0;
  osszegMezo.textContent = esemeny ? penz(esemeny.ar * darab) : "0 Ft";
}

function ertesitesMutat(szoveg) {
  document.getElementById("ertesitesSzoveg").textContent = szoveg;
  bootstrap.Toast.getOrCreateInstance(document.getElementById("ertesites"), { delay: 5000 }).show();
}

function rendelesKuldes(rendeles) {
  return fetch("data.json", {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  }).then(function () {
    return { siker: true, rendeles: rendeles };
  });
}

urlap.addEventListener("submit", function (esemeny) {
  esemeny.preventDefault();
  urlap.classList.add("was-validated");

  if (!urlap.checkValidity()) {
    return;
  }

  const kivalasztott = aktualisEsemeny();
  const darab = parseInt(darabInput.value, 10);

  const rendeles = {
    nev: document.getElementById("nev").value.trim(),
    email: document.getElementById("email").value.trim(),
    esemeny: kivalasztott.nev,
    darab: darab,
    vegosszeg: kivalasztott.ar * darab
  };

  rendelesKuldes(rendeles).then(function (valasz) {
    if (!valasz.siker) {
      return;
    }
    rendelesSzam++;
    document.getElementById("rendelesSzamlalo").textContent = "Rendelések: " + rendelesSzam;

    document.getElementById("rendelesOsszegzo").innerHTML =
      "<p>Köszönjük a vásárlást, <strong>" + rendeles.nev + "</strong>!</p>" +
      "<ul class='mb-0'>" +
      "<li>Esemény: " + rendeles.esemeny + "</li>" +
      "<li>Jegyek száma: " + rendeles.darab + "</li>" +
      "<li>Végösszeg: " + penz(rendeles.vegosszeg) + "</li>" +
      "<li>Visszaigazolás ide: " + rendeles.email + "</li></ul>";

    bootstrap.Modal.getOrCreateInstance(document.getElementById("rendelesModal")).show();
    ertesitesMutat("Megrendelés rögzítve: " + rendeles.darab + " db jegy – " + rendeles.esemeny);

    urlap.reset();
    urlap.classList.remove("was-validated");
    osszegFrissites();
  });
});

valaszto.addEventListener("change", osszegFrissites);
darabInput.addEventListener("input", osszegFrissites);

adatBetoltes();
