import "../src/assets/styles/checkout.css";

document.addEventListener("DOMContentLoaded", () => {
  // Drag and scroll for sliders
  function enableDragAndScroll(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
  
    let isDragging = false;
    let startX, scrollLeft;
  
    // Start of dragging
    container.addEventListener("mousedown", (e) => {
      if (e.target.tagName !== "A") {
        e.preventDefault();
      }
      isDragging = true;
      container.classList.add("dragging");
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
      container.style.cursor = "grabbing";
    });
  
    // End of dragging
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
  
    // Dragging
    container.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 1.5;
      container.scrollLeft = scrollLeft - walk;
    });
  
    // Scroll with the wheel
    container.addEventListener("wheel", (e) => {
      e.preventDefault();
      const scrollAmount = 300; // scroll step
      container.scrollBy({
        left: e.deltaY > 0 ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    });
  }

  enableDragAndScroll("#static-nav-menu .page-nav-slides");
  enableDragAndScroll(".sticky-nav-menu .page-nav-slides");

  //Sticky menu navigation handler
  const stickyMenu = document.querySelector(".sticky-nav-menu");
  const triggerElement = document.querySelector("#static-nav-menu");

  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (!entry.isIntersecting) {
        stickyMenu.classList.add("static");
        stickyMenu.classList.remove("hidden");
      } else {
        stickyMenu.classList.remove("static");
        stickyMenu.classList.add("hidden");
      }
    },
    { threshold: 0 } // If an element goes out of scope
  );

  observer.observe(triggerElement);

  // Cart scroll
  const cart = document.querySelector(".cart");
  const stopBlock = document.querySelector(".map");
  const dishesMenuBlock = document.querySelector(".checkout");

  // Переменные для расчетов
  let stopBlockTop = stopBlock.offsetTop; // Верхняя граница stopBlock
  let pageHeight = document.documentElement.scrollHeight;
  let viewportHeight = window.innerHeight;

  // Функция обновления метрик
  const updateMetrics = () => {
    stopBlockTop = stopBlock.offsetTop; // Обновляем верхнюю границу stopBlock
    pageHeight = document.documentElement.scrollHeight;
    viewportHeight = window.innerHeight;

    // Вычисляем отступ справа относительно dishesMenuBlock
    if (dishesMenuBlock) {
      const referenceRect = dishesMenuBlock.getBoundingClientRect();
      cart.style.right = `${document.documentElement.clientWidth - referenceRect.right + 25}px`;
    }
  };

  updateMetrics();

  // Управление состоянием корзины
  const handleScroll = () => {
    const scrollPosition = window.scrollY; // Позиция прокрутки
    const cartHeight = cart.offsetHeight; // Высота корзины
    const cartTop = cart.getBoundingClientRect().top; // Верхняя граница корзины относительно окна просмотра
    const cartBottom = cart.getBoundingClientRect().bottom; // Нижняя граница корзины

    // Если нижняя граница корзины достигает верхнюю границу stopBlock
    if (
      !cart.classList.contains("stop") && // Проверяем, что корзина не в состоянии stop
      scrollPosition + cartBottom >= stopBlockTop - 20
    ) {
      cart.classList.remove("sticky");
      cart.classList.add("stop");
  
      // Фиксируем корзину относительно верхней границы stopBlock
      const topDistance = stopBlockTop - cartHeight - 20; // Отнимаем высоту корзины и отступ
      cart.style.top = `${topDistance}px`;
    }
    // Если корзина возвращается в фиксированное состояние при скролле вверх
    else if (
      cart.classList.contains("stop") && // Проверяем, что корзина в состоянии stop
      scrollPosition + cartHeight < stopBlockTop - 180 // Условие для возврата вверх
    ) {
      cart.classList.remove("stop");
      cart.classList.add("sticky");
      cart.style.top = ""; // Сбрасываем динамический top
    }
  };

  // Обработчики событий
  window.addEventListener("scroll", handleScroll);
  window.addEventListener("resize", updateMetrics);

  document.body.addEventListener("click", (event) => {
    const target = event.target;
  
    if (target.classList.contains("counter-plus") || target.classList.contains("counter-minus")) {
      const amountCounter = target.closest(".amount-counter");
      if (!amountCounter) return;
  
      const amountSpan = amountCounter.querySelector(".counter-amount");
      let currentAmount = parseInt(amountSpan.textContent, 10);
  
      if (target.classList.contains("counter-plus")) {
        currentAmount++;
      } else if (target.classList.contains("counter-minus")) {
        currentAmount = Math.max(1, currentAmount - 1); // Минимум 1
      }
  
      amountSpan.textContent = currentAmount;
    }
  });
});