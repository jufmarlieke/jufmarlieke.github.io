let flashingTimeoutSpelling;
let flashingTimeoutLezen;

// Laad woordpakketten uit localStorage als die bestaan
if (localStorage.getItem('woordpakketten')) {
    const savedPakketten = JSON.parse(localStorage.getItem('woordpakketten'));
    Object.assign(woordpakketten, savedPakketten);
}

document.addEventListener('DOMContentLoaded', () => {
    loadPakketten();
});

function loadPakketten() {
    const spellingSelectie = document.getElementById('pakketSelectieSpelling');
    const lezenSelectie = document.getElementById('pakketSelectieLezen');
    
    // Leeg de huidige lijst
    spellingSelectie.innerHTML = '';
    lezenSelectie.innerHTML = '';
    
    for (const [pakket, woorden] of Object.entries(woordpakketten)) {
        let pakketElementSpelling = document.createElement('div');
        pakketElementSpelling.className = 'pakket-element';
        pakketElementSpelling.innerHTML = `
            <div class="pakket-title">${pakket}</div>
            <div class="pakket-buttons">
                <button class="edit-button">Bewerken</button>
                <button class="delete-button">Verwijderen</button>
            </div>
        `;
        pakketElementSpelling.querySelector('.pakket-title').onclick = () => selectPakket(woorden, pakket, 'spelling');
        pakketElementSpelling.querySelector('.edit-button').onclick = (e) => {
            e.stopPropagation();
            editPakket(pakket);
        };
        pakketElementSpelling.querySelector('.delete-button').onclick = (e) => {
            e.stopPropagation();
            deletePakket(pakket);
        };
        spellingSelectie.appendChild(pakketElementSpelling);

        let pakketElementLezen = document.createElement('div');
        pakketElementLezen.className = 'pakket-element';
        pakketElementLezen.innerHTML = `
            <div class="pakket-title">${pakket}</div>
            <div class="pakket-buttons">
                <button class="edit-button">Bewerken</button>
                <button class="delete-button">Verwijderen</button>
            </div>
        `;
        pakketElementLezen.querySelector('.pakket-title').onclick = () => selectPakket(woorden, pakket, 'lezen');
        pakketElementLezen.querySelector('.edit-button').onclick = (e) => {
            e.stopPropagation();
            editPakket(pakket);
        };
        pakketElementLezen.querySelector('.delete-button').onclick = (e) => {
            e.stopPropagation();
            deletePakket(pakket);
        };
        lezenSelectie.appendChild(pakketElementLezen);
    }
}

function selectPakket(woorden, pakket, type) {
    let wordsArray, selectedPakkettenArray, elementId;
    if (type === 'spelling') {
        wordsArray = wordsSpelling;
        selectedPakkettenArray = selectedPakkettenSpelling;
        elementId = 'selectedPakketSpelling';
    } else {
        wordsArray = wordsLezen;
        selectedPakkettenArray = selectedPakkettenLezen;
        elementId = 'selectedPakketLezen';
    }

    const index = selectedPakkettenArray.indexOf(pakket);
    if (index === -1) {
        wordsArray.push(...woorden);
        selectedPakkettenArray.push(pakket);
    } else {
        wordsArray = wordsArray.filter(word => !woorden.includes(word));
        selectedPakkettenArray.splice(index, 1);
    }

    document.getElementById(elementId).innerText = `Geselecteerde pakketten: ${selectedPakkettenArray.join(', ')}`;
    if (type === 'spelling') {
        wordsSpelling = wordsArray;
        selectedPakkettenSpelling = selectedPakkettenArray;
    } else {
        wordsLezen = wordsArray;
        selectedPakkettenLezen = selectedPakkettenArray;
    }
}

function showControls(subject) {
    document.getElementById('subjectMenu').style.display = 'none';
    document.getElementById('backToMenuButton').style.display = 'block';
    if (subject === 'spelling') {
        document.getElementById('controls').style.display = 'block';
    } else if (subject === 'lezen') {
        document.getElementById('readingControls').style.display = 'block';
    }
    // Hier kunnen we extra logica toevoegen voor andere vakken zoals taal en rekenen
}

function closeResults() {
    document.getElementById('resultDisplay').innerText = '';
    document.getElementById('closeButton').style.display = 'none';
    document.getElementById('returnButton').style.display = 'none';
    document.getElementById('controls').style.display = 'none';
    document.getElementById('readingControls').style.display = 'none';
    document.getElementById('subjectMenu').style.display = 'block';
    document.getElementById('backToMenuButton').style.display = 'none';
}

function returnToMenu() {
    clearTimeout(flashingTimeoutSpelling);
    clearTimeout(flashingTimeoutLezen);
    document.getElementById('resultDisplay').innerText = '';
    document.getElementById('closeButton').style.display = 'none';
    document.getElementById('returnButton').style.display = 'none';
    document.getElementById('controlButtons').style.display = 'none';
    document.getElementById('wordDisplay').innerText = '';
    document.getElementById('subjectMenu').style.display = 'block';
    document.getElementById('controls').style.display = 'none';
    document.getElementById('readingControls').style.display = 'none';
    document.getElementById('backToMenuButton').style.display = 'none';
}

function addNewPakket(type) {
    const newPakketNameInput = type === 'spelling' ? document.getElementById('newPakketName') : document.getElementById('newPakketNameLezen');
    const newPakketWordsInput = type === 'spelling' ? document.getElementById('newPakketWords') : document.getElementById('newPakketWordsLezen');
    const newPakketName = newPakketNameInput.value.trim();
    const newPakketWords = newPakketWordsInput.value.split(',').map(word => word.trim());
    
    if (newPakketName === '' || newPakketWords.length === 0 || newPakketWords[0] === '') {
        alert('Voer een geldige naam en enkele woorden in.');
        return;
    }

    if (woordpakketten[newPakketName]) {
        alert('Pakketnaam bestaat al. Kies een andere naam.');
        return;
    }
    
    woordpakketten[newPakketName] = newPakketWords;
    
    // Opslaan in localStorage
    localStorage.setItem('woordpakketten', JSON.stringify(woordpakketten));
    
    // Herlaad de pakketten om de nieuwe toe te voegen
    loadPakketten();
    
    // Maak de invoervelden leeg
    newPakketNameInput.value = '';
    newPakketWordsInput.value = '';
    alert('Nieuw pakket succesvol toegevoegd.');
}

function editPakket(pakket) {
    const newWords = prompt('Bewerk de woorden (gescheiden door komma\'s):', woordpakketten[pakket].join(', '));
    if (newWords !== null) {
        woordpakketten[pakket] = newWords.split(',').map(word => word.trim());
        localStorage.setItem('woordpakketten', JSON.stringify(woordpakketten));
        loadPakketten();
        alert(`Pakket "${pakket}" succesvol bewerkt.`);
    }
}

function deletePakket(pakket) {
    if (confirm(`Weet je zeker dat je het pakket "${pakket}" wilt verwijderen?`)) {
        delete woordpakketten[pakket];
        localStorage.setItem('woordpakketten', JSON.stringify(woordpakketten));
        loadPakketten();
        alert(`Pakket "${pakket}" succesvol verwijderd.`);
    }
}
