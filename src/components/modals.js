const modals = () => {
  // Add event listener for dishes container
  document.body.addEventListener("click", (event) => {
    const target = event.target;

    if (
      target.classList.contains("counter-plus") ||
      target.classList.contains("counter-minus")
    ) {
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
  const modalChangeAddress = document.querySelector(".modal-change-address");
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
      modals.forEach((modal) => closeModal(modal, 1000));
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
