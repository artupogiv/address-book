let contacts = [];

let sortState = {
    column: null,
    order: null,
    clickCount: 0
};
let searchQuery = ''; // Search query state

// DOM Elements
const modal = document.getElementById('modal');
const openModalButton = document.getElementById('openModal');
const closeModalButton = document.getElementById('closeModal');
const contactList = document.getElementById('contactList');
const contactForm = document.getElementById('contactForm');
const modalTitle = document.getElementById('modalTitle');
const searchBox = document.getElementById('searchBox');

// Initialize contacts from local storage on load
window.addEventListener('load', () => {
    loadContactsFromLocalStorage();
    renderContacts();
});

// Open Modal
openModalButton.addEventListener('click', () => {
    openFormModal();
});

// Close Modal
closeModalButton.addEventListener('click', () => {
    closeFormModal();
});

// Search Box Input Event
searchBox.addEventListener('input', (event) => {
    searchQuery = event.target.value.toLowerCase();
    renderContacts();
});

// Submit Form
contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const index = document.getElementById('contactIndex').value;
    const contact = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value
    };

    if (index === '') {
        addContact(contact);
    } else {
        updateContact(index, contact);
    }
    closeFormModal();
    saveContactsToLocalStorage();
});

// Sorting by Column Headers
document.querySelectorAll('th.sortable').forEach(header => {
    header.addEventListener('click', () => {
        const key = header.getAttribute('data-key');
        sortContacts(key);
    });
});

function openFormModal(contact = null, index = '') {
    if (contact) {
        document.getElementById('name').value = contact.name;
        document.getElementById('email').value = contact.email;
        document.getElementById('phone').value = contact.phone;
        document.getElementById('address').value = contact.address;
        document.getElementById('contactIndex').value = index;
        modalTitle.textContent = 'Edit Contact';
    } else {
        contactForm.reset();
        document.getElementById('contactIndex').value = '';
        modalTitle.textContent = 'Add New Contact';
    }
    modal.classList.remove('hidden');
}

function closeFormModal() {
    modal.classList.add('hidden');
    contactForm.reset();
}

function addContact(contact) {
    contacts.push(contact);
    renderContacts();
    saveContactsToLocalStorage();
}

function updateContact(index, contact) {
    contacts[index] = contact;
    renderContacts();
    saveContactsToLocalStorage();
}

function deleteContact(index) {
    contacts.splice(index, 1);
    renderContacts();
    saveContactsToLocalStorage();
}

// Sort contacts by a given key (column) and cycle through three states
function sortContacts(key) {
    if (sortState.column === key) {
        sortState.clickCount++;
    } else {
        sortState.column = key;
        sortState.clickCount = 1;
    }

    if (sortState.clickCount === 1) {
        // Ascending
        sortState.order = 'asc';
        contacts.sort((a, b) => (a[key] > b[key] ? 1 : -1));
    } else if (sortState.clickCount === 2) {
        // Descending
        sortState.order = 'desc';
        contacts.sort((a, b) => (a[key] < b[key] ? 1 : -1));
    } else {
        // Original order
        sortState.order = null;
        sortState.clickCount = 0;  // Reset click count
        contacts = contacts.map((contact, index) => ({ ...contact, index })).sort((a, b) => a.index - b.index);
    }

    renderContacts();
}

// Render contacts to the table, with search and sorting
function renderContacts() {
    // Filter contacts based on search query
    const filteredContacts = contacts.filter(contact => {
        return (
            contact.name.toLowerCase().includes(searchQuery) ||
            contact.email.toLowerCase().includes(searchQuery) ||
            contact.phone.toLowerCase().includes(searchQuery) ||
            contact.address.toLowerCase().includes(searchQuery)
        );
    });

    contactList.innerHTML = '';
    filteredContacts.forEach((contact, index) => {
        const row = document.createElement('tr');
        row.classList.add('border-b');
        row.innerHTML = `
            <td class="px-4 py-2">${contact.name}</td>
            <td class="px-4 py-2">${contact.email}</td>
            <td class="px-4 py-2">${contact.phone}</td>
            <td class="px-4 py-2">${contact.address}</td>
            <td class="px-4 py-2 text-center">
                <button class="text-blue-500 mr-2" onclick="openFormModal(contacts[${index}], ${index})">Edit</button>
                <button class="text-red-500" onclick="deleteContact(${index})">Delete</button>
            </td>
        `;
        contactList.appendChild(row);
    });
}

// Save contacts to local storage
function saveContactsToLocalStorage() {
    localStorage.setItem('contacts', JSON.stringify(contacts));
}

// Load contacts from local storage
function loadContactsFromLocalStorage() {
    const storedContacts = localStorage.getItem('contacts');
    if (storedContacts) {
        contacts = JSON.parse(storedContacts);
    }
}

// Initial render
renderContacts();