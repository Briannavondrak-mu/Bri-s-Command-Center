// ====== To-Do List ======
const todoListEl = document.getElementById('todoList');
let tasks = [];

// Add a task
function addTask(taskText) {
  if (!taskText) return;
  const task = { text: taskText, done: false };
  tasks.push(task);
  renderTasks();
}

// Remove a task
function removeTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

// Toggle done
function toggleDone(index) {
  tasks[index].done = !tasks[index].done;
  renderTasks();
}

// Render tasks
function renderTasks() {
  todoListEl.innerHTML = '';
  tasks.forEach((task, i) => {
    const taskEl = document.createElement('div');
    taskEl.classList.add('todo-item');
    taskEl.innerHTML = `
      <span style="text-decoration:${task.done ? 'line-through' : 'none'}">${task.text}</span>
      <button onclick="toggleDone(${i})">✔️</button>
      <button onclick="removeTask(${i})">🗑️</button>
    `;
    todoListEl.appendChild(taskEl);
  });
}

// Example tasks
addTask('Call Sam for payments');
addTask('Make payment to Bluedart');
addTask('Office grocery shopping');


// ====== Chatbot Toggle ======
const chatBtn = document.getElementById('chatBtn');
const chatPopup = document.getElementById('chatPopup');
const chatBody = document.getElementById('chatBody');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');

chatBtn.addEventListener('click', () => {
  chatPopup.style.display = chatPopup.style.display === 'flex' ? 'none' : 'flex';
});

// Simple chatbot response
chatSend.addEventListener('click', () => {
  const msg = chatInput.value.trim();
  if (!msg) return;
  const userMsg = document.createElement('div');
  userMsg.textContent = 'You: ' + msg;
  userMsg.style.color = '#fff';
  chatBody.appendChild(userMsg);

  // Example AI response (can be expanded)
  const botMsg = document.createElement('div');
  botMsg.textContent = 'Helper: Try adding this task to your list!';
  botMsg.style.color = '#ff2f92';
  chatBody.appendChild(botMsg);

  chatInput.value = '';
  chatBody.scrollTop = chatBody.scrollHeight;
});
