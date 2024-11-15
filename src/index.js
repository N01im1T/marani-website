import "../src/assets/styles/index.css";

function toggleOption(selectedOption) {
  const deliveryRadio = document.getElementById("delivery");
  const pickupRadio = document.getElementById("pickup");

  if (selectedOption === "delivery") {
    deliveryRadio.checked = true;
  } else {
    pickupRadio.checked = true;
  }
}