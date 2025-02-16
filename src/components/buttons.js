const buttons = () => {
  const cartDishesContainer = document?.querySelector(".cart-dishes");
  const btnOpenCart = document?.querySelector(".btn-open-cart");
  const cart = document?.querySelector(".cart");
  const closeIcon = document?.querySelector(".cart .close-icon");

  var isCartOpen = false;

  const isSmallScreen = () => window.innerWidth <= 960;
  const hasItemsInCart = () => cartDishesContainer?.querySelectorAll(".cart-dish-card").length > 0;

  const toggleCartVisibility = (isVisible) => {
    cart.classList.toggle("visible", isVisible);
    cart.classList.toggle("hidden", !isVisible);
  };

  const toggleCartAnimation = (isOpening) => {
    cart.classList.toggle("slide-in", isOpening);
    cart.classList.toggle("slide-out", !isOpening);
  };

  const updateCartButtonVisibility = () => {
    if (isSmallScreen()) {
      btnOpenCart.classList.toggle("visible", hasItemsInCart());
      if (!isCartOpen) {
        toggleCartVisibility(false);
      }
    } else {
      btnOpenCart.classList.remove("visible");
      toggleCartVisibility(true);
      cart.classList.remove("slide-in", "slide-out");
    }
  };

  const openCart = () => {
    isCartOpen = true;
    btnOpenCart.classList.remove("visible");
    toggleCartAnimation(true);
    toggleCartVisibility(true);
  };

  const closeCart = () => {
    if (!isSmallScreen()) return;
    isCartOpen = false;
    toggleCartAnimation(false);
    setTimeout(() => {
      toggleCartVisibility(false);
      btnOpenCart.classList.toggle("visible", hasItemsInCart());
    }, 500);
  };

  btnOpenCart?.addEventListener("click", openCart);
  closeIcon?.addEventListener("click", closeCart);
  window.addEventListener("resize", updateCartButtonVisibility);

  if (cartDishesContainer) {
    new MutationObserver(updateCartButtonVisibility).observe(cartDishesContainer, { childList: true });
  }

  updateCartButtonVisibility();
};

export default buttons;