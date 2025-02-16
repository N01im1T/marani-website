import "../src/assets/styles/checkout.css";

document.addEventListener("DOMContentLoaded", () => {
  // Drag and scroll for sliders
  const enableDragAndScroll = (containerSelector) => {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    var isDragging = false;
    var startX, scrollLeft;

    const startDragging = (e) => {
      if (e.target.tagName !== "A") {
        e.preventDefault();
      }
      isDragging = true;
      container.classList.add("dragging");
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
      container.style.cursor = "grabbing";
    };

    const stopDragging = () => {
      isDragging = false;
      container.classList.remove("dragging");
      container.style.cursor = "auto";
    };

    const onDrag = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 1.5;
      container.scrollLeft = scrollLeft - walk;
    };

    const onWheelScroll = (e) => {
      e.preventDefault();
      const scrollAmount = 300; // scroll step
      container.scrollBy({
        left: e.deltaY > 0 ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    };

    container.addEventListener("mousedown", startDragging);
    container.addEventListener("mouseleave", stopDragging);
    container.addEventListener("mouseup", stopDragging);
    container.addEventListener("mousemove", onDrag);
    container.addEventListener("wheel", onWheelScroll);
  };

  enableDragAndScroll("#static-nav-menu .page-nav-slides");
  enableDragAndScroll(".sticky-nav-menu .page-nav-slides");

  // Sticky menu navigation handler
  const stickyMenu = document.querySelector(".sticky-nav-menu");
  const triggerElement = document.querySelector("#static-nav-menu");

  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      stickyMenu.classList.toggle("static", !entry.isIntersecting);
      stickyMenu.classList.toggle("hidden", entry.isIntersecting);
    },
    { threshold: 0 }
  );

  observer.observe(triggerElement);

  // Cart scroll
  const cart = document.querySelector(".cart");
  const stopBlock = document.querySelector(".map");
  const dishesMenuBlock = document.querySelector(".checkout-form");

  const updateMetrics = () => {
    const stopBlockTop = stopBlock.offsetTop;
    const pageHeight = document.documentElement.scrollHeight;
    const viewportHeight = window.innerHeight;

    if (dishesMenuBlock) {
      const referenceRect = dishesMenuBlock.getBoundingClientRect();
      cart.style.right = `${document.documentElement.clientWidth - referenceRect.right + 25}px`;
    }
  };

  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    const cartHeight = cart.offsetHeight;
    const cartBottom = cart.getBoundingClientRect().bottom;

    if (
      !cart.classList.contains("stop") &&
      scrollPosition + cartBottom >= stopBlock.offsetTop - 20
    ) {
      cart.classList.remove("sticky");
      cart.classList.add("stop");
      cart.style.top = `${stopBlock.offsetTop - cartHeight - 20}px`;
    } else if (
      cart.classList.contains("stop") &&
      scrollPosition + cartHeight < stopBlock.offsetTop - 180
    ) {
      cart.classList.remove("stop");
      cart.classList.add("sticky");
      cart.style.top = "";
    }
  };

  const handleSmallScreen = () => {
    // Add logic for small screens if needed
  };

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

  updateMetrics();
  updateLogic();
  window.addEventListener("resize", updateLogic);
});