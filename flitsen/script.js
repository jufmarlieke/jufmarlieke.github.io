let flashingTimeoutSpelling;
let flashingTimeoutLezen;
let wordsSpelling = [];
let wordsLezen = [];
let selectedPakkettenSpelling = [];
let selectedPakkettenLezen = [];
let isPaused = false;
let currentIndex = 0;
let currentType = '';

if (localStorage.getItem('woordpakketten')) {
    const savedPakketten = JSON.parse(localStorage.getItem('woordpakketten'));
    Object.assign(woordpakketten, savedPakketten);
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('groupSelect').addEventListener('change', loadPakketten);
    loadPakketten();
});

function loadPakketten() {
    const group = document.getElementById('groupSelect').value;
    const spellingSelectie = document.getElementById('pakketSelectieSpelling');
    const lezenSelectie = document.getElementById('pakketSelectieLezen');

    spellingSelectie.innerHTML = '';
    lezenSelectie.innerHTML = '';

    if (!woordpakketten[group]) {
        return;
    }

    const pakketten = woordpakketten[group];

    for (const [pakket, woorden] of Object.entries(pakketten)) {
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
            editPakket(pakket, group);
        };
        pakketElementSpelling.querySelector('.delete-button').onclick = (e) => {
            e.stopPropagation();
            deletePakket(pakket, group);
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
            editPakket(pakket, group);
        };
        pakketElementLezen.querySelector('.delete-button').onclick = (e) => {
            e.stopPropagation();
            deletePakket(pakket, group);
        };
        lezenSelectie.appendChild(pakketElementLezen);
    }
}

function selectPakket(woorden, pakket, type) {
    const group = document.getElementById('groupSelect').value;
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
    document.getElementById('controls').style.display = 'none';
    document.getElementById('readingControls').style.display = 'none';

    if (subject === 'spelling') {
        document.getElementById('controls').style.display = 'block';
    } else if (subject === 'lezen') {
        document.getElementById('readingControls').style.display = 'block';
    }
}

function closeResults() {
    document.getElementById('resultDisplay').innerText = '';
    document.getElementById('resultDisplay').style.display = 'none';
    document.getElementById('closeButton').style.display = 'none';
    document.getElementById('controlButtons').style.display = 'none';
    document.getElementById('wordDisplay').innerText = '';
    document.getElementById('wordDisplay').style.display = 'none';
    document.getElementById('subjectMenu').style.display = 'block';
    document.getElementById('controls').style.display = 'none';
    document.getElementById('readingControls').style.display = 'none';
    document.getElementById('backToMenuButton').style.display = 'none';
}

function returnToMenu() {
    clearTimeout(flashingTimeoutSpelling);
    clearTimeout(flashingTimeoutLezen);
    showResults();
    closeResults();
}

function showResults() {
    const resultDisplay = document.getElementById('resultDisplay');
    resultDisplay.innerText = (currentType === 'spelling' ? wordsSpelling : wordsLezen).slice(0, currentIndex).join(', ');
    resultDisplay.style.display = 'block';
}

function addNewPakket(type) {
    const group = document.getElementById('groupSelect').value;
    const newPakketNameInput = type === 'spelling' ? document.getElementById('newPakketName') : document.getElementById('newPakketNameLezen');
    const newPakketWordsInput = type === 'spelling' ? document.getElementById('newPakketWords') : document.getElementById('newPakketWordsLezen');
    const newPakketName = newPakketNameInput.value.trim();
    const newPakketWords = newPakketWordsInput.value.split(',').map(word => word.trim());

    if (newPakketName === '' || newPakketWords.length === 0 || newPakketWords[0] === '') {
        alert('Voer een geldige naam en enkele woorden in.');
        return;
    }

    if (woordpakketten[group][newPakketName]) {
        alert('Pakketnaam bestaat al. Kies een andere naam.');
        return;
    }

    woordpakketten[group][newPakketName] = newPakketWords;

    localStorage.setItem('woordpakketten', JSON.stringify(woordpakketten));

    loadPakketten();

    newPakketNameInput.value = '';
    newPakketWordsInput.value = '';
    alert('Nieuw pakket succesvol toegevoegd.');
}

function editPakket(pakket, group) {
    const newWords = prompt('Bewerk de woorden (gescheiden door komma\'s):', woordpakketten[group][pakket].join(', '));
    if (newWords !== null) {
        woordpakketten[group][pakket] = newWords.split(',').map(word => word.trim());
        localStorage.setItem('woordpakketten', JSON.stringify(woordpakketten));
        loadPakketten();
        alert(`Pakket "${pakket}" succesvol bewerkt.`);
    }
}

function deletePakket(pakket, group) {
    if (confirm(`Weet je zeker dat je het pakket "${pakket}" wilt verwijderen?`)) {
        delete woordpakketten[group][pakket];
        localStorage.setItem('woordpakketten', JSON.stringify(woordpakketten));
        loadPakketten();
        alert(`Pakket "${pakket}" succesvol verwijderd.`);
    }
}

function startFlashing(type) {
    let wordsArray, duration, blankDuration, wordCount, elementId;
    currentType = type;

    if (type === 'spelling') {
        if (selectedPakkettenSpelling.length === 0) {
            alert("Selecteer ten minste één woordpakket.");
            return;
        }
        wordsArray = wordsSpelling;
        duration = parseInt(document.getElementById('duration').value, 10);
        blankDuration = parseInt(document.getElementById('blankDuration').value, 10);
        wordCount = parseInt(document.getElementById('wordCount').value, 10);
        elementId = 'wordDisplay';
    } else {
        if (selectedPakkettenLezen.length === 0) {
            alert("Selecteer ten minste één woordpakket.");
            return;
        }
        wordsArray = wordsLezen;
        duration = parseInt(document.getElementById('readingSpeed').value, 10);
        wordCount = parseInt(document.getElementById('readingWordCount').value, 10);
        blankDuration = 1000;
        elementId = 'wordDisplay';
    }

    document.getElementById('controls').style.display = 'none';
    document.getElementById('readingControls').style.display = 'none';
    document.getElementById('wordDisplay').style.display = 'flex';
    document.getElementById('resultDisplay').style.display = 'none';

    let words = wordsArray.slice(0, wordCount);
    currentIndex = 0;
    isPaused = false;

    function flashWord() {
        if (isPaused) return;

        if (currentIndex < words.length) {
            document.getElementById(elementId).innerText = words[currentIndex];
            currentIndex++;
            let flashingTimeout = setTimeout(() => {
                document.getElementById(elementId).innerText = '';
                flashingTimeout = setTimeout(flashWord, blankDuration);
            }, duration);

            if (type === 'spelling') {
                flashingTimeoutSpelling = flashingTimeout;
            } else {
                flashingTimeoutLezen = flashingTimeout;
            }
        } else {
            if (type === 'spelling') {
                clearTimeout(flashingTimeoutSpelling);
            } else {
                clearTimeout(flashingTimeoutLezen);
            }
            showResults();
            document.getElementById('controlButtons').style.display = 'none';
        }
    }

    flashWord();
    document.getElementById('controlButtons').style.display = 'block';
}

function startFlashingSpelling() {
    startFlashing('spelling');
}

function startFlashingLezen() {
    startFlashing('lezen');
}

function pauseFlashing() {
    isPaused = !isPaused;
    if (!isPaused) {
        if (currentType === 'spelling') {
            startFlashingFromIndex('spelling', currentIndex);
        } else {
            startFlashingFromIndex('lezen', currentIndex);
        }
    }
}

function startFlashingFromIndex(type, index) {
    let wordsArray, duration, blankDuration, wordCount, elementId;

    if (type === 'spelling') {
        wordsArray = wordsSpelling;
        duration = parseInt(document.getElementById('duration').value, 10);
        blankDuration = parseInt(document.getElementById('blankDuration').value, 10);
        wordCount = parseInt(document.getElementById('wordCount').value, 10);
        elementId = 'wordDisplay';
    } else {
        wordsArray = wordsLezen;
        duration = parseInt(document.getElementById('readingSpeed').value, 10);
        wordCount = parseInt(document.getElementById('readingWordCount').value, 10);
        blankDuration = 1000;
        elementId = 'wordDisplay';
    }

    let words = wordsArray.slice(0, wordCount);
    currentIndex = index;

    function flashWord() {
        if (isPaused) return;

        if (currentIndex < words.length) {
            document.getElementById(elementId).innerText = words[currentIndex];
            currentIndex++;
            let flashingTimeout = setTimeout(() => {
                document.getElementById(elementId).innerText = '';
                flashingTimeout = setTimeout(flashWord, blankDuration);
            }, duration);

            if (type === 'spelling') {
                flashingTimeoutSpelling = flashingTimeout;
            } else {
                flashingTimeoutLezen = flashingTimeout;
            }
        } else {
            if (type === 'spelling') {
                clearTimeout(flashingTimeoutSpelling);
            } else {
                clearTimeout(flashingTimeoutLezen);
            }
            showResults();
            document.getElementById('controlButtons').style.display = 'none';
        }
    }

    flashWord();
    document.getElementById('controlButtons').style.display = 'block';
}

function stopFlashing() {
    clearTimeout(flashingTimeoutSpelling);
    clearTimeout(flashingTimeoutLezen);
    showResults();
    document.getElementById('controlButtons').style.display = 'none';
}

document.querySelector('#controls button[onclick="startFlashingSpelling()"]').onclick = startFlashingSpelling;
document.querySelector('#readingControls button[onclick="startFlashingLezen()"]').onclick = startFlashingLezen;
