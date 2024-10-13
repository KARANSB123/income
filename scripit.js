// Select Elements
const totalIncomeEl = document.getElementById('total-income');
const totalExpensesEl = document.getElementById('total-expenses');
const netBalanceEl = document.getElementById('net-balance');
const descriptionEl = document.getElementById('description');
const amountEl = document.getElementById('amount');
const typeEl = document.getElementById('type');
const addEntryBtn = document.getElementById('add-entry');
const entriesEl = document.getElementById('entries');
const filterOptions = document.querySelectorAll('input[name="filter"]');

// Data storage
let entries = JSON.parse(localStorage.getItem('entries')) || [];

// Event Listeners
addEntryBtn.addEventListener('click', addEntry);
entriesEl.addEventListener('click', handleEntryAction);
filterOptions.forEach(option => option.addEventListener('change', filterEntries));

// Functions
function addEntry() {
    const description = descriptionEl.value.trim();
    const amount = parseFloat(amountEl.value.trim());
    const type = typeEl.value;

    if (!description || isNaN(amount) || amount <= 0) {
        alert('Please enter valid details');
        return;
    }

    const entry = { id: Date.now(), description, amount, type };
    entries.push(entry);
    updateLocalStorage();
    clearInputFields();
    displayEntries(entries);
    updateSummary();
}

function displayEntries(entriesToDisplay) {
    entriesEl.innerHTML = '';
    entriesToDisplay.forEach(entry => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${entry.description} - $${entry.amount} 
            <span>
                <span class="edit" data-id="${entry.id}">Edit</span> | 
                <span class="delete" data-id="${entry.id}">Delete</span>
            </span>
        `;
        entriesEl.appendChild(li);
    });
}

function handleEntryAction(e) {
    const id = e.target.dataset.id;
    if (e.target.classList.contains('delete')) {
        deleteEntry(id);
    } else if (e.target.classList.contains('edit')) {
        editEntry(id);
    }
}

function deleteEntry(id) {
    entries = entries.filter(entry => entry.id != id);
    updateLocalStorage();
    displayEntries(entries);
    updateSummary();
}

function editEntry(id) {
    const entry = entries.find(entry => entry.id == id);
    descriptionEl.value = entry.description;
    amountEl.value = entry.amount;
    typeEl.value = entry.type;
    deleteEntry(id);
}

function filterEntries() {
    const filterValue = document.querySelector('input[name="filter"]:checked').value;
    let filteredEntries;
    switch (filterValue) {
        case 'income':
            filteredEntries = entries.filter(entry => entry.type === 'income');
            break;
        case 'expense':
            filteredEntries = entries.filter(entry => entry.type === 'expense');
            break;
        default:
            filteredEntries = entries;
    }
    displayEntries(filteredEntries);
}

function updateSummary() {
    const income = entries.filter(entry => entry.type === 'income')
                          .reduce((sum, entry) => sum + entry.amount, 0);
    const expenses = entries.filter(entry => entry.type === 'expense')
                            .reduce((sum, entry) => sum + entry.amount, 0);
    const balance = income - expenses;

    totalIncomeEl.textContent = `$${income}`;
    totalExpensesEl.textContent = `$${expenses}`;
    netBalanceEl.textContent = `$${balance}`;
}

function updateLocalStorage() {
    localStorage.setItem('entries', JSON.stringify(entries));
}

function clearInputFields() {
    descriptionEl.value = '';
    amountEl.value = '';
}

// Initialize
displayEntries(entries);
updateSummary();
