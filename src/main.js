import { books, connections } from './data.js';
import { initStars } from './stars.js';
import { initGraph } from './graph.js';
import { initPanel, openPanel, closePanel } from './panel.js';

// Initialize background stars
initStars(document.getElementById('star-canvas'));

// Initialize side panel
initPanel();

// Navigation callback holder
let navigateToBook = null;

// Filter panel elements
const filterPanel = document.getElementById('filter-panel');
const filterToggle = document.getElementById('filter-toggle');
const filterBody = document.getElementById('filter-body');
const filterAuthorsEl = document.getElementById('filter-authors');
const filterGenresEl = document.getElementById('filter-genres');
const filterRatingEl = document.getElementById('filter-rating');
const filterYearEl = document.getElementById('filter-year');
const filterResetBtn = document.getElementById('filter-reset');
const filterClearBtn = document.getElementById('filter-clear');

// Derive filter options from data
const authors = [...new Set(books.map(b => b.author))].sort();
const genres = [...new Set(books.map(b => b.genre))].sort();

// Filter state
const filterState = {
  authors: new Set(),
  genres: new Set(),
  rating: 'all',   // 'all', '3', '4'
  year: 'all',      // 'all' or a year string like '2020'
};

// Initialize the D3 graph
const graph = initGraph(document.getElementById('graph-svg'), books, connections, {
  onNodeSelect: (book, nodeConnections) => {
    filterPanel.classList.add('hidden');
    openPanel(book, nodeConnections, (otherBook) => {
      if (navigateToBook) navigateToBook(otherBook);
    });
  },
  onNodeDeselect: () => {
    filterPanel.classList.remove('hidden');
    closePanel();
    applyFilters();
  },
  onNodeNavigate: (fn) => {
    navigateToBook = fn;
  },
});

// === Populate filter pills ===

authors.forEach(author => {
  const btn = document.createElement('button');
  btn.className = 'filter-pill';
  btn.textContent = author;
  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
    if (filterState.authors.has(author)) {
      filterState.authors.delete(author);
    } else {
      filterState.authors.add(author);
    }
    filterBody.classList.remove('open');
    applyFilters();
  });
  filterAuthorsEl.appendChild(btn);
});

genres.forEach(genre => {
  const btn = document.createElement('button');
  btn.className = 'filter-pill';
  btn.textContent = genre.replace(/\b\w/g, c => c.toUpperCase());
  btn.dataset.genre = genre;
  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
    if (filterState.genres.has(genre)) {
      filterState.genres.delete(genre);
    } else {
      filterState.genres.add(genre);
    }
    filterBody.classList.remove('open');
    applyFilters();
  });
  filterGenresEl.appendChild(btn);
});

// === Dropdown inputs ===

filterRatingEl.addEventListener('change', () => {
  filterState.rating = filterRatingEl.value;
  filterBody.classList.remove('open');
  applyFilters();
});

filterYearEl.addEventListener('change', () => {
  filterState.year = filterYearEl.value;
  filterBody.classList.remove('open');
  applyFilters();
});

// === Reset ===

filterResetBtn.addEventListener('click', () => {
  filterState.authors.clear();
  filterState.genres.clear();
  filterState.rating = 'all';
  filterState.year = 'all';
  filterRatingEl.value = 'all';
  filterYearEl.value = 'all';
  filterAuthorsEl.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
  filterGenresEl.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
  filterBody.classList.remove('open');
  applyFilters();
});

// === Toggle filter body ===

filterToggle.addEventListener('click', () => {
  filterBody.classList.toggle('open');
});

// Prevent filter panel clicks from deselecting nodes
filterPanel.addEventListener('click', (e) => e.stopPropagation());

// === Filter clear (X) button ===

filterClearBtn.addEventListener('click', () => {
  filterState.authors.clear();
  filterState.genres.clear();
  filterState.rating = 'all';
  filterState.year = 'all';
  filterRatingEl.value = 'all';
  filterYearEl.value = 'all';
  filterAuthorsEl.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
  filterGenresEl.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
  applyFilters();
});

function updateFilterClearButton() {
  const hasFilters = filterState.authors.size > 0 ||
    filterState.genres.size > 0 ||
    filterState.rating !== 'all' ||
    filterState.year !== 'all';
  filterClearBtn.classList.toggle('visible', hasFilters);
}

// === Apply filters ===

function applyFilters() {
  updateFilterClearButton();
  const matchingIds = new Set();
  books.forEach(b => {
    const authorMatch = filterState.authors.size === 0 || filterState.authors.has(b.author);
    const genreMatch = filterState.genres.size === 0 || filterState.genres.has(b.genre);
    const ratingMatch = filterState.rating === 'all' || Math.floor(b.rating) === parseInt(filterState.rating);
    const yearMatch = filterState.year === 'all' || b.year === parseInt(filterState.year);
    if (authorMatch && genreMatch && ratingMatch && yearMatch) {
      matchingIds.add(b.id);
    }
  });
  graph.applyFilter(matchingIds);
}
