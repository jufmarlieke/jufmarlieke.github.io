let words = [];
let usedWords = [];
let wordDisplayDuration = 2000;
let blankDisplayDuration = 2000;
let wordCount = 10;
let flashingTimeout;
let flashingPaused = false;
let currentWordIndex = 0;

function showControls(subject) {
    document.getElementById('subjectMenu').style.display = 'none';
    if (subject === 'spelling') {
        document.getElementById('controls').style.display = 'block';
    } else if (subject === 'lezen') {
        document.getElementById('readingControls').style.display = 'block';
    }
    // Hier kunnen we extra logica toevoegen voor andere vakken zoals taal en rekenen
}

function startFlashing() {
    // Haal de instellingen op
    wordDisplayDuration = parseInt(document.getElementById('duration').value);
    blankDisplayDuration = parseInt(document.getElementById('blankDuration').value);
    wordCount = parseInt(document.getElementById('wordCount').value);

    // Reset de gebruikte woordenlijst en toon de resultatenknop niet
    usedWords = [];
    document.getElementById('resultDisplay').innerHTML = '';
    document.getElementById('closeButton').style.display = 'none';
    document.getElementById('returnButton').style.display = 'none';

    // Verberg de bedieningspanelen en toon de bedieningsknoppen
    document.getElementById('controls').style.display = 'none';
    document.getElementById('controlButtons').style.display = 'block';

    // Begin met woorden flitsen
    flashWord();
}

function flashWord() {
    if (usedWords.length >= wordCount || usedWords.length >= words.length) {
        showResults();
        return;
    }

    let word;
    do {
        word = words[Math.floor(Math.random() * words.length)];
    } while (usedWords.includes(word));

    usedWords.push(word);
    document.getElementById('wordDisplay').innerText = word;

    flashingTimeout = setTimeout(() => {
        document.getElementById('wordDisplay').innerText = '';
        flashingTimeout = setTimeout(flashWord, blankDisplayDuration);
    }, wordDisplayDuration);
}

function startReading() {
    // Haal de instellingen op
    wordDisplayDuration = parseInt(document.getElementById('readingSpeed').value);
    blankDisplayDuration = 500;
    wordCount = parseInt(document.getElementById('readingWordCount').value);

    // Reset de gebruikte woordenlijst en toon de resultatenknop niet
    usedWords = [];
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
    if (usedWords.length >= wordCount || usedWords.length >= words.length) {
        showResults();
        return;
    }

    let word;
    do {
        word = words[Math.floor(Math.random() * words.length)];
    } while (usedWords.includes(word));

    usedWords.push(word);
    document.getElementById('wordDisplay').innerText = word;

    flashingTimeout = setTimeout(() => {
        document.getElementById('wordDisplay').innerText = '';
        flashingTimeout = setTimeout(flashReadingWord, blankDisplayDuration);
    }, wordDisplayDuration);
}

function showResults() {
    const resultDisplay = document.getElementById('resultDisplay');
    resultDisplay.innerHTML = ''; // Clear previous results
    usedWords.forEach(word => {
        const wordElement = document.createElement('div');
        wordElement.innerText = word;
        resultDisplay.appendChild(wordElement);
    });
    document.getElementById('closeButton').style.display = 'inline';
    document.getElementById('returnButton').style.display = 'inline';
    document.getElementById('controlButtons').style.display = 'none';
}

function closeResults() {
    document.getElementById('resultDisplay').innerText = '';
    document.getElementById('closeButton').style.display = 'none';
    document.getElementById('returnButton').style.display = 'none';
    document.getElementById('controls').style.display = 'none';
    document.getElementById('readingControls').style.display = 'none';
    document.getElementById('subjectMenu').style.display = 'block';
}

function returnToMenu() {
    clearTimeout(flashingTimeout);
    document.getElementById('resultDisplay').innerText = '';
    document.getElementById('closeButton').style.display = 'none';
    document.getElementById('returnButton').style.display = 'none';
    document.getElementById('controlButtons').style.display = 'none';
    document.getElementById('wordDisplay').innerText = '';
    document.getElementById('subjectMenu').style.display = 'block';
    document.getElementById('controls').style.display = 'none';
    document.getElementById('readingControls').style.display = 'none';
}

function pauseFlashing() {
    if (flashingPaused) {
        flashingPaused = false;
        flashWord();
    } else {
        flashingPaused = true;
        clearTimeout(flashingTimeout);
    }
}

function stopFlashing() {
    clearTimeout(flashingTimeout);
    document.getElementById('wordDisplay').innerText = '';
    showResults();
}

function handleFileSelect(event) {
    const files = event.target.files;
    words = []; // Reset words array
    let filePromises = [];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        const filePromise = new Promise((resolve, reject) => {
            reader.onload = function(e) {
                const fileWords = e.target.result.split(/\r?\n/).filter(Boolean);
                resolve(fileWords);
            };
            reader.onerror = function() {
                reject(reader.error);
            };
            reader.readAsText(file);
        });
        filePromises.push(filePromise);
    }

    Promise.all(filePromises).then(fileWordsArrays => {
        words = fileWordsArrays.flat();
    }).catch(error => {
        console.error("Error reading files:", error);
    });
}
