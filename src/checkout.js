import "../src/assets/styles/checkout.css";

document.addEventListener("DOMContentLoaded", () => {
  // Drag and scroll for sliders
  function enableDragAndScroll(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    var isDragging = false;
    var startX, scrollLeft;

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
  const dishesMenuBlock = document.querySelector(".checkout-form");

  var stopBlockTop = stopBlock.offsetTop;
  var pageHeight = document.documentElement.scrollHeight;
  var viewportHeight = window.innerHeight;

  // Funcion for update metrics
  const updateMetrics = () => {
    stopBlockTop = stopBlock.offsetTop;
    pageHeight = document.documentElement.scrollHeight;
    viewportHeight = window.innerHeight;

    if (dishesMenuBlock) {
      const referenceRect = dishesMenuBlock.getBoundingClientRect();
      cart.style.right = `${document.documentElement.clientWidth - referenceRect.right + 25}px`;
    }
  };

  updateMetrics();

  // Managing Cart state
  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    const cartHeight = cart.offsetHeight;
    const cartTop = cart.getBoundingClientRect().top;
    const cartBottom = cart.getBoundingClientRect().bottom;

    // If the lower border of the basket reaches the upper border of stopBlock
    if (
      !cart.classList.contains("stop") &&
      scrollPosition + cartBottom >= stopBlockTop - 20
    ) {
      cart.classList.remove("sticky");
      cart.classList.add("stop");

      const topDistance = stopBlockTop - cartHeight - 20;
      cart.style.top = `${topDistance}px`;
    }
    // If the cart returns to a fixed state when scrolling up
    else if (
      cart.classList.contains("stop") &&
      scrollPosition + cartHeight < stopBlockTop - 180
    ) {
      cart.classList.remove("stop");
      cart.classList.add("sticky");
      cart.style.top = "";
    }
  };

  // Logic for <= 960px
  const handleSmallScreen = () => {};

  const updateLogic = () => {
    const screenWidth = window.innerWidth;

    window.removeEventListener("scroll", handleScroll);
    window.removeEventListener("resize", updateMetrics);

    if (screenWidth > 960) {
      updateMetrics();
      handleScroll();
      window.addEventListener("scroll", handleScroll);
      window.addEventListener("resize", updateMetrics);
    } else {
      handleSmallScreen();
    }
  };

  updateLogic();

  window.addEventListener("resize", updateLogic);
});
