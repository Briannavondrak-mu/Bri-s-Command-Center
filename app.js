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

// Weather code mapping
function getWeatherDescription(code) {
    const weatherCodes = {
        0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
        45: "Fog", 48: "Depositing rime fog", 51: "Light drizzle", 53: "Moderate drizzle",
        55: "Dense drizzle", 56: "Light freezing drizzle", 57: "Dense freezing drizzle",
        61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain", 66: "Light freezing rain",
        67: "Heavy freezing rain", 71: "Slight snow fall", 73: "Moderate snow fall",
        75: "Heavy snow fall", 77: "Snow grains", 80: "Slight rain showers",
        81: "Moderate rain showers", 82: "Violent rain showers", 85: "Slight snow showers",
        86: "Heavy snow showers", 95: "Thunderstorm", 96: "Thunderstorm w/ slight hail",
        99: "Thunderstorm w/ heavy hail"
    };
    return weatherCodes[code] || "Unknown";
}

// Simple Open-Meteo Icon mapping
function getWeatherIcon(code, isDay = true) {
    if (code === 0) return isDay ? "☀️" : "🌙";
    if (code <= 3) return "☁️";
    if (code <= 48) return "🌫️";
    if (code <= 67) return "🌧️";
    if (code <= 77) return "❄️";
    if (code <= 82) return "🌧️";
    if (code <= 86) return "❄️";
    if (code <= 99) return "⚡";
    return "❓";
}

// Main function to get location and weather
function loadWeather() {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        // Fetch weather from Open-Meteo
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`);
        const data = await response.json();
        const current = data.current_weather;
        const daily = data.daily;

        // Update dashboard
        document.getElementById("location-name").textContent = `Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}`;
        document.querySelector(".current-temp").textContent = `${Math.round(current.temperature)}°C`;
        document.querySelector(".weather-icon").textContent = getWeatherIcon(current.weathercode, current.is_day);
        document.querySelector(".weather-desc").textContent = getWeatherDescription(current.weathercode);
        document.getElementById("temp-range").textContent = `${Math.round(daily.temperature_2m_max[0])}° / ${Math.round(daily.temperature_2m_min[0])}°`;
        document.getElementById("wind-speed").textContent = `${current.windspeed} km/h`;

    }, (error) => {
        console.error(error);
        alert("Unable to get your location.");
    });
}

document.addEventListener("DOMContentLoaded", loadWeather);

