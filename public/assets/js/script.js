const todoInput = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");
const taskCountEl = document.getElementById("task-count");
const clearCompletedBtn = document.getElementById("clear-completed");

let editingId = null;
let currentFilter = "all";

// 1. INITIALIZE APP
document.addEventListener("DOMContentLoaded", () => {
  const tasks = getTasksFromStorage();
  renderTasks(tasks);

  // Initial Entrance Animation
  gsap.from(".todo-container", {
    duration: 0.8,
    y: 40,
    opacity: 0,
    ease: "power3.out",
  });

  // Setup Theme Switcher State
  const themeToggle = document.getElementById("dark-mode-toggle");
  if (document.documentElement.getAttribute("data-theme") === "dark") {
    themeToggle.checked = true;
  }
});

// 2. STORAGE UTILITIES
function getTasksFromStorage() {
  const savedTasks = localStorage.getItem("tasks");
  return savedTasks ? JSON.parse(savedTasks) : [];
}

function saveTasksToStorage(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// 3. TASK LOGIC (ADD, DELETE, TOGGLE)
const addTask = () => {
  const text = todoInput.value.trim();
  if (!text) {
    gsap.to(".input-section", { x: 10, duration: 0.1, repeat: 3, yoyo: true });
    return;
  }

  const tasks = getTasksFromStorage();
  const newTask = { id: Date.now(), text, complete: false };
  tasks.push(newTask);
  saveTasksToStorage(tasks);

  todoInput.value = "";
  renderTasks(tasks);

  // Animate new item
  const lastItem = todoList.lastElementChild;
  if (lastItem) {
    gsap.from(lastItem, {
      duration: 0.5,
      x: -30,
      opacity: 0,
      ease: "back.out(1.7)",
    });
  }
};

function animateRemove(id) {
  const el = document.querySelector(`li[data-id="${id}"]`);
  gsap.to(el, {
    opacity: 0,
    x: 50,
    duration: 0.3,
    onComplete: () => {
      let tasks = getTasksFromStorage();
      tasks = tasks.filter((t) => t.id !== id);
      saveTasksToStorage(tasks);
      renderTasks(tasks);
    },
  });
}

function toggleTaskStatus(id) {
  let tasks = getTasksFromStorage();
  tasks = tasks.map((t) => (t.id === id ? { ...t, complete: !t.complete } : t));
  saveTasksToStorage(tasks);
  renderTasks(tasks);
}

// 4. EDIT LOGIC & KEYBOARD SHORTCUTS
function setEdit(id) {
  editingId = id;
  renderTasks(getTasksFromStorage());
}

function saveEdit(id) {
  const inputEl = document.getElementById(`input-${id}`);
  const newText = inputEl.value.trim();
  if (!newText) return animateRemove(id);

  let tasks = getTasksFromStorage();
  tasks = tasks.map((t) => (t.id === id ? { ...t, text: newText } : t));
  saveTasksToStorage(tasks);
  editingId = null;
  renderTasks(tasks);
}

// 5. RENDER LOGIC
function renderTasks(tasks) {
  todoList.innerHTML = "";

  const filtered = tasks.filter((t) => {
    if (currentFilter === "active") return !t.complete;
    if (currentFilter === "complete") return t.complete;
    return true;
  });

  const activeCount = tasks.filter((t) => !t.complete).length;
  taskCountEl.innerText = `${activeCount} item${
    activeCount !== 1 ? "s" : ""
  } left`;

  if (filtered.length === 0) {
    todoList.innerHTML = `<li style="color: gray; justify-content: center;">No ${currentFilter} tasks.</li>`;
    return;
  }

  filtered.forEach((task) => {
    const li = document.createElement("li");
    li.setAttribute("data-id", task.id);

    if (editingId === task.id) {
      li.innerHTML = `
        <input type="text" class="edit-input" value="${task.text}" id="input-${task.id}">
        <button class="edit-btn" onclick="saveEdit(${task.id})">Save</button>
        <button class="delete-btn" onclick="editingId = null; renderTasks(getTasksFromStorage());">✕</button>
      `;

      setTimeout(() => {
        const input = document.getElementById(`input-${task.id}`);
        input.focus();

        input.onkeydown = (e) => {
          if (e.key === "Enter") saveEdit(task.id);
          if (e.key === "Escape") {
            editingId = null;
            renderTasks(getTasksFromStorage());
          }
        };
      }, 10);
    } else {
      li.innerHTML = `
        <input type="checkbox" ${
          task.complete ? "checked" : ""
        } onclick="toggleTaskStatus(${task.id})">
        <span class="todo-text" style="${
          task.complete ? "text-decoration: line-through; opacity: .6;" : ""
        }">
          ${task.text}
        </span>
        <button class="edit-btn" onclick="setEdit(${task.id})">Edit</button>
        <button class="delete-btn" onclick="animateRemove(${
          task.id
        })">Delete</button>
      `;
    }

    todoList.appendChild(li);
  });
}

// 6. FILTER BUTTONS
document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".filter-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTasks(getTasksFromStorage());
  });
});

// 7. CLEAR COMPLETED
clearCompletedBtn.addEventListener("click", () => {
  let tasks = getTasksFromStorage();
  tasks = tasks.filter((t) => !t.complete);
  saveTasksToStorage(tasks);
  renderTasks(tasks);
});

// 8. DARK MODE TOGGLE
document
  .getElementById("dark-mode-toggle")
  .addEventListener("change", function () {
    const theme = this.checked ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  });

// 9. KEYBOARD ENTER TO ADD TASK
todoInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

// 10. Add button event
addBtn.addEventListener("click", addTask);