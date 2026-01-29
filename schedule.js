const weeklySchedule = {
    Monday: [
        { start: "09:00", end: "11:00", activity: "Wake Up / Get Ready", location: "Home" },
        { start: "11:40", end: "13:00", activity: "CSE 465 - B Comparative Programming Languages", location: "McVey 166" },
        { start: "13:00", end: "14:00", activity: "Lunch", location: "Somewhere in the world" },
        { start: "14:00", end: "17:00", activity: "Work", location: "Armstrong 2030" },
        { start: "18:00", end: "20:00", activity: "Miss. Black & Gold Practice", location: "-" }
    ],
    Tuesday: [
        { start: "10:00", end: "12:00", activity: "Wake Up / School Work", location: "Home" },
        { start: "12:00", end: "14:00", activity: "School Work", location: "Home" },
        { start: "14:50", end: "16:10", activity: "IMS 413 - User Experience Research", location: "McVey 105" },
        { start: "16:15", end: "17:00", activity: "BLC Executive Meeting", location: "Armstrong 3rd Floor" },
        { start: "17:00", end: "18:00", activity: "BLC Meeting", location: "Armstrong C-Suite" },
        { start: "18:00", end: "23:59", activity: "Home", location: "-" }
    ],
    // Add Wednesday-Friday similarly...
};

// Convert "HH:MM" to minutes since midnight
function timeToMinutes(time) {
    const [hours, mins] = time.split(":").map(Number);
    return hours * 60 + mins;
}

// Generate schedule
function renderSchedule() {
    const container = $(".schedule-container");
    container.empty();

    const today = new Date();
    const currentDay = today.toLocaleString('en-US', { weekday: 'long' });
    const currentMinutes = today.getHours() * 60 + today.getMinutes();

    for (const [day, slots] of Object.entries(weeklySchedule)) {
        const dayCard = $(`
            <div class="day-card">
                <h3>${day}</h3>
            </div>
        `);

        slots.forEach(slot => {
            const startMinutes = timeToMinutes(slot.start);
            const endMinutes = timeToMinutes(slot.end);

            const isCurrent = day === currentDay && currentMinutes >= startMinutes && currentMinutes <= endMinutes;

            const slotDiv = $(`
                <div class="time-slot ${isCurrent ? 'current' : ''}">
                    <span class="time">${slot.start} - ${slot.end}</span>
                    <span class="activity">${slot.activity}</span>
                    <span class="location">${slot.location}</span>
                </div>
            `);

            dayCard.append(slotDiv);
        });

        container.append(dayCard);
    }
}

$(document).ready(function() {
    renderSchedule();

    // Update highlight every minute
    setInterval(renderSchedule, 60000);
});
