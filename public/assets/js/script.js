const todoInput = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");

document.addEventListener("DOMContentLoaded", () => {
  const tasks = getTasksFromStorage();
  if (tasks.length > 0) renderTasks(tasks);
  else todoList.innerHTML = "<li>No Task found Storage.</li>";
});

function getTasksFromStorage() {
  const savedTasks = localStorage.getItem("tasks");
  return savedTasks ? JSON.parse(savedTasks) : [];
}

function renderTasks(tasks) {
  todoList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.textContent = task.text;

    const btndelete = document.createElement("button");
    btndelete.textContent = "Delete";
    btndelete.addEventListener("click", () => {
      removeTask(index);
    });
    li.appendChild(btndelete);
    todoList.appendChild(li);
  });
}

function removeTask(index) {
  const tasks = getTasksFromStorage();
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks(tasks);
}

addBtn.addEventListener("click", () => {
  const textTask = todoInput.value.trim();
  if (textTask === "") return;
  const Tasks = getTasksFromStorage();
  Tasks.push({ text: textTask });
  localStorage.setItem("tasks", JSON.stringify(Tasks));
  renderTasks(Tasks);
  todoInput.value="";
});

todoInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addBtn.click();
});
