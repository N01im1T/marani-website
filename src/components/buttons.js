const buttons = () => {
  const cartDishesContainer = document.querySelector(".cart-dishes");
  const btnOpenCart = document.querySelector(".btn-open-cart");
  const cart = document.querySelector(".cart");
  const closeIcon = document.querySelector(".cart .close-icon");

  // Флаг, чтобы отслеживать, открыта ли корзина
  let isCartOpen = false;

  // Mobile open cart button visibility function
  function updateCartButtonVisibility() {
    if (!cartDishesContainer || !btnOpenCart) return;

    const hasItemsInCart = cartDishesContainer.querySelectorAll(".cart-dish-card").length > 0;
    const isSmallScreen = window.innerWidth <= 960;

    if (isSmallScreen) {
      // Mobile behavior
      if (hasItemsInCart) {
        btnOpenCart.classList.add("visible");
      } else {
        btnOpenCart.classList.remove("visible");
      }

      if (!isCartOpen) {
        cart.classList.remove("visible"); // Hide cart if not open
        cart.classList.add("hidden");
      }
    } else {
      // Desktop behavior: always show the cart
      btnOpenCart.classList.remove("visible");
      cart.classList.add("visible");
      cart.classList.remove("hidden", "slide-in", "slide-out");
    }
  }

  // Event listeners for open and close buttons
  btnOpenCart.addEventListener("click", () => {
    isCartOpen = true;
    btnOpenCart.classList.remove("visible");
    cart.classList.add("slide-in");
    cart.classList.remove("slide-out", "hidden");
    cart.classList.add("visible");
  });

  closeIcon.addEventListener("click", () => {
    const hasItemsInCart = cartDishesContainer.querySelectorAll(".cart-dish-card").length > 0;
    const isSmallScreen = window.innerWidth <= 960;

    if (isSmallScreen) {
      isCartOpen = false;
      cart.classList.remove("slide-in");
      cart.classList.add("slide-out");
      setTimeout(() => {
        cart.classList.remove("visible");
        cart.classList.add("hidden");
      }, 500);
      if (hasItemsInCart) {
        btnOpenCart.classList.add("visible");
      }
    }
  });

  // Observe changes in the cart dishes container
  const observer = new MutationObserver(() => {
    updateCartButtonVisibility();
  });

  // Start observing for child node changes
  if (cartDishesContainer) {
    observer.observe(cartDishesContainer, {
      childList: true, // Watch for added or removed child nodes
    });
  }

  // Listen for window resize
  window.addEventListener("resize", updateCartButtonVisibility);

  // Initial call to set visibility state
  updateCartButtonVisibility();
};

export default buttons;