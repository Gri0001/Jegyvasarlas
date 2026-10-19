let esemenyek = [];
let rendelesSzam = 0;

const urlap = document.getElementById("rendelesUrlap");
const valaszto = document.getElementById("esemenyValaszto");
const darabInput = document.getElementById("darab");
const osszegMezo = document.getElementById("osszeg");

function penz(ertek) {
  return ertek.toLocaleString("hu-HU") + " Ft";
}

const TARTALEK_ADAT = {
  "diak": [
    {
      "cim": "Őszi Szuperkaland",
      "szoveg": "Több mint 30 játék, egy hatalmas óriáskerék és végtelen nevetés",
      "hatter": "linear-gradient(135deg, #ff4d5a, #ffc933)"
    },
    {
      "cim": "Halloween Horror Night",
      "szoveg": "Kísértetvasút, rémes labirintus és hátborzongató meglepetések",
      "hatter": "linear-gradient(135deg, #5b1fa8, #ff7a18)"
    },
    {
      "cim": "Gyerekparadicsom",
      "szoveg": "Körhinta, mini hullámvasút és játszóház a legkisebbeknek",
      "hatter": "linear-gradient(135deg, #12c2b3, #3a7bd5)"
    }
  ],
  "esemenyek": [
    {
      "id": 1,
      "nev": "Óriáskerék napijegy",
      "datum": "Minden nap, 10–20 óra",
      "helyszin": "Vidámpark, Budapest",
      "ar": 6900,
      "ikon": "🎡",
      "szin": "linear-gradient(135deg, #ff4d5a, #ffc933)"
    },
    {
      "id": 2,
      "nev": "Horror Éjszaka",
      "datum": "2026. október 31., 18–24 óra",
      "helyszin": "Vidámpark, Budapest",
      "ar": 8900,
      "ikon": "👻",
      "szin": "linear-gradient(135deg, #5b1fa8, #ff7a18)"
    },
    {
      "id": 3,
      "nev": "Gyerekparadicsom",
      "datum": "Hétvégente, 10–18 óra",
      "helyszin": "Vidámpark, Budapest",
      "ar": 4900,
      "ikon": "🎠",
      "szin": "linear-gradient(135deg, #12c2b3, #3a7bd5)"
    },
    {
      "id": 4,
      "nev": "Hullámvasút VIP",
      "datum": "Soron kívüli belépés, minden nap",
      "helyszin": "Vidámpark, Budapest",
      "ar": 12900,
      "ikon": "🎢",
      "szin": "linear-gradient(135deg, #e23d8f, #7b2ff7)"
    }
  ]
};

function adatFeldolgozas(adat) {
  esemenyek = adat.esemenyek;
  diaKirajzolas(adat.diak);
  esemenyKirajzolas();
  valasztoFeltoltes();
}

function adatBetoltes() {
  const keres = new XMLHttpRequest();
  keres.open("GET", "data.json", true);
  keres.onreadystatechange = function () {
    if (keres.readyState !== 4) {
      return;
    }
    let adat = null;
    if (keres.status === 200 || (keres.status === 0 && keres.responseText)) {
      try {
        adat = JSON.parse(keres.responseText);
      } catch (hiba) {
        adat = null;
      }
    }
    adatFeldolgozas(adat || TARTALEK_ADAT);
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

function konfetti() {
  if (document.body.classList.contains("nincs-mozgas")) {
    return;
  }
  const szinek = ["#ff4d5a", "#ffc933", "#12c2b3", "#e23d8f", "#3a7bd5"];
  for (let i = 0; i < 70; i++) {
    const d = document.createElement("span");
    d.className = "konfetti";
    d.style.left = Math.random() * 100 + "vw";
    d.style.background = szinek[i % szinek.length];
    d.style.animationDuration = 2 + Math.random() * 2 + "s";
    d.style.animationDelay = Math.random() * 0.5 + "s";
    d.style.transform = "rotate(" + Math.random() * 360 + "deg)";
    document.body.appendChild(d);
    setTimeout(function () { d.remove(); }, 4500);
  }
}

function ertesitesMutat(szoveg) {
  document.getElementById("ertesitesSzoveg").textContent = szoveg;
  bootstrap.Toast.getOrCreateInstance(document.getElementById("ertesites"), { delay: 5000 }).show();
}

function rendelesKuldes(rendeles) {
  return new Promise(function (megoldva) {
    setTimeout(function () {
      megoldva({ siker: true, rendeles: rendeles });
    }, 500);
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

    const rendelesSzama = "VP-" + String(Math.floor(100000 + Math.random() * 900000));
    document.getElementById("rendelesOsszegzo").innerHTML =
      '<div class="text-center sikeres-ikon">✅</div>' +
      '<p class="text-center fs-5">Köszönjük a vásárlást, <strong>' + rendeles.nev + "</strong>!</p>" +
      '<div class="jegy-osszegzo">' +
      "<div><span>Rendelésszám</span><strong>" + rendelesSzama + "</strong></div>" +
      "<div><span>Jegytípus</span><strong>" + rendeles.esemeny + "</strong></div>" +
      "<div><span>Jegyek száma</span><strong>" + rendeles.darab + " db</strong></div>" +
      "<div><span>Végösszeg</span><strong>" + penz(rendeles.vegosszeg) + "</strong></div>" +
      "</div>" +
      '<p class="text-center mt-3 mb-0 small">Visszaigazolást küldtünk ide: ' + rendeles.email + "</p>";

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

const animGomb = document.getElementById("animGomb");

function animBeallit(bekapcsolva) {
  document.body.classList.toggle("nincs-mozgas", !bekapcsolva);
  animGomb.textContent = bekapcsolva ? "✨ Animáció: BE" : "✨ Animáció: KI";
  animGomb.setAttribute("aria-pressed", String(bekapcsolva));
}

animGomb.addEventListener("click", function () {
  animBeallit(document.body.classList.contains("nincs-mozgas"));
});

animBeallit(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);