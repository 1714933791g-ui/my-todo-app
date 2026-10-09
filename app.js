const STORAGE_KEY = "my-todo-app.tasks.v1";

const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const list = document.querySelector("#task-list");
const emptyState = document.querySelector("#empty-state");
const emptyTitle = document.querySelector("#empty-title");
const emptyCopy = document.querySelector("#empty-copy");
const filterButtons = [...document.querySelectorAll(".filter-button")];
const clearCompletedButton = document.querySelector("#clear-completed");
const toast = document.querySelector("#toast");

let tasks = loadTasks();
let currentFilter = "all";
let toastTimer;

function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(saved)) return [];
    return saved.filter((task) => task && typeof task.id === "string" && typeof task.text === "string")
      .map((task) => ({ id: task.id, text: task.text, completed: Boolean(task.completed), createdAt: Number(task.createdAt) || Date.now() }));
  } catch {
    return [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    showToast("浏览器暂时无法保存，请检查存储空间");
  }
}

function formatTime(timestamp) {
  return new Intl.DateTimeFormat("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false }).format(timestamp);
}

function visibleTasks() {
  if (currentFilter === "active") return tasks.filter((task) => !task.completed);
  if (currentFilter === "completed") return tasks.filter((task) => task.completed);
  return tasks;
}

function createTaskElement(task) {
  const item = document.createElement("li");
  item.className = `task-item${task.completed ? " is-completed" : ""}`;
  item.dataset.id = task.id;

  const checkbox = document.createElement("button");
  checkbox.className = "task-check";
  checkbox.type = "button";
  checkbox.dataset.action = "toggle";
  checkbox.setAttribute("aria-label", task.completed ? `标记“${task.text}”为未完成` : `标记“${task.text}”为已完成`);
  checkbox.setAttribute("aria-pressed", String(task.completed));
  checkbox.textContent = "✓";

  const text = document.createElement("span");
  text.className = "task-text";
  text.textContent = task.text;

  const time = document.createElement("time");
  time.className = "task-time";
  time.dateTime = new Date(task.createdAt).toISOString();
  time.textContent = formatTime(task.createdAt);

  const remove = document.createElement("button");
  remove.className = "delete-button";
  remove.type = "button";
  remove.dataset.action = "delete";
  remove.setAttribute("aria-label", `删除“${task.text}”`);
  remove.title = "删除待办";
  remove.textContent = "×";

  item.append(checkbox, text, time, remove);
  return item;
}

function render() {
  const shownTasks = visibleTasks();
  list.replaceChildren(...shownTasks.map(createTaskElement));

  const completed = tasks.filter((task) => task.completed).length;
  const remaining = tasks.length - completed;
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  document.querySelector("#completed-count").textContent = completed;
  document.querySelector("#total-count").textContent = tasks.length;
  document.querySelector("#remaining-count").textContent = remaining;
  document.querySelector("#all-filter-count").textContent = tasks.length;
  document.querySelector(".progress-track").setAttribute("aria-valuenow", String(progress));
  document.querySelector("#progress-fill").style.width = `${progress}%`;
  document.querySelector("#progress-caption").textContent = tasks.length
    ? (remaining ? `再完成 ${remaining} 件，今天就更完整了` : "全部完成，今天做得很棒")
    : "写下第一件想完成的事吧";
  clearCompletedButton.hidden = completed === 0;
  list.hidden = shownTasks.length === 0;
  emptyState.hidden = shownTasks.length > 0;

  if (!tasks.length) {
    emptyTitle.textContent = "清单还空着";
    emptyCopy.textContent = "先添加一件小事，给今天一个开始。";
  } else if (!shownTasks.length && currentFilter === "active") {
    emptyTitle.textContent = "没有未完成的事项";
    emptyCopy.textContent = "今天的清单已经全部完成。";
  } else if (!shownTasks.length && currentFilter === "completed") {
    emptyTitle.textContent = "还没有完成的事项";
    emptyCopy.textContent = "完成一件任务后，它会出现在这里。";
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2400);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) {
    input.focus();
    return;
  }
  tasks.unshift({ id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`, text, completed: false, createdAt: Date.now() });
  currentFilter = "all";
  filterButtons.forEach((button) => {
    const active = button.dataset.filter === currentFilter;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });
  saveTasks();
  render();
  input.value = "";
  input.focus();
  showToast("已添加到清单");
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach((candidate) => {
      const active = candidate === button;
      candidate.classList.toggle("is-active", active);
      candidate.setAttribute("aria-selected", String(active));
    });
    render();
  });
});

list.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const item = button.closest(".task-item");
  const task = tasks.find((entry) => entry.id === item.dataset.id);
  if (!task) return;

  if (button.dataset.action === "toggle") {
    task.completed = !task.completed;
    saveTasks();
    render();
  } else if (button.dataset.action === "delete") {
    tasks = tasks.filter((entry) => entry.id !== task.id);
    saveTasks();
    render();
    showToast("已从清单中删除");
  }
});

clearCompletedButton.addEventListener("click", () => {
  const removed = tasks.filter((task) => task.completed).length;
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  render();
  showToast(`已清除 ${removed} 件已完成事项`);
});

document.querySelector("#today-label").textContent = new Intl.DateTimeFormat("zh-CN", {
  month: "long", day: "numeric", weekday: "long",
}).format(new Date());

render();

