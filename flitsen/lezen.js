import { createElement, createPakketElement, updateSelectedPakketten } from './utils.js';

let wordsLezen = [];
let selectedPakkettenLezen = [];

function selectPakket(woorden, pakket, type) {
    const index = selectedPakkettenLezen.indexOf(pakket);
    if (index === -1) {
        wordsLezen.push(...woorden);
        selectedPakkettenLezen.push(pakket);
    } else {
        wordsLezen = wordsLezen.filter(word => !woorden.includes(word));
        selectedPakkettenLezen.splice(index, 1);
    }

    updateSelectedPakketten(type, selectedPakkettenLezen);
}

function editPakket(pakket, group, type) {
    const newWords = prompt('Bewerk de woorden (gescheiden door komma\'s):', woordpakketten[group][pakket].join(', '));
    if (newWords !== null) {
        woordpakketten[group][pakket] = newWords.split(',').map(word => word.trim());
        localStorage.setItem('woordpakketten', JSON.stringify(woordpakketten));
        loadPakketten(type);
        alert(`Pakket "${pakket}" succesvol bewerkt.`);
    }
}

function deletePakket(pakket, group, type) {
    if (confirm(`Weet je zeker dat je het pakket "${pakket}" wilt verwijderen?`)) {
        delete woordpakketten[group][pakket];
        localStorage.setItem('woordpakketten', JSON.stringify(woordpakketten));
        loadPakketten(type);
        alert(`Pakket "${pakket}" succesvol verwijderd.`);
    }
}

function loadPakketten(type) {
    const group = document.getElementById('groupSelect').value || 'groep4';
    const selectie = document.getElementById(`pakketSelectie${type}`);
    
    selectie.innerHTML = '';
    
    if (!woordpakketten[group]) return;

    const pakketten = woordpakketten[group];

    const fragment = document.createDocumentFragment();

    for (const [pakket, woorden] of Object.entries(pakketten)) {
        const pakketElement = createPakketElement(
            pakket, 
            woorden, 
            type, 
            group, 
            (woorden, pakket) => selectPakket(woorden, pakket, type),
            (pakket, group) => editPakket(pakket, group, type),
            (pakket, group) => deletePakket(pakket, group, type)
        );
        fragment.appendChild(pakketElement);
    }

    selectie.appendChild(fragment);
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('groupSelect').addEventListener('change', () => loadPakketten('Lezen'));
    loadPakketten('Lezen');
});

export { loadPakketten };
