"use strict";
// -------------------------------- first initialize -------------------------------
const pageSizeInput = document.querySelector("#input-page-size");
const categoryInput = document.querySelector("#input-category");
const sbmBtnEl = document.querySelector("#btn-submit");

let validate = true;

sbmBtnEl.addEventListener("click", function () {
  const data = {
    newsPerPage: pageSizeInput.value,
    category: categoryInput.value,
  };
  const checkMissing = Boolean(data.newsPerPage) && Boolean(data.category);
  if (checkMissing === false) {
    alert("Please fill in full information!");
    validate = false;
    return;
  }
  if (typeof Number(data.newsPerPage) !== "number") {
    alert("News per page must be a number, please type again");
    validate = false;
    return;
  }
  // save to local storage:
  saveToStorage("settings", JSON.stringify(data));
  alert("Save successfully!");
});

// show the same settings if user has set up before

const settings = JSON.parse(getFromStorage("settings", "[]"));
if (settings !== []) {
  pageSizeInput.value = Number(settings.newsPerPage);
  categoryInput.value = settings.category;
}
