let flashingTimeoutSpelling;
let flashingTimeoutLezen;

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
        pakketElementSpelling.innerText = pakket;
        pakketElementSpelling.onclick = () => selectPakket(woorden, pakket, 'spelling');
        spellingSelectie.appendChild(pakketElementSpelling);

        let pakketElementLezen = document.createElement('div');
        pakketElementLezen.innerText = pakket;
        pakketElementLezen.onclick = () => selectPakket(woorden, pakket, 'lezen');
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
    const newPakketWordsInput = type === 'spelling' ? document.getElementById('newPakketWords') : document.getElementById('newPakketWordsLezen');
    const newPakketWords = newPakketWordsInput.value.split(',').map(word => word.trim());
    
    if (newPakketWords.length === 0 || newPakketWords[0] === '') {
        alert('Voer enkele woorden in.');
        return;
    }

    // Bepaal de hoogste bestaande pakketnummer en voeg 1 toe voor het nieuwe pakket
    const existingPakketten = Object.keys(woordpakketten).filter(p => p.startsWith('wp')).map(p => parseInt(p.substring(2)));
    const highestNumber = existingPakketten.length > 0 ? Math.max(...existingPakketten) : 0;
    const newPakketName = `wp${highestNumber + 1}`;
    
    woordpakketten[newPakketName] = newPakketWords;
    
    // Herlaad de pakketten om de nieuwe toe te voegen
    loadPakketten();
    
    // Maak het invoerveld leeg
    newPakketWordsInput.value = '';
}
