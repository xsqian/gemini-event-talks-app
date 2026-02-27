document.addEventListener('DOMContentLoaded', () => {
    const scheduleContainer = document.getElementById('schedule');
    const searchInput = document.getElementById('searchInput');

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const renderSchedule = (talks) => {
        scheduleContainer.innerHTML = '';
        if (talks.length === 0) {
            scheduleContainer.innerHTML = `<div class="no-results">No talks match your search.</div>`;
            return;
        }

        let currentTime = new Date();
        currentTime.setHours(10, 0, 0, 0); // Event starts at 10:00 AM

        talks.forEach((talk, index) => {
            const startTime = new Date(currentTime);
            const endTime = new Date(currentTime.getTime() + talk.duration * 60000);

            const talkElement = document.createElement('div');
            talkElement.className = 'schedule-item';
            talkElement.innerHTML = `
                <div class="schedule-time">
                    ${formatTime(startTime)} - ${formatTime(endTime)}
                </div>
                <div class="talk-details">
                    <h2>${talk.title}</h2>
                    <div class="speakers">By: ${talk.speakers.join(', ')}</div>
                    <div class="categories">
                        ${talk.category.map(cat => `<span class="category">${cat}</span>`).join('')}
                    </div>
                    <p>${talk.description}</p>
                </div>
            `;
            scheduleContainer.appendChild(talkElement);

            currentTime = endTime;

            // Add breaks
            if (index === 1) { // Lunch break after the 2nd talk
                const lunchBreakElement = document.createElement('div');
                lunchBreakElement.className = 'break-item';
                const lunchEndTime = new Date(currentTime.getTime() + 60 * 60000);
                lunchBreakElement.textContent = `Lunch Break (${formatTime(currentTime)} - ${formatTime(lunchEndTime)})`;
                scheduleContainer.appendChild(lunchBreakElement);
                currentTime = lunchEndTime;
            } else if (index < talks.length - 1) { // 10-minute break between other talks
                const breakElement = document.createElement('div');
                breakElement.className = 'break-item';
                const breakEndTime = new Date(currentTime.getTime() + 10 * 60000);
                breakElement.textContent = `Break (${formatTime(currentTime)} - ${formatTime(breakEndTime)})`;
                scheduleContainer.appendChild(breakElement);
                currentTime = breakEndTime;
            }
        });
    };

    const filterTalks = (query) => {
        const lowerCaseQuery = query.toLowerCase().trim();
        if (!lowerCaseQuery) {
            return talksData;
        }
        return talksData.filter(talk => 
            talk.category.some(cat => cat.toLowerCase().includes(lowerCaseQuery))
        );
    };

    searchInput.addEventListener('input', () => {
        const filteredTalks = filterTalks(searchInput.value);
        renderSchedule(filteredTalks);
    });

    // Initial render
    renderSchedule(talksData);
});
