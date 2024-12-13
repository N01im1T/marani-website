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
    gap: 40,
    animationDuration: 1000,
    autoplay: 4000,
    hoverpause: true,
    rewindDuration: 3000,
    keyboard: true,
  });

  headerDishSlider.mount();

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

  var stopBlockBottom;
  var pageHeight;
  var viewportHeight;

  const updateMetrics = () => {
    if (!stopBlock || !cart || !dishesMenuBlock) return;

    stopBlockBottom = stopBlock.offsetTop + stopBlock.offsetHeight; // Bottom line
    pageHeight = document.documentElement.scrollHeight;
    viewportHeight = window.innerHeight;

    const referenceRect = dishesMenuBlock.getBoundingClientRect();
    cart.style.right = `${document.documentElement.clientWidth - referenceRect.right + 25}px`;
  };

  const handleScroll = () => {
    if (!cart || !stopBlock) return;

    const scrollPosition = window.scrollY;
    const cartHeight = cart.offsetHeight;

    if (scrollPosition + cartHeight + 120 > stopBlockBottom + 40) {
      cart.classList.remove("sticky");
      cart.classList.add("stop");

      const bottomDistance = pageHeight - stopBlockBottom;
      cart.style.bottom = `${bottomDistance}px`;
    } else if (
      cart.classList.contains("stop") &&
      cart.getBoundingClientRect().top >= 200
    ) {
      cart.classList.remove("stop");
      cart.classList.add("sticky");
      cart.style.bottom = "";
    }
  };

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
    const navs = navSelectors
      .map((selector) => document.querySelector(selector))
      .filter(Boolean);
    if (navs.length < 2) return; // Necessary min 2

    const updateActiveClass = (target, links) => {
      links.forEach((link) => link.classList.remove("active"));
      target.classList.add("active");
    };

    const syncLinks = (clickedLink, clickedNav) => {
      const clickedNavLinks = [
        ...clickedNav.querySelectorAll(".page-nav-slide"),
      ];
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

  // Stories slider modal
  const storiesElements = document.querySelectorAll(".story");
  const modal = document.querySelector(".instagram-stories-modal");
  const modalContainer = document.querySelector(
    ".instagram-stories-modal-container"
  );
  const btnNext = document.querySelector(".instagram-stories-btn-next");
  const btnPrev = document.querySelector(".instagram-stories-btn-prev");
  const closeBtn = document.querySelector(".instagram-stories-btn-close-modal");

  // Current img index
  var currentIndex = 0;

  // Timer and progress
  var progressIntervals = [];
  var isModalOpen = false;

  var isPaused = false;
  var currentProgress = 0;

  const images = Array.from(
    document.querySelectorAll(".story-photo-source")
  ).map((i) => i.dataset.full);

  const updateModalContent = () => {
    const progressBars = images.map(
      (_, index) => `
      <div class="instagram-storie-progress-item">
        <div
          class="instagram-storie-progress-item-bar"
          style="width: 0%;"
          data-index="${index}"
        ></div>
      </div>`
    );

    modalContainer.innerHTML = `
      <div class="instagram-storie-progress">
        ${progressBars.join("")}
      </div>
      <div class="instagram-storie-wrapper">
        <img
          class="instagram-storie-image"
          src="${images[currentIndex]}"
          alt="Image ${currentIndex + 1}"
        />
      </div>
    `;
  };

  const startProgress = () => {
    if (isPaused) return;

    const progressBar = modalContainer.querySelector(
      `.instagram-storie-progress-item-bar[data-index="${currentIndex}"]`
    );

    clearInterval(progressIntervals[currentIndex]);

    progressIntervals[currentIndex] = setInterval(() => {
      if (!isPaused) {
        currentProgress += 2;
        if (currentProgress <= 100) {
          progressBar.style.width = `${currentProgress}%`;
        } else {
          clearInterval(progressIntervals[currentIndex]);
          currentProgress = 0;
          nextImage();
        }
      }
    }, 100);
  };

  const stopProgress = () => {
    progressIntervals.forEach(clearInterval);
  };

  const nextImage = () => {
    if (currentIndex < images.length - 1) {
      currentIndex++;
      currentProgress = 0;
      updateModalContent();
      startProgress();
    } else {
      closeModal(); // Close modal if last img
    }
  };

  const prevImage = () => {
    if (currentIndex > 0) {
      currentIndex--;
      currentProgress = 0;
      updateModalContent();
      startProgress();
    }
  };

  const openModal = (index) => {
    if (isModalOpen) return;

    currentIndex = index;
    isModalOpen = true;

    modal.style.display = "block";
    modal.classList.add("fade-in");
    modalContainer.classList.add("slide-in");
    modal.classList.remove("fade-out");
    modalContainer.classList.remove("slide-out");

    updateModalContent();
    startProgress();
  };

  const closeModal = () => {
    stopProgress();
    isModalOpen = false;

    modal.style.display = "none";
    modal.classList.remove("fade-in");
    modal.classList.add("fade-out");
    modal.classList.remove("fade-in");
    modalContainer.classList.remove("slide-in");
  };

  // Story items click listener
  storiesElements.forEach((storyElement, index) => {
    storyElement.addEventListener("click", () => openModal(index));
  });

  // Next and Previous button handlers
  btnNext.addEventListener("click", () => {
    stopProgress();
    nextImage();
  });

  btnPrev.addEventListener("click", () => {
    stopProgress();
    prevImage();
  });

  // Modal window click listener (Next and Prev img)
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      const clickX = e.clientX;
      const modalWidth = modal.offsetWidth;
      а;

      if (clickX < modalWidth / 2) {
        stopProgress();
        prevImage(); // The left side brings up the previous story
      } else {
        stopProgress();
        nextImage(); // The right side brings up the next story
      }
    }
  });

  modalContainer.addEventListener("click", (e) => {
    const clickedElement = e.target;
    if (clickedElement.classList.contains("instagram-storie-image")) {
      if (isPaused) {
        isPaused = false;
        startProgress();
      } else {
        isPaused = true;
        stopProgress();
      }
    }
  });

  closeBtn.addEventListener("click", () => closeModal());
});
