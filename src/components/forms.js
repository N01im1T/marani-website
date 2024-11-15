// import { createAndShowModal, closeModal } from "./modals";
let isStaticHanled = false;

const forms = (container = document) => {
  const forms = container.querySelectorAll("form"),
    inputs = container.querySelectorAll("input");

  const messages = {
    ru: {
      fillField: "Заполните поле",
      invalidFormat: "Введите данные в указанном формате",
    },
    en: {
      fillField: "Please fill in this field",
      invalidFormat: "Please enter the data in the specified format",
    },
  };

  const rawLang = document.documentElement.lang;
  const lang = rawLang ? rawLang.toLowerCase().split("-")[0] : "";

  const selectedLang = messages[lang] ? lang : "en";
  const message = messages[selectedLang];

  const postData = async (url, data) => {
    let res = await fetch(url, {
      method: "POST",
      body: data,
    });

    return await res;
  };

  const clearInputs = () => {
    inputs.forEach((item) => {
      item.value = "";
    });
  };

  forms.forEach((form) => {
    if(form.classList.contains('class-static') && isStaticHanled) return;
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(form);

      formData.append("action", "submit_form");

      postData(backend["ajax_url"], formData)
        .then(() => {
          closeModal(5000);
          createAndShowModal("btn-success-reply");
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          clearInputs();
        });
    });
  });

  isStaticHanled = true;

  // Prevent default invalid messages
  inputs.forEach((input) => {
    input.addEventListener("invalid", () => {
      if (input.validity.valueMissing) {
        input.setCustomValidity(message.fillField);
      } else {
        input.setCustomValidity(message.invalidFormat);
      }
    });

    input.addEventListener("input", () => {
      input.setCustomValidity("");
    });
  });
};

export default forms;
