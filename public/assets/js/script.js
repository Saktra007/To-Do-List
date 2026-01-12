const todoInput = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");
let editingld = null;
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
  tasks.forEach((task) => {
    const li = document.createElement("li");
    if (editingld === task.id) {
      const editInput = document.createElement("input");
      editInput.type = "text";
      editInput.value = task.text;
      editInput.className = "edit-input";

      const saveBtn = document.createElement("button");
      saveBtn.textContent = "Save";

      const handleSave = () => {
        saveEdit(task.id, editInput.value);
      };
      saveBtn.addEventListener("click", handleSave);
      editInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") handleSave();
      });
      li.appendChild(editInput);
      li.appendChild(saveBtn);
    } else {
      const span = document.createElement("span");
      span.textContent = task.text;

      const editbtn = document.createElement("button");
      editbtn.textContent = "Edit";
      editbtn.addEventListener("click", () => {
        editingld = task.id;
        renderTasks(tasks);
      });

      const btndelete = document.createElement("button");
      btndelete.textContent = "Delete";
      btndelete.addEventListener("click", () => {
        removeTask(task.id);
      });
      li.appendChild(span);
      li.appendChild(editbtn);
      li.appendChild(btndelete);
    }
    todoList.appendChild(li);
  });
}

function saveEdit(id, newText) {
  if (newText.trim() === "") return;

  let tasks = getTasksFromStorage();
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, text: newText.trim() } : task
  );
  localStorage.setItem("tasks", JSON.stringify(tasks));
  editingld = null;
  renderTasks(tasks);
}
function removeTask(id) {
  let tasks = getTasksFromStorage();
  tasks = tasks.filter((task) => task.id !== id);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks(tasks);
}

addBtn.addEventListener("click", () => {
  const textTask = todoInput.value.trim();
  if (textTask === "") return;
  const Tasks = getTasksFromStorage();
  Tasks.push({ id: Date.now(), text: textTask, status: "Active" });
  localStorage.setItem("tasks", JSON.stringify(Tasks));
  renderTasks(Tasks);
  todoInput.value = "";
});

todoInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addBtn.click();
});
