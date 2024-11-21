import "../src/assets/styles/index.css";

import "/node_modules/@glidejs/glide/dist/css/glide.core.css";

import Glide from "/node_modules/@glidejs/glide";


document.addEventListener("DOMContentLoaded", () => {
  // Header dish slider

  const headerDishSlider = new Glide(".header-bottom-dishes-glide", {
    type: "carousel",
    startAt: 0,
    focusAt: "center",
    perView: 1,
    animationDuration: 1000,
    autoplay: 4000,
    hoverpause: true,
    rewindDuration: 3000,
    keyboard: true,
  });
  
  headerDishSlider.mount();
  
  // Cart toggle
  
  const checkbox = document.querySelector(".checkbox");
  const deliveryDiv = document.querySelector(".cart-container-delivery");
  const pickupDiv = document.querySelector(".cart-container-pickup");
  
  const toggleVisibility = () => {
    if (checkbox.checked) {
      deliveryDiv.classList.remove("active");
      pickupDiv.classList.add("active");
    } else {
      deliveryDiv.classList.add("active");
      pickupDiv.classList.remove("active");
    }
  };
  
  checkbox.addEventListener("change", toggleVisibility);
  
  toggleVisibility();

  // Add event listener for dishes container
  document.body.addEventListener("click", (event) => {
    const target = event.target;

    // Check if the plus or minus button is pressed
    if (target.classList.contains("counter-plus") || target.classList.contains("counter-minus")) {
      const dishCard = target.closest(".dish-card-wrapper");
      const amountSpan = dishCard.querySelector(".counter-amount");
      const priceElement = dishCard.querySelector(".price");
      const initialPrice = parseInt(priceElement.dataset.initialPrice || priceElement.textContent, 10);

      let currentAmount = parseInt(amountSpan.textContent, 10);

      if (!priceElement.dataset.initialPrice) {
        priceElement.dataset.initialPrice = initialPrice;
      }

      if (target.classList.contains("counter-plus")) {
        currentAmount++;
      } else if (target.classList.contains("counter-minus")) {
        currentAmount--;

        if (currentAmount < 1) {
          const parentCard = target.closest(".cart-dish-card");
          parentCard.remove();
          return;
        }
      }

      amountSpan.textContent = currentAmount;

      const newPrice = currentAmount * initialPrice;
      priceElement.textContent = newPrice;
    }
  });

  // Drag and scroll for sliders

  function enableDragAndScroll(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
  
    let isDragging = false;
    let startX, scrollLeft;
  
    // Начало перетаскивания
    container.addEventListener("mousedown", (e) => {
      isDragging = true;
      container.classList.add("dragging");
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
      container.style.cursor = "grabbing";
    });
  
    // Завершение перетаскивания
    container.addEventListener("mouseleave", () => {
      isDragging = false;
      container.classList.remove("dragging");
      container.style.cursor = "auto";
    });
  
    container.addEventListener("mouseup", () => {
      isDragging = false;
      container.classList.remove("dragging");
      container.style.cursor = "auto";
    });
  
    // Перетаскивание
    container.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 1.5; // Регулируйте скорость перетаскивания
      container.scrollLeft = scrollLeft - walk;
    });
  
    // Прокрутка колесом
    container.addEventListener("wheel", (e) => {
      e.preventDefault();
      const scrollAmount = 100; // Регулируйте шаг прокрутки
      container.scrollBy({
        left: e.deltaY > 0 ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    });
  }

  enableDragAndScroll(".header-bottom-page-nav-glide");
  enableDragAndScroll(".scroll-stories");
});