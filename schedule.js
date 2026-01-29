document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll("#schedule-tabs li");
    const scheduleItems = document.querySelectorAll(".schedule-item");

    function updateSchedule() {
        const now = new Date();
        const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon
        const hours = now.getHours();
        const minutes = now.getMinutes();

        // Auto switch tab (Mon-Fri)
        const todayTabIndex = dayOfWeek >= 1 && dayOfWeek <= 5 ? dayOfWeek - 1 : 0;
        tabs.forEach((tab, i) => {
            const link = tab.querySelector("a");
            const target = document.querySelector(link.getAttribute("href"));
            if (i === todayTabIndex) {
                tab.classList.add("active");
                $(target).addClass("in active");
            } else {
                tab.classList.remove("active");
                $(target).removeClass("in active");
            }
        });

        // Highlight current schedule item
        scheduleItems.forEach(item => {
            if (!item.dataset.start || !item.dataset.end) return;
            const start = item.dataset.start.split(":").map(Number);
            const end = item.dataset.end.split(":").map(Number);
            const startTime = start[0]*60 + start[1];
            const endTime = end[0]*60 + end[1];
            const nowTime = hours*60 + minutes;

            if (nowTime >= startTime && nowTime <= endTime) {
                item.classList.add("current");
            } else {
                item.classList.remove("current");
            }
        });
    }

    updateSchedule();
    setInterval(updateSchedule, 60000);
});
