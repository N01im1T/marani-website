import Inputmask from "inputmask";
import Choices from 'choices.js';
import 'choices.js/public/assets/styles/choices.min.css';

const inputs = (container = document) => {
  const phoneMask = new Inputmask({
    mask: "+7(999) - 999 - 99 - 99",
    showMaskOnHover: false,
    clearIncomplete: true,
    placeholder: "+7(999) - 999 - 99 - 99",
  });

  const dateMask = new Inputmask({
    mask: "99.99.9999",
    alias: "datetime",
    inputFormat: "dd.mm.yyyy",
    showMaskOnHover: false,
    clearIncomplete: true,
    placeholder: "00.00.0000",
    onincomplete: function () {
      console.log("Ввод даты не завершен.");
    },
  });

  const timeMask = new Inputmask({
    mask: "Hh:Mm",
    placeholder: "00:00",
    alias: "time",
    insertMode: false,
    showMaskOnHover: false,
    clearIncomplete: true,
    definitions: {
      "H": { 
        validator: "[0-2]",
        cardinality: 1,
      },
      "h": {
        validator: (chrs, maskset, pos, strict, opts) => {
          const firstDigit = maskset.buffer[0] || "0";
          return (firstDigit === "2" && /^[0-3]$/.test(chrs)) || (firstDigit !== "2" && /^[0-9]$/.test(chrs));
        },
        cardinality: 1,
      },
      "M": {
        validator: "[0-5]",
        cardinality: 1,
      },
      "m": {
        validator: "[0-9]",
        cardinality: 1,
      },
    },
  });

  const apartmentMask = new Inputmask({
    mask: "9{1,}",
    showMaskOnHover: false,
    clearIncomplete: true,
  });

  const peopleAmountMask = new Inputmask({
    mask: "9{1,}",
    showMaskOnHover: false,
    clearIncomplete: true,
  });

  const nameMask = new Inputmask({
    mask: "*{1,30}",
    definitions: {
      '*': {
        validator: "[а-яА-ЯёЁa-zA-Z\\s-]",
        cardinality: 1,
      },
    },
    showMaskOnHover: false,
    clearIncomplete: true,
  });
  
  document.querySelectorAll('input[type="tel"]').forEach((input) => {
    phoneMask.mask(input);
  });

  document.querySelectorAll('.date').forEach((input) => {
    dateMask.mask(input);
  });

  document.querySelectorAll('.time').forEach((input) => {
    timeMask.mask(input);
  });

  document.querySelectorAll('.apartaments').forEach((input) => {
    apartmentMask.mask(input);
  });

  document.querySelectorAll('.people-amount').forEach((input) => {
    peopleAmountMask.mask(input);
  });

  document.querySelectorAll('.name').forEach((input) => {
    nameMask.mask(input);
  });

  const label = document.getElementById("custom-label");
  const dropdown = document.getElementById("custom-dropdown");
  const options = dropdown.querySelectorAll(".select-option");

  // Show/hide dropdown list
  label.addEventListener("click", () => {
    dropdown.classList.toggle("open");
    label.classList.toggle("focused");
  });

  // Delete focus 
  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target) && !label.contains(e.target)) {
      dropdown.classList.remove("open");
      label.classList.remove("focused");
    }
  });

  // Handler change option
  options.forEach((option) => {
    option.addEventListener("click", () => {
      const text = option.textContent;

      label.textContent = text;

      label.classList.add("selected");

      label.classList.remove("focused");

      dropdown.classList.remove("open");
    });
  });


};

export default inputs;