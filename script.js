const todoInput = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");

// Add task
addBtn.addEventListener("click", () => {
  const task = todoInput.value.trim();
  if(task === "") return;

  const li = document.createElement("li");
  li.textContent = task;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", () => {
    li.remove();
  });

  li.appendChild(deleteBtn);
  todoList.appendChild(li);
  todoInput.value = "";
});

// Add task on Enter key
todoInput.addEventListener("keypress", (e) => {
  if(e.key === "Enter") {
    addBtn.click();
  }
});
