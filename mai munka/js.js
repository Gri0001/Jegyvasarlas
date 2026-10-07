/* =========================================
   SYMPHONYFEST 2026
   Jegyvásárlási rendszer
========================================= */


/* =========================================
   VÁLTOZÓK
========================================= */

let discountApplied = false;


/* =========================================
   DOM ELEMEK
========================================= */

const ticketForm = document.getElementById('ticketForm');

const ticketType = document.getElementById('ticketType');

const ticketQuantity =
    document.getElementById('ticketQuantity');

const promoCode =
    document.getElementById('promoCode');

const promoButton =
    document.getElementById('promoButton');

const promoMessage =
    document.getElementById('promoMessage');

const totalPriceDisplay =
    document.getElementById('totalPriceDisplay');

const submitBtn =
    document.getElementById('submitBtn');

const btnText =
    document.getElementById('btnText');

const btnSpinner =
    document.getElementById('btnSpinner');


/* =========================================
   VÉGÖSSZEG SZÁMÍTÁSA
========================================= */

function calculateTotal() {

    const selectedOption =
        ticketType.options[ticketType.selectedIndex];

    const price = selectedOption
        ? parseInt(
            selectedOption.getAttribute('data-price') || 0,
            10
        )
        : 0;

    const quantity =
        parseInt(ticketQuantity.value, 10) || 1;


    let total = price * quantity;


    /* 20% kedvezmény */

    if (discountApplied) {
        total = total * 0.8;
    }


    /* Megjelenítés */

    totalPriceDisplay.innerText =
        total.toLocaleString('hu-HU') + ' Ft';


    return total;
}


/* =========================================
   KUPON ÉRVÉNYESÍTÉSE
========================================= */

function applyPromo() {

    const promoInput =
        promoCode.value.trim().toUpperCase();


    /* FLASH20 */

    if (promoInput === 'FLASH20') {

        discountApplied = true;


        promoMessage.classList.remove(
            'd-none',
            'text-danger'
        );

        promoMessage.classList.add(
            'text-success'
        );


        promoMessage.innerText =
            '⚡ 20% kedvezmény sikeresen érvényesítve!';

    } else {

        discountApplied = false;


        promoMessage.classList.remove(
            'd-none',
            'text-success'
        );

        promoMessage.classList.add(
            'text-danger'
        );


        promoMessage.innerText =
            '❌ Érvénytelen kuponkód!';
    }


    calculateTotal();
}


/* =========================================
   RENDELÉS ELKÜLDÉSE
========================================= */

async function handleTicketPurchase(event) {

    event.preventDefault();


    /* Gomb betöltési állapot */

    submitBtn.disabled = true;

    btnText.innerText =
        'Feldolgozás folyamatban...';

    btnSpinner.classList.remove('d-none');


    /* Kiválasztott jegy */

    const selectedOption =
        ticketType.options[ticketType.selectedIndex];


    /* JSON payload */

    const orderPayload = {

        ticketType: ticketType.value,

        ticketTypeName:
            selectedOption.text,

        quantity:
            parseInt(ticketQuantity.value, 10),

        customerName:
            document.getElementById('userName').value,

        customerEmail:
            document.getElementById('userEmail').value,

        promoCode:
            promoCode.value.trim().toUpperCase(),

        totalAmount:
            calculateTotal(),

        timestamp:
            new Date().toISOString()
    };


    try {

        /* =========================================
           AJAX / FETCH REQUEST
        ========================================== */

        const response = await fetch(
            'https://jsonplaceholder.typicode.com/posts',
            {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify(orderPayload)
            }
        );


        /* HTTP hiba */

        if (!response.ok) {
            throw new Error(
                'Hálózati hiba történt a rendelés során.'
            );
        }


        /* JSON válasz */

        const jsonResponseData =
            await response.json();


        console.log(
            'Szerver válasz:',
            jsonResponseData
        );


        /* =========================================
           SZIMULÁLT RENDELÉSI AZONOSÍTÓ
        ========================================== */

        const simulatedOrderId =
            'SF-' +
            Math.floor(
                100000 +
                Math.random() * 900000
            );


        /* =========================================
           MODAL ADATOK FELTÖLTÉSE
        ========================================== */

        document.getElementById('resOrderId')
            .innerText =
            simulatedOrderId;


        document.getElementById('resCustomerName')
            .innerText =
            orderPayload.customerName;


        document.getElementById('resCustomerEmail')
            .innerText =
            orderPayload.customerEmail;


        document.getElementById('resTicketDetails')
            .innerText =
            `${orderPayload.quantity}x ${orderPayload.ticketTypeName}`;


        document.getElementById('resTotalAmount')
            .innerText =
            orderPayload.totalAmount
                .toLocaleString('hu-HU') +
            ' Ft';


        /* =========================================
           BOOTSTRAP MODAL MEGJELENÍTÉSE
        ========================================== */

        const modalElement =
            document.getElementById(
                'orderSuccessModal'
            );


        const successModal =
            new bootstrap.Modal(modalElement);


        successModal.show();


        /* =========================================
           ŰRLAP RESET
        ========================================== */

        ticketForm.reset();

        discountApplied = false;

        promoMessage.classList.add('d-none');

        calculateTotal();


    } catch (error) {

        console.error(
            'Rendelési hiba:',
            error
        );


        alert(
            'Hiba történt a megrendelés küldésekor: ' +
            error.message
        );


    } finally {

        /* =========================================
           GOMB VISSZAÁLLÍTÁSA
        ========================================== */

        submitBtn.disabled = false;

        btnText.innerText =
            'Jegyek Megrendelése';

        btnSpinner.classList.add('d-none');
    }
}


/* =========================================
   ESEMÉNYKEZELŐK
========================================= */


/* Jegytípus változás */

ticketType.addEventListener(
    'change',
    calculateTotal
);


/* Darabszám változás */

ticketQuantity.addEventListener(
    'input',
    calculateTotal
);

ticketQuantity.addEventListener(
    'change',
    calculateTotal
);


/* Kupon */

promoButton.addEventListener(
    'click',
    applyPromo
);


/* Enter a kuponmezőben */

promoCode.addEventListener(
    'keydown',
    function (event) {

        if (event.key === 'Enter') {

            event.preventDefault();

            applyPromo();
        }
    }
);


/* Form elküldése */

ticketForm.addEventListener(
    'submit',
    handleTicketPurchase
);


/* =========================================
   KEZDŐ ÁLLAPOT
========================================= */

calculateTotal();