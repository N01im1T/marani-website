const header = () => {
  const mobileMenu = document.querySelector(".mobile-menu");
  const burgerBtn = document.querySelector(".btn-mobile-burger");
  const closeBtn = document.querySelector(".mobile-btn-close-top-menu");

  const toggleMenuAnimation = (isOpening) => {
    mobileMenu.classList.toggle("slide-in", isOpening);
    mobileMenu.classList.toggle("slide-out", !isOpening);
  };

  const toggleMenuVisibility = (isVisible) => {
    mobileMenu.style.display = isVisible ? "block" : "none";
  };

  const handleResize = () => {
    if (window.innerWidth > 960) {
      toggleMenuAnimation(false);
      setTimeout(() => toggleMenuVisibility(false), 500);
      burgerBtn.disabled = false;
    }
  };

  const openMenu = () => {
    toggleMenuAnimation(true);
    toggleMenuVisibility(true);
    burgerBtn.disabled = true;
  };

  const closeMenu = () => {
    toggleMenuAnimation(false);
    setTimeout(() => toggleMenuVisibility(false), 500);
    burgerBtn.disabled = false;
  };

  window.addEventListener("resize", handleResize);
  handleResize();

  burgerBtn?.addEventListener("click", openMenu);
  closeBtn?.addEventListener("click", closeMenu);
};

export default header;