// JavaScript functionaliteit
let currentWeek = 1;
const planningData = {
    1: [
        { time: '08:30 - 09:00', maandag: 'Lezen / LBO', dinsdag: 'Lezen / LBO', woensdag: 'Lezen / LBO', donderdag: 'Lezen / LBO', vrijdag: 'Lezen / LBO' },
        { time: '09:00 - 10:00', maandag: 'Rekenen', dinsdag: 'Rekenen', woensdag: 'Rekenen', donderdag: 'Rekenen', vrijdag: 'Rekenen' },
        // Voeg hier meer lessen toe
    ],
    // Voeg meer weken toe
};

function renderPlanning() {
    const tbody = document.getElementById('planning-body');
    tbody.innerHTML = '';
    const week = planningData[currentWeek];
    week.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.time}</td>
            <td class="vak-item" draggable="true" ondragstart="drag(event)">${row.maandag}</td>
            <td class="vak-item" draggable="true" ondragstart="drag(event)">${row.dinsdag}</td>
            <td class="vak-item" draggable="true" ondragstart="drag(event)">${row.woensdag}</td>
            <td class="vak-item" draggable="true" ondragstart="drag(event)">${row.donderdag}</td>
            <td class="vak-item" draggable="true" ondragstart="drag(event)">${row.vrijdag}</td>
        `;
        tbody.appendChild(tr);
    });
    document.getElementById('week-label').innerText = `Week ${currentWeek}`;
}

function prevWeek() {
    if (currentWeek > 1) {
        currentWeek--;
        renderPlanning();
    }
}

function nextWeek() {
    currentWeek++;
    if (!planningData[currentWeek]) {
        planningData[currentWeek] = [];
    }
    renderPlanning();
}

function addVak() {
    const vakNaam = document.getElementById('vak-naam').value;
    if (vakNaam) {
        planningData[currentWeek].push({ time: 'Nieuw Tijdslot', maandag: vakNaam, dinsdag: vakNaam, woensdag: vakNaam, donderdag: vakNaam, vrijdag: vakNaam });
        renderPlanning();
    }
}

function drag(event) {
    event.dataTransfer.setData('text', event.target.innerText);
}

function allowDrop(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData('text');
    event.target.innerText = data;
}

// Initial render
renderPlanning();
