"use strict";
// --------------------------first initialize -----------------------
const aTagEl = document.querySelectorAll("#login-modal a");
const loginModalPEl = document.querySelector("#login-modal p");
const loginModalBtnEl = document.querySelector("#login-modal .row");
const logoutBtnEl = document.querySelector("#btn-logout");
const homeNavEl = document.querySelector("#sidebar span");
// get data before register
const prevCurrentUserArr = JSON.parse(getFromStorage("user-array", "[]"));
let clickLogin = false;
let clickRegister = false;
// ------------------------- handle click link ------------------------------

function renderLogOut(userArr, user) {
  let data;
  // if Login button is clicked
  if (clickLogin === true) {
    data = userArr.filter(
      (eachUser) =>
        eachUser.username === user.username &&
        eachUser.password === user.password
    );
    loginModalPEl.textContent = `Welcome ${data[0].firstname}`;
  }
  // if Register button is clicked
  if (clickRegister === true) {
    data = userArr.pop();
    loginModalPEl.textContent = `Welcome ${data.firstname}`;
  }
  loginModalBtnEl.classList.add("hidden");
}
aTagEl.forEach((btn) => {
  btn.addEventListener("click", () => {
    const homepageLoginClicked = {
      clicked: "true",
    };
    // if Login button is clicked
    if (btn.textContent === "Login") {
      clickLogin = true;
      // just to know if button has been clicked when move from homepage(click login or register) -> login -> homepage
      saveToStorage(
        "homepage-login-clicked",
        JSON.stringify(homepageLoginClicked)
      );
      // if Register button is clicked
    } else {
      clickRegister = true;
      saveToStorage(
        "homepage-register-clicked",
        JSON.stringify(homepageLoginClicked)
      );
    }
  });
});

// --------------------------------- Change hompage when from login/register page to homepage

function changeHomepage() {
  // get data after login (from login page -> homepage must click homepage icon in sidebar)
  const currentUser = JSON.parse(getFromStorage("currentUser", "[]"));
  // get data after register
  const currentUserArr = JSON.parse(getFromStorage("user-array", "[]"));
  if (currentUser !== []) {
    const existUser = currentUserArr.filter(
      (user) =>
        user.username === currentUser.username &&
        user.password === currentUser.password
    );
    // type valid user in database
    if (existUser !== []) {
      renderLogOut(currentUserArr, currentUser);
    }
  }
}

// When first enter the website with saved account
changeHomepage();
// Or when click icon home in navbar
homeNavEl.addEventListener("click", function () {
  changeHomepage();
});
// +++ Main part

let homepageLoginClicked = JSON.parse(
  getFromStorage("homepage-login-clicked", "[]")
);
let homepageRegisterClicked = JSON.parse(
  getFromStorage("homepage-register-clicked", "[]")
);
// if login has been clicked
if (JSON.stringify(homepageLoginClicked) !== "[]") {
  clickLogin = true;
  changeHomepage();
  saveToStorage("homepage-login-clicked", JSON.stringify([]));
  homepageLoginClicked = [];
} // if register has been clicked
else if (JSON.stringify(homepageRegisterClicked) !== "[]") {
  // get data after login (from login page -> homepage must click homepage icon in sidebar)
  const currentUser = JSON.parse(getFromStorage("currentUser", "[]"));
  // get data after register
  const currentUserArr = JSON.parse(getFromStorage("user-array", "[]"));
  clickRegister = true;
  if (currentUserArr !== prevCurrentUserArr) {
    renderLogOut(currentUserArr, currentUser);
  }
  saveToStorage("homepage-register-clicked", JSON.stringify([]));
  homepageRegisterClicked = [];
} else {
  loginModalPEl.textContent = `Please Login or Register`;
  loginModalBtnEl.classList.remove("hidden");
}

// -------------------------Log out------------------------
logoutBtnEl.addEventListener("click", function () {
  if (clickLogin === true) {
    localStorage.removeItem("currentUser");
    window.location.href = "./pages/login.html";
  } else {
    alert("Not login yet, please login or register first");
  }
});
