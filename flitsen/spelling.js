let wordsSpelling = [];
let usedWordsSpelling = [];
let selectedPakkettenSpelling = [];
let wordDisplayDurationSpelling = 2000;
let blankDisplayDurationSpelling = 2000;
let wordCountSpelling = 10;
let flashingTimeoutSpelling;
let flashingPausedSpelling = false;

function startFlashing() {
    // Haal de instellingen op
    wordDisplayDurationSpelling = parseInt(document.getElementById('duration').value);
    blankDisplayDurationSpelling = parseInt(document.getElementById('blankDuration').value);
    wordCountSpelling = parseInt(document.getElementById('wordCount').value);

    // Reset de gebruikte woordenlijst en toon de resultatenknop niet
    usedWordsSpelling = [];
    document.getElementById('resultDisplay').innerHTML = '';
    document.getElementById('closeButton').style.display = 'none';
    document.getElementById('returnButton').style.display = 'none';

    // Verberg de bedieningspanelen en toon de bedieningsknoppen
    document.getElementById('controls').style.display = 'none';
    document.getElementById('controlButtons').style.display = 'block';

    // Begin met woorden flitsen
    flashWordSpelling();
}

function flashWordSpelling() {
    if (usedWordsSpelling.length >= wordCountSpelling || usedWordsSpelling.length >= wordsSpelling.length) {
        showResults();
        return;
    }

    let word;
    do {
        word = wordsSpelling[Math.floor(Math.random() * wordsSpelling.length)];
    } while (usedWordsSpelling.includes(word));

    usedWordsSpelling.push(word);
    document.getElementById('wordDisplay').innerText = word;

    flashingTimeoutSpelling = setTimeout(() => {
        document.getElementById('wordDisplay').innerText = '';
        flashingTimeoutSpelling = setTimeout(flashWordSpelling, blankDisplayDurationSpelling);
    }, wordDisplayDurationSpelling);
}

function showResults() {
    const resultDisplay = document.getElementById('resultDisplay');
    resultDisplay.innerHTML = ''; // Clear previous results
    usedWordsSpelling.forEach(word => {
        const wordElement = document.createElement('div');
        wordElement.innerText = word;
        resultDisplay.appendChild(wordElement);
    });
    document.getElementById('closeButton').style.display = 'inline';
    document.getElementById('returnButton').style.display = 'inline';
    document.getElementById('controlButtons').style.display = 'none';
}

function pauseFlashing() {
    if (flashingPausedSpelling) {
        flashingPausedSpelling = false;
        flashWordSpelling();
    } else {
        flashingPausedSpelling = true;
        clearTimeout(flashingTimeoutSpelling);
    }
}

function stopFlashing() {
    clearTimeout(flashingTimeoutSpelling);
    document.getElementById('wordDisplay').innerText = '';
    showResults();
}

function selectPakketSpelling(woorden, pakket) {
    if (!selectedPakkettenSpelling.includes(pakket)) {
        wordsSpelling = [...wordsSpelling, ...woorden];
        selectedPakkettenSpelling.push(pakket);
    } else {
        wordsSpelling = wordsSpelling.filter(word => !woorden.includes(word));
        selectedPakkettenSpelling = selectedPakkettenSpelling.filter(p => p !== pakket);
    }
    document.getElementById('selectedPakketSpelling').innerText = `Geselecteerde pakketten: ${selectedPakkettenSpelling.join(', ')}`;
}

document.addEventListener('DOMContentLoaded', () => {
    const spellingSelectie = document.getElementById('pakketSelectieSpelling');
    for (const [pakket, woorden] of Object.entries(woordpakketten)) {
        let pakketElement = document.createElement('div');
        pakketElement.innerText = pakket;
        pakketElement.onclick = () => selectPakketSpelling(woorden, pakket);
        spellingSelectie.appendChild(pakketElement);
    }
});
