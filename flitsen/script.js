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
