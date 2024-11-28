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
  enableDragAndScroll(".scroll-stories");

  // Cart scroll
  const cart = document.querySelector(".cart");
  const stopBlock = document.querySelector(".dishes-menu");
  const dishesMenuBlock = document.querySelector(".dishes-menu");

  let stopBlockBottom = stopBlock.offsetTop + stopBlock.offsetHeight; // Bottom line
  let pageHeight = document.documentElement.scrollHeight;
  let viewportHeight = window.innerHeight;

  const updateMetrics = () => {
    stopBlockBottom = stopBlock.offsetTop + stopBlock.offsetHeight; // Refresh bottom line
    pageHeight = document.documentElement.scrollHeight;
    viewportHeight = window.innerHeight;

    // Calculate right indent relative to dishesMenuBlock
    if (dishesMenuBlock) {
      const referenceRect = dishesMenuBlock.getBoundingClientRect();
      cart.style.right = `${document.documentElement.clientWidth - referenceRect.right + 25}px`;
    }
  };

  updateMetrics();

  // Cart state management function
  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    const cartHeight = cart.offsetHeight;

    const currentTopOffset = cart.getBoundingClientRect().top;

    // If the basket has reached the bottom block
    if (scrollPosition + cartHeight + 120 > stopBlockBottom) {
      cart.classList.remove("sticky");
      cart.classList.add("stop");

      // Calculate the distance from the bottom border of stopBlock to the end of the page
      const bottomDistance = pageHeight - stopBlockBottom;
      cart.style.bottom = `${bottomDistance}px`;
    } 
    // If the basket returns to a fixed state
    else if (
      cart.classList.contains("stop") &&
      (currentTopOffset >= 169)
    ) {
      cart.classList.remove("stop");
      cart.classList.add("sticky");
      cart.style.bottom = ""; // Remove dinamyc bottom
    }
  };

  // Listener for scroll
  window.addEventListener("scroll", handleScroll);

  // Listener for resize
  window.addEventListener("resize", updateMetrics);


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