"use strict";
// -------------------------- first initialize ----------------------------
const btnAddEl = document.querySelector("#btn-add");
const taskInputEl = document.querySelector("#input-task");
let taskListEl = document.querySelector("#todo-list");
let eachTaskEl = taskListEl.querySelectorAll("li");
// let deleteBtnEl = taskListEl.querySelectorAll(".close");
// console.log(eachTaskEl);
// +++ class for task management
class Task {
  constructor(task, owner, isDone) {
    this.task = task;
    this.owner = owner;
    this.isDone = isDone;
  }
}
// +++ Array for currentUser
const currentUser = JSON.parse(getFromStorage("currentUser", "[]"));
// +++ Array for Task instances
let todoArr = JSON.parse(getFromStorage("to-do-list", "[]"));
// +++ check if task has been typed or not!
let validate = true;

// -------------------------- showing current to-do list of current user --------------------
// +++ add new task (add new node inside html)
function addTask(taskName, taskDone) {
  const taskEl = document.createElement("li");
  taskEl.innerHTML = `${taskName}<span class="close">×</span>`;
  // whether task is done or undone, add appropriate element
  if (taskDone === false) {
    console.log("gone into!");
    taskEl.classList.add("checked");
  }
  taskEl.onclick = function () {
    renderMarkStatus(taskEl);
  };
  // delete button handling
  const span = taskEl.querySelector("span");
  span.onclick = function () {
    deleteTask(taskEl);
  };
  taskListEl.appendChild(taskEl);
}
function showToDoList(arr) {
  const thisUserTask = arr.filter(
    (task) => task.owner === currentUser.username
  );
  console.log("function showToDoList(): ", thisUserTask);
  thisUserTask.forEach((userTask, i) => {
    addTask(userTask.task, userTask.isDone, i);
  });
}
// +++ show first page
if (JSON.stringify(currentUser) !== "[]") {
  showToDoList(todoArr);
} else {
  alert("Please sign in your account to continue");
  window.location.href = "../index.html";
}
// -------------------------- handling add new task ------------------------
// +++ clear input field

btnAddEl.addEventListener("click", function () {
  if (taskInputEl.value === "") {
    alert("Please type the task");
    validate = false;
    return;
  }
  if (validate) {
    console.log("Have clicked!");
    const task = new Task(taskInputEl.value, currentUser.username, false);
    todoArr.push(task);
    console.log(typeof task);
    console.log("todoArr: ", todoArr);
    saveToStorage("to-do-list", JSON.stringify(todoArr));
    // let i = todoArr.length - 1;
    addTask(taskInputEl.value, false);
  }
});

// ------------------------------ handling let user mark task to be done or undone --------------
function renderMarkStatus(taskEl) {
  console.log("taskEl: ", taskEl);
  // todoArr = JSON.parse(getFromStorage("to-do-list", "[]"));
  // HTML handling
  taskEl.classList.toggle("checked");
  // save new list to storage
  const taskName = taskEl.textContent
    .replace(/\s+/g, " ")
    .trim()
    .replace("×", "");
  const index = todoArr.findIndex(
    (userTask) =>
      userTask.owner === currentUser.username && userTask.task === taskName
  );
  todoArr[index].isDone = todoArr[index].isDone === true ? false : true;
  saveToStorage("to-do-list", JSON.stringify(todoArr));
  console.log("Have clicked!");
}
// ------------------------------ handling when user click delete -----------------------

function deleteTaskHTML(taskEl) {
  taskListEl = document.querySelector("#todo-list");
  taskListEl.removeChild(taskEl);
}
function deleteTask(taskEl) {
  // todoArr = JSON.parse(getFromStorage("to-do-list", "[]"));
  taskListEl = document.querySelector("#todo-list");
  eachTaskEl = taskListEl.querySelectorAll("li");
  deleteTaskHTML(taskEl);
  const taskName = taskEl.textContent
    .replace(/\s+/g, " ")
    .trim()
    .replace("×", "");
  console.log(taskName);
  const index = todoArr.findIndex(
    (userTask) =>
      userTask.owner === currentUser.username && userTask.task === taskName
  );
  console.log(index);
  todoArr.splice(index, 1);
  saveToStorage("to-do-list", JSON.stringify(todoArr));
  console.log("clicked!");
  // Ensure that when click child node of "li" (this deleteBtnEl), the event of "li" will not be triggered
  event.stopPropagation();
}
