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
// WEATHER.GOV FUNCTIONS
// =====================
function getGovWeatherIcon(shortForecast, isDay = true) {
    const sf = shortForecast.toLowerCase();
    if (sf.includes("snow")) return "fas fa-snowflake";
    if (sf.includes("rain") || sf.includes("showers")) return "fas fa-cloud-showers-heavy";
    if (sf.includes("thunder")) return "fas fa-bolt";
    if (sf.includes("fog") || sf.includes("haze") || sf.includes("mist")) return "fas fa-smog";
    if (sf.includes("cloudy") || sf.includes("overcast")) return "fas fa-cloud";
    if (sf.includes("clear") || sf.includes("sunny")) return isDay ? "fas fa-sun" : "fas fa-moon";
    return "fas fa-question";
}

// Load Weather.gov
function loadWeatherGov(zip) {
    // 1️⃣ Geocode ZIP → lat/lon
    $.getJSON(`https://geocoding-api.open-meteo.com/v1/search?name=${zip}&count=1`)
        .done((geo) => {
            if (!geo.results || geo.results.length === 0) {
                $('#gov-current').html("Location not found");
                return;
            }

            const loc = geo.results[0];
            const lat = loc.latitude;
            const lon = loc.longitude;

            // 2️⃣ Get Weather.gov points
            $.getJSON(`https://api.weather.gov/points/${lat},${lon}`)
                .done((points) => {
                    const forecastUrl = points.properties.forecast;
                    const rel = points.properties.relativeLocation.properties;
                    $('#gov-location').text(`${rel.city}, ${rel.state}`);

                    // 3️⃣ Get forecast data
                    $.getJSON(forecastUrl)
                        .done((forecastData) => {
                            const periods = forecastData.properties.periods;
                            const today = periods[0];
                            const isDay = today.isDaytime;

                            // CURRENT WEATHER
                            const iconClass = getGovWeatherIcon(today.shortForecast, isDay);
                            $('#gov-current').html(`
                                <div class="text-center">
                                    <div class="current-temp">${today.temperature}°${today.temperatureUnit}</div>
                                    <div class="weather-icon" style="font-size:5rem">
                                        <i class="${iconClass}"></i>
                                    </div>
                                    <h3>${today.shortForecast}</h3>
                                </div>
                                <div class="weather-details">
                                    <div class="detail-item">
                                        <i class="fas fa-wind"></i>
                                        <div>${today.windSpeed} ${today.windDirection}</div>
                                    </div>
                                    <div class="detail-item">
                                        <i class="fas fa-tint"></i>
                                        <div>Precipitation: ${today.probabilityOfPrecipitation.value}%</div>
                                    </div>
                                </div>
                            `);

                            $('#gov-updated').text(`Updated: ${today.startTime.slice(11,16)}`);

                            // FORECAST
                            const forecastRow = $('#gov-forecast-row');
                            forecastRow.empty();
                            let dayCount = 0;
                            for (let i = 1; i < periods.length && dayCount < 6; i++) {
                                const period = periods[i];
                                if (!period.isDaytime) continue;

                                const iconClass = getGovWeatherIcon(period.shortForecast, true);
                                const dayName = new Date(period.startTime).toLocaleDateString("en-US",{weekday:"short"});
                                const dateStr = new Date(period.startTime).toLocaleDateString("en-US",{month:"short",day:"numeric"});

                                forecastRow.append(`
                                    <div class="col-xs-6 col-sm-4 col-md-3 col-lg-2">
                                        <div class="forecast-day">
                                            <h5>${dayName}</h5>
                                            <div style="font-size:1.5rem; color:#f1c40f">
                                                <i class="${iconClass}"></i>
                                            </div>
                                            <div>${period.temperature}°${period.temperatureUnit}</div>
                                            <div>${period.shortForecast}</div>
                                        </div>
                                    </div>
                                `);
                                dayCount++;
                            }
                        });
                })
                .fail(() => { $('#gov-current').html("Weather.gov API failed"); });
        })
        .fail(() => { $('#gov-current').html("ZIP geocoding failed"); });
}

// =====================
// SEARCH HANDLER
// =====================
$('#search-btn').on('click', () => {
    const zip = $('#search-input').val().trim();
    if (!zip) return alert("Enter a ZIP code");
    $('.weather-card').hide();
    loadWeatherGov(zip);
});

$('#search-input').on('keyup', e => {
    if (e.key === "Enter") $('#search-btn').click();
});
