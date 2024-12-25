const modals = () => {
  // Counter handler
  document.body.addEventListener("click", (event) => {
    const target = event.target;

    if (
      !target.classList.contains("counter-plus") &&
      !target.classList.contains("counter-minus")
    ) {
      return;
    }

    const amountCounter = target.closest(".amount-counter");
    if (!amountCounter) return;

    const amountSpan = amountCounter.querySelector(".counter-amount");
    var currentAmount = parseInt(amountSpan.textContent, 10);
    const isIncrement = target.classList.contains("counter-plus");
    const cartDishCard = target.closest(".cart-dish-card");

    currentAmount += isIncrement ? 1 : -1;

    if (cartDishCard && currentAmount < 1) {
      cartDishCard.remove();
      return;
    }

    amountSpan.textContent = Math.max(currentAmount, 1);
  });

  // Handlers for modal windows
  const modals = document.querySelectorAll(".modal");
  const closeIcons = document.querySelectorAll(".close-icon");

  const btnsChangeAddress = document.querySelectorAll(".btn-change-address");
  const btnBookTable = document.querySelectorAll(".btn-book-table");

  const modalChangeAddress = document.querySelector(".modal-change-address");
  const modalBookTable = document.querySelector(".modal-book-table");
  const modalChooseDishOption = document.querySelector(".modal-choose-option");

  // Variables for Choose dish option modal
  const dishCards = document.querySelectorAll(
    '.dish-card[data-attr="variable"]'
  );
  const modalChooseOptionImg =
    modalChooseDishOption?.querySelector(".dish-card-img");
  const modalChooseOptionName =
    modalChooseDishOption?.querySelector(".dish-card-name");
  const modalChooseOptionPrice = modalChooseDishOption?.querySelector(".price");
  const modalChooseOptionWeight =
    modalChooseDishOption?.querySelector(".weight");

  function openModal(modal) {
    modal.classList.remove("fade-out");
    modal.classList.add("fade-in");
    modal.style.display = "block";
  }

  function closeModal(modal, modalCloseDelay) {
    modal.classList.remove("fade-in");
    modal.classList.add("fade-out");
    setTimeout(() => (modal.style.display = "none"), modalCloseDelay);
  }

  closeIcons.forEach((btn) => {
    btn.addEventListener("click", () => {
      modals.forEach((modal) => closeModal(modal, 500));
    });
  });

  modals.forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal(modal, 500);
      }
    });
  });

  btnsChangeAddress.forEach((btn) => {
    btn.addEventListener("click", () => openModal(modalChangeAddress));
  });

  btnBookTable.forEach((btn) => {
    btn.addEventListener("click", () => openModal(modalBookTable));
  });

  // Choose option modal handler
  if (dishCards.length > 0) {
    dishCards.forEach((card) => {
      const addButton = card.querySelector(".btn-add-to-cart");

      addButton?.addEventListener("click", () => {
        // Get data from dish card
        const imgSrc = card.querySelector("img")?.src;
        const dishName = card.querySelector(".dish-header")?.textContent;
        const price = card.querySelector(".price")?.textContent;
        const weight = card.querySelector(".weight")?.textContent;

        if (
          modalChooseDishOption &&
          modalChooseOptionImg &&
          modalChooseOptionName &&
          modalChooseOptionPrice &&
          modalChooseOptionWeight
        ) {
          // Fill modal window
          modalChooseOptionImg.src = imgSrc || "";
          modalChooseOptionName.textContent =
            dishName || "Название отсутствует";
          modalChooseOptionPrice.textContent = price || "0";
          modalChooseOptionWeight.textContent = weight || "---";

          // Open modal window
          openModal(modalChooseDishOption);
        }
      });
    });
  }

  /**
   * Populates the options-wrapper with options based on backend data.
   * @param {Array<{name: string, price: number, isFree: boolean}>} options - Array of objects containing option data.
   *    - `name` (string): The name of the option.
   *    - `price` (number): The price of the option in rubles.
   *    - `isFree` (boolean): Indicates whether the option is free.
   * @returns {void} Does not return a value.
   */
  const populateOptions = (options) => {
    const optionsWrapper = document.querySelector(".options-wrapper");

    // Clean existed options
    if (optionsWrapper) {
      optionsWrapper.innerHTML = "";

      // Create new options
      options.forEach((option, index) => {
        const isFreeText = option.isFree ? "Бесплатно" : `+${option.price}₽`;

        // Create DOM-element for option
        const optionHTML = `
          <div class="dish-option">
            <label class="radio-label">
              <input type="radio" name="dish-option" class="radio-input" value="${option.name}" id="option-${index}" />
              <span class="radio-custom"></span>
              <span class="choose-time-checkbox-text">${option.name}</span>
            </label>
            <span class="option-price">${isFreeText}</span>
          </div>
        `;

        optionsWrapper.insertAdjacentHTML("beforeend", optionHTML);
      });
    } else {
      console.error("Контейнер .options-wrapper не найден.");
    }
  };
};

export default modals;
