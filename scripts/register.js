"use strict";

// ---------------------first initialize ----------------------
const firstnameEl = document.getElementById("input-firstname");
const lastnameEl = document.getElementById("input-lastname");
const usernameEl = document.getElementById("input-username");
const passwordEl = document.getElementById("input-password");
const cfmPasswordEl = document.getElementById("input-password-confirm");
const registerBtnEl = document.getElementById("btn-submit");

// +++ class for user handling

class User {
  constructor(firstname, lastname, username, password) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.username = username;
    this.password = password;
  }
  // set firstname(_firstname) {
  //   this._firstname = _firstname;
  // }
  // get firstname() {
  //   return this._firstname;
  // }
  // set lastname(_lastname) {
  //   this._lastname = _lastname;
  // }
  // get lastname() {
  //   return this._lastname;
  // }
  // set username(_username) {
  //   this._username = _username;
  // }
  // get username() {
  //   return this._username;
  // }
  // set password(_password) {
  //   this._password = _password;
  // }
  // get password() {
  //   return this._password;
  // }
}
// function to convert class to object in order to save in local storage
function parseUser(userData) {
  const user = new User(
    userData.firstname,
    userData.lastname,
    userData.username,
    userData.password
  );

  return user;
}
// +++ Array for list of user inputs
const KEY = "user-array";
const userArr = JSON.parse(getFromStorage(KEY, "[]"));

let validate = true;

// +++ Handling register button

registerBtnEl.addEventListener("click", () => {
  // data of user defined in object type
  const data = {
    firstname: firstnameEl.value,
    lastname: lastnameEl.value,
    username: usernameEl.value,
    password: passwordEl.value,
    cfmPassword: cfmPasswordEl.value,
  };
  const checkMissing =
    Boolean(data.firstname) &&
    Boolean(data.lastname) &&
    Boolean(data.username) &&
    Boolean(data.password) &&
    Boolean(data.cfmPassword);
  // +++ Check if missing any fields
  if (checkMissing == false) {
    alert("Please enter full information!");
    validate = false;
    return;
  }
  // +++ Check whether username is the same as the previous registered username or not
  userArr.forEach((user) => {
    if (user.username === data.username) {
      alert("username already used, use another!");
      validate = false;
      return;
    }
  });
  // +++ Check whether confirm password is the same as password or not
  if (data.cfmPassword !== data.password) {
    alert("Typing wrong confirm password, please type again!");
    validate = false;
    return;
  }
  // +++ Check whether password has more than 8 characters or not
  if (data.password.length < 8) {
    alert("Password cannot have less than 8 characters, please type again!");
    validate = false;
    return;
  }
  if (validate === true) {
    userArr.push(parseUser(data));
    // convert userArr from array of class to array of objects
    // objectArr = [];
    // userArr.forEach((user) => {
    //   objectArr.push(parseUser(user));
    // });
    saveToStorage(KEY, JSON.stringify(userArr));
    window.location.href = "../index.html";
  }
});
