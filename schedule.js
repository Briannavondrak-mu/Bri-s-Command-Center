document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll(".nav-link");
    const scheduleItems = document.querySelectorAll(".schedule-item");

    function updateSchedule() {
        const now = new Date();
        const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon, 5=Fri
        const hours = now.getHours();
        const minutes = now.getMinutes();

        // Auto switch tab to today (Mon-Fri)
        const todayTabIndex = dayOfWeek >= 1 && dayOfWeek <= 5 ? dayOfWeek - 1 : 0;
        tabs.forEach((tab, i) => {
            const target = document.querySelector(tab.getAttribute("data-bs-target"));
            if (i === todayTabIndex) {
                tab.classList.add("active");
                target.classList.add("in", "active"); // Bootstrap 3 uses "in"
            } else {
                tab.classList.remove("active");
                target.classList.remove("in", "active");
            }
        });

        // Highlight current activity
        scheduleItems.forEach(item => {
            if (!item.dataset.start || !item.dataset.end) return; // skip if not set
            const start = item.dataset.start.split(":").map(Number);
            const end = item.dataset.end.split(":").map(Number);

            const startTime = start[0] * 60 + start[1];
            const endTime = end[0] * 60 + end[1];
            const nowTime = hours * 60 + minutes;

            if (nowTime >= startTime && nowTime <= endTime) {
                item.classList.add("current");
            } else {
                item.classList.remove("current");
            }
        });
    }

    updateSchedule();
    setInterval(updateSchedule, 60000); // check every minute
});
