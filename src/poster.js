import "../src/assets/styles/poster.css";

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
});
