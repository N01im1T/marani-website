import "../src/assets/styles/main.css";

import header from "./components/header.js";
import inputs from "./components/inputs.js";
import forms from "./components/forms.js";
import modals from "./components/modals.js";
import buttons from "./components/buttons.js";

document.addEventListener("DOMContentLoaded", function () {
  "use strict";
  header();
  inputs();
  forms();
  modals();
  buttons();
});
