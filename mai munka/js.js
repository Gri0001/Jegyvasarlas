let discountApplied = false;

const ticketForm = document.getElementById('ticketForm');
const ticketType = document.getElementById('ticketType');
const ticketQuantity = document.getElementById('ticketQuantity');
const promoCode = document.getElementById('promoCode');
const promoButton = document.getElementById('promoButton');
const promoMessage = document.getElementById('promoMessage');
const totalPriceDisplay = document.getElementById('totalPriceDisplay');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');
const btnSpinner = document.getElementById('btnSpinner');

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

    if (discountApplied) {
        total = total * 0.8;
    }

    totalPriceDisplay.innerText =
        total.toLocaleString('hu-HU') + ' Ft';


    return total;
}

function applyPromo() {

    const promoInput =
        promoCode.value.trim().toUpperCase();


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

async function handleTicketPurchase(event) {

    event.preventDefault();

    submitBtn.disabled = true;

    btnText.innerText =
        'Feldolgozás folyamatban...';

    btnSpinner.classList.remove('d-none');

    const selectedOption =
        ticketType.options[ticketType.selectedIndex];

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

        if (!response.ok) {
            throw new Error(
                'Hálózati hiba történt a rendelés során.'
            );
        }

        const jsonResponseData =
            await response.json();


        console.log(
            'Szerver válasz:',
            jsonResponseData
        );

        const simulatedOrderId =
            'SF-' +
            Math.floor(
                100000 +
                Math.random() * 900000
            );

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

        const modalElement =
            document.getElementById(
                'orderSuccessModal'
            );


        const successModal =
            new bootstrap.Modal(modalElement);


        successModal.show();

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

        submitBtn.disabled = false;

        btnText.innerText =
            'Jegyek Megrendelése';

        btnSpinner.classList.add('d-none');
    }
}

ticketType.addEventListener(
    'change',
    calculateTotal
);

ticketQuantity.addEventListener(
    'input',
    calculateTotal
);

ticketQuantity.addEventListener(
    'change',
    calculateTotal
);

promoButton.addEventListener(
    'click',
    applyPromo
);

promoCode.addEventListener(
    'keydown',
    function (event) {

        if (event.key === 'Enter') {

            event.preventDefault();

            applyPromo();
        }
    }
);

ticketForm.addEventListener(
    'submit',
    handleTicketPurchase
);

calculateTotal();
