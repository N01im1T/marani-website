const modals = () => {
  // Cart toggle
  const checkboxes = document.querySelectorAll(".checkbox");

  // Селекторы для элементов, которые могут отсутствовать
  const elements = {
    deliveryContainer: document.querySelector(".cart-container-delivery"),
    pickupContainer: document.querySelector(".cart-container-pickup"),
    deliveryForm: document.querySelector(".delivery-form"),
    pickupForm: document.querySelector(".pickup-form"),
    deliveryCheckout: document.querySelector(".checkout-delivery-address"),
    pickupCheckout: document.querySelector(".checkout-pickup-address"),
    headerText: document.querySelector("#header-change-address")
  };

  // Функция для включения/выключения классов на элементах
  const toggleClass = (element, className, add) => {
    if (element) {
      add ? element.classList.add(className) : element.classList.remove(className);
    }
  };

  // Функция переключения компонентов
  const toggleComponents = (checked) => {
    const action = checked ? 'remove' : 'add';

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

  // Синхронизация состояния чекбоксов
  const syncCheckboxes = (checked) => {
    checkboxes.forEach((checkbox) => {
      checkbox.checked = checked;
    });
    toggleComponents(checked);
  };

  // Установка обработчиков событий для всех чекбоксов
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      syncCheckboxes(checkbox.checked);
    });
  });

  // Установка начального состояния
  if (checkboxes.length > 0) {
    toggleComponents(checkboxes[0].checked);
  }

  // Add event listener for dishes container
  document.body.addEventListener("click", (event) => {
    const target = event.target;
  
    if (target.classList.contains("counter-plus") || target.classList.contains("counter-minus")) {
      const dishCard = target.closest(".dish-card-wrapper");
      if (!dishCard) return;
  
      const amountSpan = dishCard.querySelector(".counter-amount");
      let currentAmount = parseInt(amountSpan.textContent, 10);
  
      if (target.classList.contains("counter-plus")) {
        currentAmount++;
      } else if (target.classList.contains("counter-minus")) {
        currentAmount--;
  
        if (currentAmount < 1) {
          dishCard.closest(".cart-dish-card").remove();
          return;
        }
      }
  
      amountSpan.textContent = currentAmount;
    }
  });

  // Open close modals

  const modals = document.querySelectorAll(".modal");
  const closeIcons = document.querySelectorAll(".close-icon");

  // Buttons

  const btnsChangeAddress = document.querySelectorAll(".btn-change-address");
  const btnBookTable = document.querySelectorAll(".btn-book-table");

  // Modals

  const modalChangeAddress = document.querySelector(".modal-change-address")
  const modalBookTable = document.querySelector(".modal-book-table");

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
      modals.forEach((modal) => closeModal(modal, 1000))
    });
  });

  modals.forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal(modal, 1000);
      }
    });
  });

  btnsChangeAddress.forEach((btn) => {
    btn.addEventListener("click", () => openModal(modalChangeAddress));
  });

  btnBookTable.forEach((btn) => {
    btn.addEventListener("click", () => openModal(modalBookTable));
  });
};

export default modals;