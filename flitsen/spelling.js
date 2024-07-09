document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('groupSelect').addEventListener('change', loadPakkettenSpelling);
    loadPakkettenSpelling();
});

function loadPakkettenSpelling() {
    const group = document.getElementById('groupSelect').value;
    const spellingSelectie = document.getElementById('pakketSelectieSpelling');
    
    spellingSelectie.innerHTML = '';
    
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
        pakketElementSpelling.querySelector('.pakket-title').onclick = () => selectPakketSpelling(woorden, pakket);
        pakketElementSpelling.querySelector('.edit-button').onclick = (e) => {
            e.stopPropagation();
            editPakketSpelling(pakket, group);
        };
        pakketElementSpelling.querySelector('.delete-button').onclick = (e) => {
            e.stopPropagation();
            deletePakketSpelling(pakket, group);
        };
        spellingSelectie.appendChild(pakketElementSpelling);
    }
}

function selectPakketSpelling(woorden, pakket) {
    const group = document.getElementById('groupSelect').value;
    const index = selectedPakkettenSpelling.indexOf(pakket);
    if (index === -1) {
        wordsSpelling.push(...woorden);
        selectedPakkettenSpelling.push(pakket);
    } else {
        wordsSpelling = wordsSpelling.filter(word => !woorden.includes(word));
        selectedPakkettenSpelling.splice(index, 1);
    }
    document.getElementById('selectedPakketSpelling').innerText = `Geselecteerde pakketten: ${selectedPakkettenSpelling.join(', ')}`;
}

function editPakketSpelling(pakket, group) {
    const newWords = prompt('Bewerk de woorden (gescheiden door komma\'s):', woordpakketten[group][pakket].join(', '));
    if (newWords !== null) {
        woordpakketten[group][pakket] = newWords.split(',').map(word => word.trim());
        localStorage.setItem('woordpakketten', JSON.stringify(woordpakketten));
        loadPakkettenSpelling();
        alert(`Pakket "${pakket}" succesvol bewerkt.`);
    }
}

function deletePakketSpelling(pakket, group) {
    if (confirm(`Weet je zeker dat je het pakket "${pakket}" wilt verwijderen?`)) {
        delete woordpakketten[group][pakket];
        localStorage.setItem('woordpakketten', JSON.stringify(woordpakketten));
        loadPakkettenSpelling();
        alert(`Pakket "${pakket}" succesvol verwijderd.`);
    }
}
