"use strict";
// ------------------------ first initialize --------------------------
const usernameEl = document.getElementById("input-username");
const passwordEl = document.getElementById("input-password");
const sbmBtnEl = document.getElementById("btn-submit");
// +++ Get data from local storage
const userArr = JSON.parse(getFromStorage("user-array", "[]"));
// ------------------------ handling submit button ------------------------
let validate = true;
sbmBtnEl.addEventListener("click", function () {
  validate = true;
  const data = {
    username: usernameEl.value,
    password: passwordEl.value,
  };
  // +++ check if missing
  const checkMissing = Boolean(data.username) && Boolean(data.password);
  if (checkMissing === false) {
    alert("Please type in full information");
    validate = false;
    return;
  }
  // +++ check if user typed account that existed in database
  if (
    userArr.filter(
      (user) =>
        user.username === data.username && user.password === data.password
    ).length === 0
  ) {
    alert("Wrong account or password, please type again!");
    validate = false;
    return;
  }
  // +++Input is valid
  if (validate === true) {
    // save username and password into localStorage, for another to use
    saveToStorage("currentUser", JSON.stringify(data));
    saveToStorage("homepage-login-clicked", JSON.stringify({ clicked: true }));
    alert("Login succesfully!");
    // const loginValidClicked = {
    //   clicked: "true",
    // };
    // saveToStorage("login-valid-clicked", JSON.stringify(loginValidClicked));
    window.location.href = "../index.html";
  }
});
