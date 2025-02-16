import Inputmask from "inputmask";
import "choices.js/public/assets/styles/choices.min.css";

const inputs = (container = document) => {
  // Cart toggle
  const checkboxes = document.querySelectorAll(".checkbox");

  // Selector for elements that may not exist
  const elements = {
    deliveryContainer: document.querySelector(".cart-container-delivery"),
    pickupContainer: document.querySelector(".cart-container-pickup"),
    deliveryForm: document.querySelector(".delivery-form"),
    pickupForm: document.querySelector(".pickup-form"),
    deliveryCheckout: document.querySelector(".checkout-delivery-address"),
    pickupCheckout: document.querySelector(".checkout-pickup-address"),
    headerText: document.querySelector("#header-change-address"),
  };

  // Function to enable/disable classes on elements
  const toggleClass = (element, className, add) => {
    if (element) {
      add
        ? element.classList.add(className)
        : element.classList.remove(className);
    }
  };

  // Component switching function
  const toggleComponents = (checked) => {
    toggleClass(elements.deliveryContainer, "active", !checked);
    toggleClass(elements.pickupContainer, "active", checked);
    toggleClass(elements.deliveryForm, "active", !checked);
    toggleClass(elements.pickupForm, "active", checked);
    toggleClass(elements.deliveryCheckout, "active", !checked);
    toggleClass(elements.pickupCheckout, "active", checked);

    if (elements.headerText) {
      elements.headerText.textContent = checked
        ? "Выберете адрес самовывоза"
        : "Выберете адрес доставки";
    }
  };

  // Synchronizing the state of checkboxes
  const syncCheckboxes = (checked) => {
    checkboxes.forEach((checkbox) => {
      checkbox.checked = checked;
    });
    toggleComponents(checked);
  };

  // Setting event handlers for all checkboxes
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      syncCheckboxes(checkbox.checked);
    });
  });

  // Setting the initial state
  if (checkboxes.length > 0) {
    toggleComponents(checkboxes[0].checked);
  }

  const masks = {
    phone: new Inputmask({
      mask: "+7(999) - 999 - 99 - 99",
      showMaskOnHover: false,
      clearIncomplete: true,
      placeholder: "+7(999) - 999 - 99 - 99",
    }),
    date: new Inputmask({
      mask: "Dd.Mm",
      placeholder: "00.00",
      showMaskOnHover: false,
      clearIncomplete: true,
      definitions: {
        D: {
          validator: "[0-3]",
          cardinality: 1,
        },
        d: {
          validator: (chrs, maskset, pos, strict, opts) => {
            const firstDigit = maskset.buffer[0] || "0";
            return (
              (firstDigit === "3" && /^[0-1]$/.test(chrs)) ||
              (firstDigit !== "3" && /^[0-9]$/.test(chrs))
            );
          },
          cardinality: 1,
        },
        M: {
          validator: "[0-1]",
          cardinality: 1,
        },
        m: {
          validator: (chrs, maskset, pos, strict, opts) => {
            const firstDigit = maskset.buffer[3] || "0";
            if (firstDigit === "0") {
              return /^[1-9]$/.test(chrs);
            } else if (firstDigit === "1") {
              return /^[0-2]$/.test(chrs);
            }
            return false;
          },
          cardinality: 1,
        },
      },
    }),
    time: new Inputmask({
      mask: "Hh:Mm",
      alias: "time",
      insertMode: false,
      showMaskOnHover: false,
      clearIncomplete: true,
      definitions: {
        H: {
          validator: "[0-2]",
          cardinality: 1,
        },
        h: {
          validator: (chrs, maskset, pos, strict, opts) => {
            const firstDigit = maskset.buffer[0] || "0";
            return (
              (firstDigit === "2" && /^[0-3]$/.test(chrs)) ||
              (firstDigit !== "2" && /^[0-9]$/.test(chrs))
            );
          },
          cardinality: 1,
        },
        M: {
          validator: "[0-5]",
          cardinality: 1,
        },
        m: {
          validator: "[0-9]",
          cardinality: 1,
        },
      },
    }),
    apartment: new Inputmask({
      mask: "9{1,}",
      showMaskOnHover: false,
      clearIncomplete: true,
    }),
    peopleAmount: new Inputmask({
      mask: "9{1,}",
      showMaskOnHover: false,
      clearIncomplete: true,
    }),
    name: new Inputmask({
      mask: "*{1,30}",
      definitions: {
        "*": {
          validator: "[а-яА-ЯёЁa-zA-Z\\s-]",
          cardinality: 1,
        },
      },
      showMaskOnHover: false,
      clearIncomplete: true,
    }),
  };

  const applyMasks = () => {
    document.querySelectorAll('input[type="tel"]').forEach((input) => {
      masks.phone.mask(input);
    });

    document.querySelectorAll(".date").forEach((input) => {
      masks.date.mask(input);
    });

    document.querySelectorAll(".time").forEach((input) => {
      masks.time.mask(input);
    });

    document.querySelectorAll(".apartaments").forEach((input) => {
      masks.apartment.mask(input);
    });

    document.querySelectorAll(".people-amount").forEach((input) => {
      masks.peopleAmount.mask(input);
    });

    document.querySelectorAll(".name").forEach((input) => {
      masks.name.mask(input);
    });
  };

  applyMasks();

  const label = document?.getElementById("custom-label");
  const dropdown = document?.getElementById("custom-dropdown");

  
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