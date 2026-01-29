document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll(".nav-link");
    const scheduleItems = document.querySelectorAll(".schedule-item");

    function updateSchedule() {
        const now = new Date();
        const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ... 5 = Friday
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        // Automatically switch to today tab (Mon=1, Tue=2,...)
        const todayTabIndex = dayOfWeek >= 1 && dayOfWeek <= 5 ? dayOfWeek - 1 : 0;
        tabs.forEach((tab, i) => {
            tab.classList.toggle("active", i === todayTabIndex);
            const target = document.querySelector(tab.dataset.bsTarget);
            target.classList.toggle("show", i === todayTabIndex);
            target.classList.toggle("active", i === todayTabIndex);
        });

        // Highlight current activity
        scheduleItems.forEach(item => {
            const [startHour, startMin] = item.dataset.start.split(":").map(Number);
            const [endHour, endMin] = item.dataset.end.split(":").map(Number);

            const start = new Date();
            start.setHours(startHour, startMin, 0, 0);
            const end = new Date();
            end.setHours(endHour, endMin, 0, 0);

            if (now >= start && now <= end) {
                item.classList.add("current");
            } else {
                item.classList.remove("current");
            }
        });
    }

    updateSchedule();
    setInterval(updateSchedule, 60000); // Update every minute
});
