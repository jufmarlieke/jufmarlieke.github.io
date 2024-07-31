import { loadPakketten as loadPakkettenSpelling } from './spelling.js';
import { loadPakketten as loadPakkettenLezen } from './lezen.js';

let flashingTimeoutSpelling;
let flashingTimeoutLezen;
let wordsSpelling = [];
let wordsLezen = [];
let selectedPakkettenSpelling = [];
let selectedPakkettenLezen = [];
let isPaused = false;
let currentIndex = 0;
let currentType = '';

let woordpakketten = {};

if (localStorage.getItem('woordpakketten')) {
    woordpakketten = JSON.parse(localStorage.getItem('woordpakketten'));
}

function showControls(subject) {
    document.getElementById('subjectMenu').style.display = 'none';
    document.getElementById('backToMenuButton').style.display = 'block';
    document.getElementById('controls').style.display = 'none';
    document.getElementById('readingControls').style.display = 'none';

    if (subject === 'spelling') {
        document.getElementById('controls').style.display = 'block';
        loadPakkettenSpelling('Spelling');
    } else if (subject === 'lezen') {
        document.getElementById('readingControls').style.display = 'block';
        loadPakkettenLezen('Lezen');
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

    if (type === 'spelling') {
        loadPakkettenSpelling('Spelling');
    } else {
        loadPakkettenLezen('Lezen');
    }

    newPakketNameInput.value = '';
    newPakketWordsInput.value = '';
    alert('Nieuw pakket succesvol toegevoegd.');
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

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('spellingButton').addEventListener('click', () => showControls('spelling'));
    document.getElementById('lezenButton').addEventListener('click', () => showControls('lezen'));
    document.querySelector('#controls button[onclick="startFlashingSpelling()"]').onclick = startFlashingSpelling;
    document.querySelector('#readingControls button[onclick="startFlashingLezen()"]').onclick = startFlashingLezen;
});

window.showControls = showControls;
window.addNewPakket = addNewPakket;
window.pauseFlashing = pauseFlashing;
window.stopFlashing = stopFlashing;
window.startFlashingSpelling = startFlashingSpelling;
window.startFlashingLezen = startFlashingLezen;
