// Initial array of quotes
let quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "The purpose of our lives is to be happy.", category: "Happiness" },
    { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
];

// Function to show a random quote
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    document.getElementById('quoteDisplay').innerText = `${quote.text} - ${quote.category}`;
}

// Function to add a new quote
function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;

    if (newQuoteText && newQuoteCategory) {
        quotes.push({ text: newQuoteText, category: newQuoteCategory });
        alert('Quote added successfully!');
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
    } else {
        alert('Please enter both quote text and category.');
    }
}

// Add event listener to the Show New Quote button
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
// Function to load quotes from local storage
function loadQuotes() {
    const savedQuotes = localStorage.getItem('quotes');
    if (savedQuotes) {
        quotes = JSON.parse(savedQuotes);
    }
}

// Function to save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Modify addQuote function to save quotes to local storage
function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;

    if (newQuoteText && newQuoteCategory) {
        quotes.push({ text: newQuoteText, category: newQuoteCategory });
        saveQuotes();
        alert('Quote added successfully!');
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
    } else {
        alert('Please enter both quote text and category.');
    }
}

// Function to import quotes from JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function (event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}

// Function to export quotes to JSON file
function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = 'quotes.json';
    downloadLink.click();
}

// Add event listeners
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('importFile').addEventListener('change', importFromJsonFile);

// Load quotes on page load
window.onload = loadQuotes;
// Function to populate categories in the dropdown
function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    const categories = [...new Set(quotes.map(quote => quote.category))];
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.text = category;
        categoryFilter.appendChild(option);
    });
}

// Function to filter quotes by selected category
function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = '';
    filteredQuotes.forEach(quote => {
        const quoteElement = document.createElement('div');
        quoteElement.innerText = `${quote.text} - ${quote.category}`;
        quoteDisplay.appendChild(quoteElement);
    });
}

// Update addQuote function to populate categories dropdown
function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;

    if (newQuoteText && newQuoteCategory) {
        quotes.push({ text: newQuoteText, category: newQuoteCategory });
        saveQuotes();
        populateCategories();
        alert('Quote added successfully!');
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
    } else {
        alert('Please enter both quote text and category.');
    }
}

// Load quotes and populate categories on page load
window.onload = function () {
    loadQuotes();
    populateCategories();
    filterQuotes();
};
// Mock server URL
const serverUrl = 'https://jsonplaceholder.typicode.com/posts';

// Function to fetch quotes from the server
async function fetchQuotesFromServer() {
    try {
        const response = await fetch(serverUrl);
        const serverQuotes = await response.json();
        // Simulate server quotes structure
        serverQuotes.forEach(quote => {
            quotes.push({ text: quote.title, category: "Server" });
        });
        saveQuotes();
        populateCategories();
        filterQuotes();
    } catch (error) {
        console.error('Error fetching quotes from server:', error);
    }
}

// Function to sync quotes with the server
async function syncQuotesWithServer() {
    try {
        const response = await fetch(serverUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(quotes),
        });
        const serverResponse = await response.json();
        console.log('Quotes synced with server:', serverResponse);
    } catch (error) {
        console.error('Error syncing quotes with server:', error);
    }
}

// Add periodic sync with server
setInterval(syncQuotesWithServer, 60000); // Sync every minute

// Fetch quotes from the server on page load
window.onload = function () {
    loadQuotes();
    populateCategories();
    filterQuotes();
    fetchQuotesFromServer();
};