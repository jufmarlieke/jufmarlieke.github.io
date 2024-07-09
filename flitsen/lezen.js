document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('groupSelect').addEventListener('change', loadPakkettenLezen);
    loadPakkettenLezen();
});

function loadPakkettenLezen() {
    const group = document.getElementById('groupSelect').value;
    const lezenSelectie = document.getElementById('pakketSelectieLezen');
    
    lezenSelectie.innerHTML = '';
    
    if (!woordpakketten[group]) {
        return;
    }

    const pakketten = woordpakketten[group];

    for (const [pakket, woorden] of Object.entries(pakketten)) {
        let pakketElementLezen = document.createElement('div');
        pakketElementLezen.className = 'pakket-element';
        pakketElementLezen.innerHTML = `
            <div class="pakket-title">${pakket}</div>
            <div class="pakket-buttons">
                <button class="edit-button">Bewerken</button>
                <button class="delete-button">Verwijderen</button>
            </div>
        `;
        pakketElementLezen.querySelector('.pakket-title').onclick = () => selectPakketLezen(woorden, pakket);
        pakketElementLezen.querySelector('.edit-button').onclick = (e) => {
            e.stopPropagation();
            editPakketLezen(pakket, group);
        };
        pakketElementLezen.querySelector('.delete-button').onclick = (e) => {
            e.stopPropagation();
            deletePakketLezen(pakket, group);
        };
        lezenSelectie.appendChild(pakketElementLezen);
    }
}

function selectPakketLezen(woorden, pakket) {
    const group = document.getElementById('groupSelect').value;
    const index = selectedPakkettenLezen.indexOf(pakket);
    if (index === -1) {
        wordsLezen.push(...woorden);
        selectedPakkettenLezen.push(pakket);
    } else {
        wordsLezen = wordsLezen.filter(word => !woorden.includes(word));
        selectedPakkettenLezen.splice(index, 1);
    }
    document.getElementById('selectedPakketLezen').innerText = `Geselecteerde pakketten: ${selectedPakkettenLezen.join(', ')}`;
}

function editPakketLezen(pakket, group) {
    const newWords = prompt('Bewerk de woorden (gescheiden door komma\'s):', woordpakketten[group][pakket].join(', '));
    if (newWords !== null) {
        woordpakketten[group][pakket] = newWords.split(',').map(word => word.trim());
        localStorage.setItem('woordpakketten', JSON.stringify(woordpakketten));
        loadPakkettenLezen();
        alert(`Pakket "${pakket}" succesvol bewerkt.`);
    }
}

function deletePakketLezen(pakket, group) {
    if (confirm(`Weet je zeker dat je het pakket "${pakket}" wilt verwijderen?`)) {
        delete woordpakketten[group][pakket];
        localStorage.setItem('woordpakketten', JSON.stringify(woordpakketten));
        loadPakkettenLezen();
        alert(`Pakket "${pakket}" succesvol verwijderd.`);
    }
}
