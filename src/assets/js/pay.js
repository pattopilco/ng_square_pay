var payments;
var card;
var paymentResults
var amount;

function getPayments(){
  return payments;
}

function getCard(){
  return card;
}

async function initPayments(applicationId,locationId) {
  if (!window.Square) {
    console.log('Square.js failed to load properly');
  }
  this.locationId = locationId;

  try {
    payments = window.Square.payments(applicationId, locationId);
  } catch {
    const statusContainer = document.getElementById(
      'payment-status-container'
    );
    statusContainer.className = 'missing-credentials';
    statusContainer.style.visibility = 'visible';
    return;
  }

  try {
    card = await initializeCard(payments);
  } catch (e) {
    console.error('Initializing Card failed', e);
    return;
  }
}


async function initializeCard(payments) {
  const card = await payments.card();
  await card.attach('#card-container');
  return card;
}

async function createPayment(apiPayment,token, verificationToken, locationId, amount) {
  const body = JSON.stringify({
    locationId,
    sourceId: token,
    verificationToken,
    idempotencyKey: window.crypto.randomUUID(),
    referenceId:'PAGO0001',
    note: 'Nota del PAGO0001',
    amount: amount,
    currency: 'USD'
  });


  const paymentResponse = await fetch(apiPayment, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body
  });

  if (paymentResponse.ok) {
    return paymentResponse.json();
  }
  const errorBody = await paymentResponse.text();
  throw new Error(errorBody);
}


async function tokenize(paymentMethod) {
  const tokenResult = await paymentMethod.tokenize();
  if (tokenResult.status === 'OK') {
    return tokenResult.token;
  } else {
    let errorMessage = `Tokenization failed with status: ${tokenResult.status}`;
    if (tokenResult.errors) {
      errorMessage += ` and errors: ${JSON.stringify(
        tokenResult.errors
      )}`;
    }
    throw new Error(errorMessage);
  }
}


async function verifyBuyer(payments, token) {
  const verificationDetails = {
    amount: '1.00',
    billingContact: {
      addressLines: ['123 Main Street', 'Apartment 1'],
      familyName: 'Doe',
      givenName: 'John',
      email: 'jondoe@gmail.com',
      country: 'GB',
      phone: '3214563987',
      region: 'LND',
      city: 'London',
    },
    currencyCode: 'GBP',
    intent: 'CHARGE',
  };

  const verificationResults = await payments.verifyBuyer(
    token,
    verificationDetails
  );
  return verificationResults.token;
}

      // status is either SUCCESS or FAILURE;
function displayPaymentResults(status) {
        const statusContainer = document.getElementById(
          'payment-status-container'
        );
        if (status === 'SUCCESS') {
          statusContainer.classList.remove('is-failure');
          statusContainer.classList.add('is-success');
        } else {
          statusContainer.classList.remove('is-success');
          statusContainer.classList.add('is-failure');
        }
        statusContainer.style.visibility = 'visible';
}

async function handlePaymentMethodSubmission(apiPayment,card, payments, locationId, amount) {
  let cardButton = document.getElementById('card-button');
  try {
    // disable the submit button as we await tokenization and make a payment request.
    cardButton.disabled = true;
    const token = await tokenize(card);
    const verificationToken = await verifyBuyer(payments, token);
    paymentResults = await createPayment(
      apiPayment,
      token,
      verificationToken,
      locationId,
      amount
    );
    displayPaymentResults('SUCCESS');
    console.debug('Payment Success', paymentResults);
    return paymentResults;
  } catch (e) {
    cardButton.disabled = false;
    displayPaymentResults('FAILURE');
    console.error(e.message);
  }
}
