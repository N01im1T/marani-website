import "../src/assets/styles/poster.css";

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

   // Listener for active links in page navigations
  function syncActiveLinks(navSelectors) {
    const navs = navSelectors.map((selector) => document.querySelector(selector)).filter(Boolean);
    if (navs.length < 2) return; // Necessary min 2
  
    const updateActiveClass = (target, links) => {
      links.forEach((link) => link.classList.remove("active"));
      target.classList.add("active");
    };
  
    const syncLinks = (clickedLink, clickedNav) => {
      const clickedNavLinks = [...clickedNav.querySelectorAll(".page-nav-slide")];
      const clickedIndex = clickedNavLinks.indexOf(clickedLink);
  
      if (clickedIndex !== -1) {
        navs.forEach((nav) => {
          const navLinks = [...nav.querySelectorAll(".page-nav-slide")];
          updateActiveClass(navLinks[clickedIndex], navLinks);
        });
      }
    };
  
    navs.forEach((nav) => {
      nav.addEventListener("click", (e) => {
        const link = e.target.closest(".page-nav-slide");
        if (link) syncLinks(link, nav);
      });
    });
  }
  
  syncActiveLinks([
    ".sticky-nav-menu .page-nav-slides",
    "#static-nav-menu .page-nav-slides",
  ]);
});