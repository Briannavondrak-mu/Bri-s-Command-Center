document.addEventListener("DOMContentLoaded", () => {
    const todoInput = document.getElementById("todoInput");
    const addTodoBtn = document.getElementById("addTodoBtn");
    const todoList = document.getElementById("todoList");

    function addTask() {
        const taskText = todoInput.value.trim();
        if (taskText === "") return;

        const li = document.createElement("li");
        li.className = "list-group-item todo-item";

        li.innerHTML = `
            <span class="task-text">${taskText}</span>
            <button class="btn btn-xs btn-danger pull-right delete-btn">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;

        // Toggle completed
        li.querySelector(".task-text").addEventListener("click", () => {
            li.classList.toggle("completed");
        });

        // Delete task
        li.querySelector(".delete-btn").addEventListener("click", () => {
            li.remove();
        });

        todoList.appendChild(li);
        todoInput.value = "";
    }

    addTodoBtn.addEventListener("click", addTask);

    todoInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            addTask();
        }
    });
});

// =====================
// GLOBAL STATE
// =====================
let globalOpenMeteo = null;

// =====================
// WEATHER HELPERS
// =====================
function getWeatherDescription(code) {
    const weatherCodes = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Rime fog",
        51: "Light drizzle",
        53: "Moderate drizzle",
        55: "Dense drizzle",
        61: "Slight rain",
        63: "Moderate rain",
        65: "Heavy rain",
        71: "Light snow",
        73: "Moderate snow",
        75: "Heavy snow",
        80: "Rain showers",
        95: "Thunderstorm"
    };
    return weatherCodes[code] || "Unknown";
}

function getWeatherIcon(code, isDay = true) {
    if (code === 0) return isDay ? "fas fa-sun" : "fas fa-moon";
    if (code <= 3) return "fas fa-cloud";
    if (code <= 48) return "fas fa-smog";
    if (code <= 67) return "fas fa-cloud-rain";
    if (code <= 77) return "fas fa-snowflake";
    if (code <= 82) return "fas fa-cloud-showers-heavy";
    if (code <= 99) return "fas fa-bolt";
    return "fas fa-question";
}

// =====================
// GEOCODING (ZIP → LAT/LON)
// =====================
function getCoordinates(input) {
    return $.ajax({
        url: `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(input.trim())}&count=1`,
        method: "GET"
    });
}

// =====================
// OPEN-METEO LOAD
// =====================
function loadOpenMeteo(input) {
    getCoordinates(input)
        .done(function (geo) {
            if (!geo.results || geo.results.length === 0) {
                $('#openmeteo-current').html("Location not found");
                return;
            }

            const loc = geo.results[0];
            $('#openmeteo-location').text(
                `${loc.name}${loc.admin1 ? ", " + loc.admin1 : ""}`
            );

            $.ajax({
                url: `https://api.open-meteo.com/v1/forecast
                    ?latitude=${loc.latitude}
                    &longitude=${loc.longitude}
                    &current_weather=true
                    &daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset
                    &timezone=auto`.replace(/\s+/g, ""),
                method: "GET"
            })
                .done(function (data) {
                    const current = data.current_weather;
                    const isDay = current.is_day === 1;
                    const desc = getWeatherDescription(current.weathercode);
                    const icon = getWeatherIcon(current.weathercode, isDay);

                    // CURRENT WEATHER
                    $('#openmeteo-current').html(`
                        <div class="text-center">
                            <div class="current-temp">${Math.round(current.temperature)}°C</div>
                            <div class="weather-icon" style="font-size:5rem">
                                <i class="${icon}"></i>
                            </div>
                            <h3>${desc}</h3>
                        </div>

                        <div class="weather-details">
                            <div class="detail-item">
                                <i class="fas fa-wind"></i>
                                <div>${current.windspeed} km/h</div>
                            </div>
                            <div class="detail-item">
                                <i class="fas fa-temperature-high"></i>
                                <div>
                                    ${Math.round(data.daily.temperature_2m_max[0])}°
                                    /
                                    ${Math.round(data.daily.temperature_2m_min[0])}°
                                </div>
                            </div>
                        </div>
                    `);

                    $('#openmeteo-updated').text(
                        `Updated: ${new Date().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                        })}`
                    );

                    // FORECAST
                    const forecastRow = $('#openmeteo-forecast-row');
                    forecastRow.empty();

                    for (let i = 1; i <= 6; i++) {
                        const day = new Date(data.daily.time[i]);
                        forecastRow.append(`
                            <div class="col-xs-6 col-sm-4 col-md-3 col-lg-2">
                                <div class="forecast-day">
                                    <h5>${day.toLocaleDateString("en-US", { weekday: "short" })}</h5>
                                    <i class="${getWeatherIcon(data.daily.weathercode[i])}"></i>
                                    <div>
                                        ${Math.round(data.daily.temperature_2m_max[i])}°
                                        /
                                        ${Math.round(data.daily.temperature_2m_min[i])}°
                                    </div>
                                </div>
                            </div>
                        `);
                    }

                    $('.weather-card').show();
                })
                .fail(() => {
                    $('#openmeteo-current').html("Failed to load weather");
                });
        })
        .fail(() => {
            $('#openmeteo-current').html("Geocoding failed");
        });
}

// =====================
// SEARCH HANDLER
// =====================
function searchWeather() {
    const input = $('#search-input').val().trim();
    if (!input) return alert("Enter a ZIP code");

    $('.weather-card').hide();
    loadOpenMeteo(input);
}

// =====================
// EVENTS
// =====================
$(document).ready(function () {
    $('.weather-card').hide();

    $('#search-btn').on('click', searchWeather);
    $('#search-input').on('keyup', e => {
        if (e.key === "Enter") searchWeather();
    });
});
