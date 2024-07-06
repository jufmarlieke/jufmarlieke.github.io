let wordsLezen = [];
let usedWordsLezen = [];
let selectedPakkettenLezen = [];
let wordDisplayDurationLezen = 2000;
let blankDisplayDurationLezen = 500;
let wordCountLezen = 10;
let flashingTimeoutLezen;
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
        flashingTimeoutLezen = setTimeout(flashReadingWord, blankDisplayDurationLezen);
    }, wordDisplayDurationLezen);
}

function selectPakketLezen(woorden, pakket) {
    wordsLezen = [...wordsLezen, ...woorden];
    selectedPakkettenLezen.push(pakket);
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
