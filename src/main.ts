import './scss/main.scss';

document.querySelector('.people-control')!.classList.add('error');

// update result
function updateResult(bill: number, tip: number, people: number): void {
  // calculate tip amount
  const tipAmount = (bill * (tip / 100)) / people;
  const totalAmount = bill / people + tipAmount;

  // remove disabled from button reset
  document.querySelector('.btn-reset')!.removeAttribute('disabled');

  document.querySelector('.js-result-tip-amount')!.innerHTML =
    tipAmount.toFixed(2);

  document.querySelector('.js-result-total')!.innerHTML =
    totalAmount.toFixed(2);
}

// get needed element (bill, tipButton, number of people)
const billInputElement = document.querySelector(
  '#bill-input'
)! as HTMLInputElement;

const tipArrayButton = Array.from(
  document.querySelectorAll('.control-select .btn-select')! as NodeListOf<
    HTMLButtonElement | HTMLInputElement
  >
);

const peopleInputElement = document.querySelector(
  '#people-input'
)! as HTMLInputElement;

function getValues(): {
  bill: number;
  tip: number;
  people: number;
} {
  let tipButton = tipArrayButton.filter((button) =>
    button.classList.contains('active')
  )[0];
  let tip: number;
  if (!tipButton) {
    tip = 0;
  } else {
    tip = parseFloat(tipButton.dataset.tip as string);
  }

  return {
    bill: billInputElement.value ? parseFloat(billInputElement.value) : 0,
    tip,
    people: peopleInputElement.value ? parseFloat(peopleInputElement.value) : 1,
  };
}

// event listener
billInputElement.addEventListener('input', () => {
  const { bill, tip, people } = getValues();

  updateResult(bill, tip, people);
});

tipArrayButton.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    const target = e.target as HTMLButtonElement | HTMLInputElement;

    try {
      document.querySelector('.btn-select.active')!.classList.remove('active');

      target.classList.add('active');
    } catch (error) {
      target.classList.add('active');
    }

    if (target.classList.contains('select-input')) {
      target.addEventListener('input', (ev) => {
        const inputTarget = ev.target as HTMLInputElement;
        inputTarget.dataset.tip = inputTarget.value || '0';
        const { bill, tip, people } = getValues();

        updateResult(bill, tip, people);
      });
      return;
    }

    const { bill, tip, people } = getValues();

    updateResult(bill, tip, people);
  });
});

peopleInputElement.addEventListener('input', (e) => {
  const target = e.target as HTMLInputElement;
  if (target.value === '' || parseInt(target.value) <= 0) {
    document.querySelector('.people-control')!.classList.add('error');
    return;
  } else {
    document.querySelector('.people-control')!.classList.remove('error');
  }

  const { bill, tip, people } = getValues();

  updateResult(bill, tip, people);
});

// reset all
const btnReset = document.querySelector('.btn-reset')! as HTMLButtonElement;
btnReset.addEventListener('click', () => {
  billInputElement.value = '';
  peopleInputElement.value = '';
  tipArrayButton.forEach((btn) => {
    btn.classList.remove('active');
    if (btn.classList.contains('select-input')) {
      btn.value = '';
    }
  });
  updateResult(0, 0, 1);
  btnReset.setAttribute('disabled', 'true');
});
