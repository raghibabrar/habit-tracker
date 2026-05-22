let habits = JSON.parse(localStorage.getItem('habits')) || [];
let records = JSON.parse(localStorage.getItem('records')) || {}; 
let currentViewDate = new Date();

const gridContainer = document.getElementById('tracker-container');
const emptyState = document.getElementById('empty-state');
const weekLabel = document.getElementById('current-week-label');
const habitInput = document.getElementById('new-habit-input');

function formatDate(date) {
    let y = date.getFullYear();
    let m = String(date.getMonth() + 1).padStart(2, '0');
    let d = String(date.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + d;
}

function getWeekDates(date) {
    let dates = [];
    let current = new Date(date);
    let day = current.getDay();
    let diff = current.getDate() - day + (day === 0 ? -6 : 1);
    
    current.setDate(diff);
    for (let i = 0; i < 7; i++) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
    }
    return dates;
}

function calculateStreak(habitId) {
    let streak = 0;
    let d = new Date();
    let todayStr = formatDate(d);
    
    if (!records[habitId] || !records[habitId][todayStr]) {
        d.setDate(d.getDate() - 1);
    }

    let keepCounting = true;
    while (keepCounting) {
        let dateStr = formatDate(d);
        if (records[habitId] && records[habitId][dateStr]) {
            streak++;
            d.setDate(d.getDate() - 1);
        } else {
            keepCounting = false;
        }
    }
    return streak;
}

function saveData() {
    localStorage.setItem('habits', JSON.stringify(habits));
    localStorage.setItem('records', JSON.stringify(records));
    render();
}

function render() {
    let weekDates = getWeekDates(currentViewDate);
    let todayStr = formatDate(new Date());

    let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    weekLabel.innerText = monthNames[weekDates[0].getMonth()] + " " + weekDates[0].getDate() + " - " + monthNames[weekDates[6].getMonth()] + " " + weekDates[6].getDate();

    if (habits.length === 0) {
        emptyState.classList.remove('hidden');
        gridContainer.innerHTML = '';
        return;
    }

    emptyState.classList.add('hidden');
    
    let html = '<div class="tracker-grid">';
    
    html += '<div class="grid-cell header-cell habit-name-cell">Habit</div>';
    let days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    for (let i = 0; i < weekDates.length; i++) {
        let date = weekDates[i];
        let isToday = formatDate(date) === todayStr;
        let colClass = isToday ? 'today-col' : '';
        html += '<div class="grid-cell header-cell ' + colClass + '">';
        html += '<span>' + days[i] + '</span>';
        html += '<span>' + date.getDate() + '</span>';
        html += '</div>';
    }
    html += '<div class="grid-cell header-cell">🔥</div>';

    for (let i = 0; i < habits.length; i++) {
        let habit = habits[i];
        html += '<div class="grid-cell habit-name-cell">';
        html += habit.name;
        html += '<button onclick="deleteHabit(\'' + habit.id + '\')" style="border:none; background:none; font-size:12px; color:red;">✕</button>';
        html += '</div>';
        
        for (let j = 0; j < weekDates.length; j++) {
            let date = weekDates[j];
            let dateStr = formatDate(date);
            let isToday = dateStr === todayStr;
            let colClass = isToday ? 'today-col' : '';
            let isChecked = records[habit.id] && records[habit.id][dateStr];
            let checkClass = isChecked ? 'checked' : '';
            
            html += '<div class="grid-cell ' + colClass + '">';
            html += '<button class="check-btn ' + checkClass + '" aria-label="Toggle habit" onclick="toggleHabit(\'' + habit.id + '\', \'' + dateStr + '\')"></button>';
            html += '</div>';
        }
        
        html += '<div class="grid-cell streak-cell">' + calculateStreak(habit.id) + '</div>';
    }

    html += '</div>';
    gridContainer.innerHTML = html;
}

function toggleHabit(habitId, dateStr) {
    if (!records[habitId]) {
        records[habitId] = {};
    }
    records[habitId][dateStr] = !records[habitId][dateStr];
    saveData();
}

function deleteHabit(id) {
    if(confirm("Delete this habit?")) {
        let newHabits = [];
        for (let i = 0; i < habits.length; i++) {
            if (habits[i].id !== id) {
                newHabits.push(habits[i]);
            }
        }
        habits = newHabits;
        delete records[id];
        saveData();
    }
}

document.getElementById('add-habit-btn').addEventListener('click', function() {
    let name = habitInput.value.trim();
    if (name) {
        habits.push({ id: Date.now().toString(), name: name });
        habitInput.value = '';
        saveData();
    }
});

document.getElementById('prev-week').addEventListener('click', function() {
    currentViewDate.setDate(currentViewDate.getDate() - 7);
    render();
});

document.getElementById('next-week').addEventListener('click', function() {
    currentViewDate.setDate(currentViewDate.getDate() + 7);
    render();
});

document.getElementById('today-btn').addEventListener('click', function() {
    currentViewDate = new Date();
    render();
});

render();