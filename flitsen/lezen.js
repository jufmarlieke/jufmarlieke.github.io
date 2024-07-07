let wordsLezen = [];
let usedWordsLezen = [];
let selectedPakkettenLezen = [];
let wordDisplayDurationLezen = 2000;
let blankDisplayDurationLezen = 500;
let wordCountLezen = 10;
let flashingPausedLezen = false;

function startReading() {
    // Haal de instellingen op
    wordDisplayDurationLezen = parseInt(document.getElementById('readingSpeed').value);
    wordCountLezen = parseInt(document.getElementById('readingWordCount').value);

    // Reset de gebruikte woordenlijst en toon de resultatenknop niet
    usedWordsLezen = [];
    document.getElementById('resultDisplay').innerHTML = '';
    document.getElementById('closeButton').style.display = 'none';
    document.getElementById('returnButton').style.display = 'none';

    // Verberg de bedieningspanelen en toon de bedieningsknoppen
    document.getElementById('readingControls').style.display = 'none';
    document.getElementById('controlButtons').style.display = 'block';

    // Begin met woorden flitsen
    flashReadingWord();
}

function flashReadingWord() {
    if (usedWordsLezen.length >= wordCountLezen || usedWordsLezen.length >= wordsLezen.length) {
        showResults();
        return;
    }

    let word;
    do {
        word = wordsLezen[Math.floor(Math.random() * wordsLezen.length)];
    } while (usedWordsLezen.includes(word));

    usedWordsLezen.push(word);
    document.getElementById('wordDisplay').innerText = word;

    flashingTimeoutLezen = setTimeout(() => {
        document.getElementById('wordDisplay').innerText = '';
        if (!flashingPausedLezen) {
            flashReadingWord();
        }
    }, wordDisplayDurationLezen);
}

function showResults() {
    const resultDisplay = document.getElementById('resultDisplay');
    resultDisplay.innerHTML = ''; // Clear previous results
    usedWordsLezen.forEach(word => {
        const wordElement = document.createElement('div');
        wordElement.innerText = word;
        resultDisplay.appendChild(wordElement);
    });
    document.getElementById('closeButton').style.display = 'inline';
    document.getElementById('returnButton').style.display = 'inline';
    document.getElementById('controlButtons').style.display = 'none';
}

function pauseFlashing() {
    if (flashingPausedLezen) {
        flashingPausedLezen = false;
        flashReadingWord();
    } else {
        flashingPausedLezen = true;
        clearTimeout(flashingTimeoutLezen);
    }
}

function stopFlashing() {
    clearTimeout(flashingTimeoutLezen);
    document.getElementById('wordDisplay').innerText = '';
    showResults();
}

function selectPakketLezen(woorden, pakket) {
    const index = selectedPakkettenLezen.indexOf(pakket);
    if (index === -1) {
        wordsLezen = [...wordsLezen, ...woorden];
        selectedPakkettenLezen.push(pakket);
    } else {
        wordsLezen = wordsLezen.filter(word => !woorden.includes(word));
        selectedPakkettenLezen.splice(index, 1);
    }
    document.getElementById('selectedPakketLezen').innerText = `Geselecteerde pakketten: ${selectedPakkettenLezen.join(', ')}`;
}

document.addEventListener('DOMContentLoaded', () => {
    const lezenSelectie = document.getElementById('pakketSelectieLezen');
    for (const [pakket, woorden] of Object.entries(woordpakketten)) {
        let pakketElement = document.createElement('div');
        pakketElement.innerText = pakket;
        pakketElement.onclick = () => selectPakketLezen(woorden, pakket);
        lezenSelectie.appendChild(pakketElement);
    }
});
