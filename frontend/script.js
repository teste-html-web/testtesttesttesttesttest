let allBooks = [];
let currentFilter = 'all';
let currentBook = null;

// Výchozí data
const defaultBooks = [
  {
    id: 1,
    title: "1984",
    author: "George Orwell",
    year: 1949,
    genre: "Sci-fi",
    total: 3,
    available: 2,
    description: "Dystopický román o totalitárním státu"
  },
  {
    id: 2,
    title: "Sto let samoty",
    author: "Gabriel García Márquez",
    year: 1967,
    genre: "Magický realismus",
    total: 2,
    available: 1,
    description: "Epická sága o rodině Buendía"
  },
  {
    id: 3,
    title: "Zločin a trest",
    author: "Fjodor Dostojevskij",
    year: 1866,
    genre: "Psychologický thriller",
    total: 4,
    available: 0,
    description: "Příběh o vině, trestu a vykoupení"
  },
  {
    id: 4,
    title: "Pýcha a předsudek",
    author: "Jane Austenová",
    year: 1813,
    genre: "Romantika",
    total: 3,
    available: 3,
    description: "Klasický romantický román"
  },
  {
    id: 5,
    title: "Hlava XXII",
    author: "Joseph Heller",
    year: 1961,
    genre: "Satira",
    total: 2,
    available: 1,
    description: "Antiválečná satira o absurdnosti"
  }
];

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const booksContainer = document.getElementById('booksContainer');
const noResults = document.getElementById('noResults');
const filterBtns = document.querySelectorAll('.filter-btn');
const modal = document.getElementById('bookModal');
const closeBtn = document.querySelector('.close');
const borrowBtn = document.getElementById('borrowBtn');
const returnBtn = document.getElementById('returnBtn');

// Event Listeners
searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentFilter = e.target.dataset.filter;
        renderBooks(filterBooks(allBooks));
    });
});

closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

borrowBtn.addEventListener('click', borrowBook);
returnBtn.addEventListener('click', returnBook);

// Správa localStorage
function loadFromStorage() {
    const stored = localStorage.getItem('knihovna_books');
    if (stored) {
        return JSON.parse(stored);
    }
    // Při prvním spuštění nastavit výchozí data
    localStorage.setItem('knihovna_books', JSON.stringify(defaultBooks));
    return defaultBooks;
}

function saveToStorage(books) {
    localStorage.setItem('knihovna_books', JSON.stringify(books));
}

// Funkce
function loadBooks() {
    allBooks = loadFromStorage();
    renderBooks(allBooks);
}

function handleSearch() {
    const query = searchInput.value.trim().toLowerCase();
    
    if (!query) {
        renderBooks(allBooks);
        return;
    }

    const results = allBooks.filter(book => 
        book.title.toLowerCase().includes(query) || 
        book.author.toLowerCase().includes(query)
    );
    
    renderBooks(filterBooks(results));
}

function filterBooks(books) {
    if (currentFilter === 'available') {
        return books.filter(book => book.available > 0);
    } else if (currentFilter === 'unavailable') {
        return books.filter(book => book.available === 0);
    }
    return books;
}

function renderBooks(books) {
    booksContainer.innerHTML = '';
    
    if (books.length === 0) {
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    
    books.forEach(book => {
        const card = createBookCard(book);
        booksContainer.appendChild(card);
    });
}

function createBookCard(book) {
    const card = document.createElement('div');
    card.className = 'book-card';
    
    const availabilityClass = book.available > 0 ? 'available' : 'unavailable';
    const availabilityText = book.available > 0 ? 'Dostupná' : 'Vypůjčená';
    
    card.innerHTML = `
        <div class="book-title">${book.title}</div>
        <div class="book-author">od ${book.author}</div>
        <span class="book-genre">${book.genre}</span>
        <div class="book-availability ${availabilityClass}">
            ${availabilityText}
            <div class="availability-count">${book.available}/${book.total} dostupných</div>
        </div>
    `;
    
    card.addEventListener('click', () => openModal(book));
    
    return card;
}

function openModal(book) {
    currentBook = book;
    const bookDetails = document.getElementById('bookDetails');
    
    const availabilityClass = book.available > 0 ? 'available' : 'unavailable';
    const availabilityText = book.available > 0 ? 'DOSTUPNÁ' : 'VYPŮJČENÁ';
    
    bookDetails.innerHTML = `
        <h2>${book.title}</h2>
        <div class="detail-row">
            <span class="detail-label">Autor:</span>
            <div class="detail-value">${book.author}</div>
        </div>
        <div class="detail-row">
            <span class="detail-label">Rok vydání:</span>
            <div class="detail-value">${book.year}</div>
        </div>
        <div class="detail-row">
            <span class="detail-label">Žánr:</span>
            <div class="detail-value">${book.genre}</div>
        </div>
        <div class="detail-row">
            <span class="detail-label">Popis:</span>
            <div class="detail-value">${book.description}</div>
        </div>
        <div class="detail-row">
            <span class="detail-label">Dostupnost:</span>
            <div class="detail-value book-availability ${availabilityClass}">
                ${availabilityText}<br/>
                <small>${book.available}/${book.total} dostupných</small>
            </div>
        </div>
    `;
    
    // Zobrazit/skrýt tlačítka
    borrowBtn.style.display = book.available > 0 ? 'block' : 'none';
    returnBtn.style.display = 'block';
    
    modal.style.display = 'block';
}

function closeModal() {
    modal.style.display = 'none';
    currentBook = null;
}

function borrowBook() {
    if (!currentBook) return;
    
    const book = allBooks.find(b => b.id === currentBook.id);
    
    if (!book) {
        showError('Kniha není nalezena');
        return;
    }
    
    if (book.available > 0) {
        book.available--;
        saveToStorage(allBooks);
        showSuccess(`Kniha "${currentBook.title}" byla zapůjčena!`);
        closeModal();
        loadBooks();
    } else {
        showError('Kniha není dostupná');
    }
}

function returnBook() {
    if (!currentBook) return;
    
    const book = allBooks.find(b => b.id === currentBook.id);
    
    if (!book) {
        showError('Kniha není nalezena');
        return;
    }
    
    book.available++;
    saveToStorage(allBooks);
    showSuccess(`Kniha "${currentBook.title}" byla vrácena!`);
    closeModal();
    loadBooks();
}

function showSuccess(message) {
    alert(message);
}

function showError(message) {
    alert('Chyba: ' + message);
}

// Inicializace
loadBooks();
