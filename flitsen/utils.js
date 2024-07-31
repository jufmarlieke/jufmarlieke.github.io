// utils.js

export function updateSelectedPakketten(type, selectedPakketten) {
    document.getElementById(`selectedPakket${type}`).innerText = `Geselecteerde pakketten: ${selectedPakketten.join(', ')}`;
}

export function createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    children.forEach(child => element.appendChild(child));
    return element;
}

export function createPakketElement(pakket, woorden, type, group, onSelect, onEdit, onDelete) {
    const pakketElement = createElement('div', { class: 'pakket-element' }, [
        createElement('div', { class: 'pakket-title' }, [document.createTextNode(pakket)]),
        createElement('div', { class: 'pakket-buttons' }, [
            createElement('button', { class: 'edit-button' }, [document.createTextNode('Bewerken')]),
            createElement('button', { class: 'delete-button' }, [document.createTextNode('Verwijderen')])
        ])
    ]);

    pakketElement.querySelector('.pakket-title').onclick = () => onSelect(woorden, pakket);
    pakketElement.querySelector('.edit-button').onclick = (e) => {
        e.stopPropagation();
        onEdit(pakket, group);
    };
    pakketElement.querySelector('.delete-button').onclick = (e) => {
        e.stopPropagation();
        onDelete(pakket, group);
    };

    return pakketElement;
}