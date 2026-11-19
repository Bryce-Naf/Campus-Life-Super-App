const calendarElement = document.getElementById('calendar');
const calendarStatus = document.getElementById('calendar-status');
const fullCalendar = window.FullCalendar;

if (!calendarElement || !calendarStatus) {
    console.error('Calendar markup is incomplete; expected #calendar and #calendar-status.');
} else if (
    !fullCalendar ||
    !fullCalendar.Calendar ||
    !fullCalendar.DayGrid ||
    !fullCalendar.DayGrid.default ||
    !fullCalendar.TimeGrid ||
    !fullCalendar.TimeGrid.default ||
    !fullCalendar.Interaction ||
    !fullCalendar.Interaction.default
) {
    console.error('FullCalendar did not load. Check the installed browser bundles and script paths.');
} else {
    const today = new Date();
    const dateAfter = (days) => {
        const date = new Date(today);
        date.setDate(date.getDate() + days);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${date.getFullYear()}-${month}-${day}`;
    };
    const dateKey = (date) => {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${date.getFullYear()}-${month}-${day}`;
    };
    const nthWeekday = (year, month, weekday, occurrence) => {
        const firstDay = new Date(year, month, 1);
        const offset = (weekday - firstDay.getDay() + 7) % 7;
        return new Date(year, month, 1 + offset + 7 * (occurrence - 1));
    };
    const lastWeekday = (year, month, weekday) => {
        const lastDay = new Date(year, month + 1, 0);
        const offset = (lastDay.getDay() - weekday + 7) % 7;
        return new Date(year, month, lastDay.getDate() - offset);
    };
    const federalHolidays = (year) => {
        const holiday = (name, date) => {
            return {
                title: name,
                start: dateKey(date),
                allDay: true,
                classNames: ['calendar-holiday']
            };
        };

        return [
            holiday("New Year's Day", new Date(year, 0, 1)),
            holiday('Martin Luther King Jr. Day', nthWeekday(year, 0, 1, 3)),
            holiday("Presidents' Day", nthWeekday(year, 1, 1, 3)),
            holiday('Memorial Day', lastWeekday(year, 4, 1)),
            holiday('Juneteenth National Independence Day', new Date(year, 5, 19)),
            holiday('Independence Day', new Date(year, 6, 4)),
            holiday('Labor Day', nthWeekday(year, 8, 1, 1)),
            holiday('Columbus Day', nthWeekday(year, 9, 1, 2)),
            holiday('Veterans Day', new Date(year, 10, 11)),
            holiday('Thanksgiving Day', nthWeekday(year, 10, 4, 4)),
            holiday('Christmas Day', new Date(year, 11, 25))
        ];
    };
    const studyGroupDate = dateAfter(3);

    const calendar = new fullCalendar.Calendar(calendarElement, {
        plugins: [
            fullCalendar.DayGrid.default,
            fullCalendar.TimeGrid.default,
            fullCalendar.Interaction.default
        ],
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        height: 'auto',
        events(fetchInfo, successCallback) {
            const events = [
                { title: 'Sample: Campus gathering', start: dateAfter(1) },
                {
                    title: 'Sample: Study group',
                    start: `${studyGroupDate}T18:00:00`,
                    end: `${studyGroupDate}T19:30:00`
                },
                { title: 'Sample: Community service', start: dateAfter(5) }
            ];
            const rangeStart = fetchInfo.startStr.slice(0, 10);
            const rangeEnd = fetchInfo.endStr.slice(0, 10);

            for (let year = fetchInfo.start.getFullYear() - 1; year <= fetchInfo.end.getFullYear() + 1; year += 1) {
                for (const holidayEvent of federalHolidays(year)) {
                    if (holidayEvent.start >= rangeStart && holidayEvent.start < rangeEnd) {
                        events.push(holidayEvent);
                    }
                }
            }

            successCallback(events);
        },
        dateClick(info) {
            const selectedDate = new Intl.DateTimeFormat(undefined, { dateStyle: 'full' }).format(info.date);
            calendarStatus.textContent = `Selected date: ${selectedDate}`;
        }
    });

    calendar.render();
}