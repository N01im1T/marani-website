const header = () => {
  const mobileMenu = document.querySelector(".mobile-menu");
  const burgerBtn = document.querySelector(".btn-mobile-burger");
  const closeBtn = document.querySelector(".mobile-btn-close-top-menu");

  function handleResize() {
    if (window.innerWidth > 960) {
      mobileMenu.classList.add("slide-out");
      mobileMenu.classList.remove("slide-in");
      setTimeout(() => {
        mobileMenu.style.display = "none";
      }, 500);
      burgerBtn.disabled = false;
    }
  }

  window.addEventListener("resize", handleResize);
  handleResize();

  burgerBtn.addEventListener("click", function () {
    mobileMenu.classList.add("slide-in");
    mobileMenu.classList.remove("slide-out");
    mobileMenu.style.display = "block";
    burgerBtn.disabled = true;
  });

  closeBtn.addEventListener("click", function () {
    mobileMenu.classList.remove("slide-in");
    mobileMenu.classList.add("slide-out");
    setTimeout(() => {
      mobileMenu.style.display = "none";
    }, 500);
    burgerBtn.disabled = false;
  });
};

export default header;
