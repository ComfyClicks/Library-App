const STORAGE_KEY = 'library-app-data';
const STORAGE_VERSION = 1;

const sampleBooks = [
  { title: 'To Kill a Mockingbird', author: 'Harper Lee', pages: 281, read: true },
  { title: '1984', author: 'George Orwell', pages: 328, read: true },
  { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', pages: 180, read: true },
  { title: 'The Catcher in the Rye', author: 'J.D. Salinger', pages: 214, read: true },
  { title: 'Moby-Dick', author: 'Herman Melville', pages: 635, read: true },
  { title: 'Pride and Prejudice', author: 'Jane Austen', pages: 279, read: true },
];

const library = document.querySelector('.book-list');
const emptyState = document.querySelector('.empty-state');
const addBookButton = document.querySelector('.new-book-btn');
const addBookDialog = document.querySelector('.modal');
const closeAddBookButton = document.querySelector('.close-btn');
const addBookForm = document.querySelector('.new-book-form');
const titleInput = document.querySelector('#title');
const authorInput = document.querySelector('#author');
const pagesInput = document.querySelector('#pages');
const readInput = document.querySelector('#read-check');
const removeDialog = document.querySelector('.remove-dialog');
const removeDescription = document.querySelector('#remove-dialog-description');
const confirmRemoveButton = document.querySelector('.confirm-remove-btn');
const cancelRemoveButton = document.querySelector('.cancel-remove-btn');
const statusAnnouncement = document.querySelector('#status-announcement');

class Book {
  constructor(title, author, pages, read, id = crypto.randomUUID()) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
  }
}

function createSampleLibrary() {
  return sampleBooks.map((book) => new Book(book.title, book.author, book.pages, book.read));
}

function isValidStoredBook(book) {
  return book !== null
    && typeof book === 'object'
    && typeof book.id === 'string'
    && book.id.length > 0
    && typeof book.title === 'string'
    && book.title.trim().length > 0
    && typeof book.author === 'string'
    && book.author.trim().length > 0
    && Number.isInteger(book.pages)
    && book.pages > 0
    && typeof book.read === 'boolean';
}

function loadLibrary() {
  let savedLibrary;

  try {
    savedLibrary = localStorage.getItem(STORAGE_KEY);
  } catch {
    return createSampleLibrary();
  }

  if (savedLibrary === null) {
    return createSampleLibrary();
  }

  try {
    const savedData = JSON.parse(savedLibrary);
    const ids = new Set();
    const hasValidShape = savedData !== null
      && typeof savedData === 'object'
      && savedData.version === STORAGE_VERSION
      && Array.isArray(savedData.books)
      && savedData.books.every((book) => {
        if (!isValidStoredBook(book) || ids.has(book.id)) {
          return false;
        }

        ids.add(book.id);
        return true;
      });

    if (!hasValidShape) {
      return [];
    }

    return savedData.books.map((book) => new Book(
      book.title.trim(),
      book.author.trim(),
      book.pages,
      book.read,
      book.id,
    ));
  } catch {
    return [];
  }
}

let myLibrary = loadLibrary();
let pendingDeleteId = null;
let removeDialogReturnTarget = null;

function saveLibrary() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      version: STORAGE_VERSION,
      books: myLibrary,
    }));
  } catch {
    // The app remains usable when storage is unavailable or full.
  }
}

function announce(message) {
  statusAnnouncement.textContent = '';
  requestAnimationFrame(() => {
    statusAnnouncement.textContent = message;
  });
}

function updateStatusButton(button, book) {
  const status = book.read ? 'Read' : 'Unread';
  const nextStatus = book.read ? 'unread' : 'read';

  button.textContent = status;
  button.classList.toggle('read', book.read);
  button.classList.toggle('unread', !book.read);
  button.setAttribute('aria-pressed', String(book.read));
  button.setAttribute('aria-label', `${status}: ${book.title}. Mark as ${nextStatus}`);
}

function createLibrary() {
  const fragment = document.createDocumentFragment();

  myLibrary.forEach((book, index) => {
    const libraryCard = document.createElement('article');
    const titleId = `book-title-${index}`;
    libraryCard.className = 'library-card';
    libraryCard.dataset.id = book.id;
    libraryCard.setAttribute('aria-labelledby', titleId);

    const bookTitle = document.createElement('h3');
    bookTitle.id = titleId;
    bookTitle.textContent = book.title;

    const bookAuthor = document.createElement('p');
    bookAuthor.textContent = `Written by ${book.author}`;

    const bookPages = document.createElement('p');
    bookPages.textContent = `${book.pages} pages`;

    const cardButtons = document.createElement('div');
    cardButtons.className = 'card-btns';

    const statusButton = document.createElement('button');
    statusButton.type = 'button';
    statusButton.className = 'status-btn';
    statusButton.dataset.action = 'toggle-read';
    updateStatusButton(statusButton, book);

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'delete-btn';
    deleteButton.dataset.action = 'delete';
    deleteButton.textContent = 'Delete';
    deleteButton.setAttribute('aria-label', `Delete ${book.title}`);

    cardButtons.append(statusButton, deleteButton);
    libraryCard.append(bookTitle, bookAuthor, bookPages, cardButtons);
    fragment.appendChild(libraryCard);
  });

  library.replaceChildren(fragment);
  emptyState.hidden = myLibrary.length !== 0;
}

function closeDialogFromBackdrop(event) {
  if (event.target === event.currentTarget) {
    event.currentTarget.close();
  }
}

library.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');

  if (!button) {
    return;
  }

  const card = button.closest('.library-card');
  const book = myLibrary.find((item) => item.id === card.dataset.id);

  if (!book) {
    return;
  }

  if (button.dataset.action === 'toggle-read') {
    book.read = !book.read;
    updateStatusButton(button, book);
    saveLibrary();
    announce(`Marked “${book.title}” as ${book.read ? 'read' : 'unread'}.`);
    return;
  }

  pendingDeleteId = book.id;
  removeDialogReturnTarget = button;
  removeDescription.textContent = `“${book.title}” will be removed from your library.`;
  removeDialog.showModal();
  cancelRemoveButton.focus();
});

addBookButton.addEventListener('click', () => {
  addBookDialog.showModal();
  titleInput.focus();
});

closeAddBookButton.addEventListener('click', () => {
  addBookDialog.close();
});

addBookDialog.addEventListener('click', closeDialogFromBackdrop);

addBookDialog.addEventListener('close', () => {
  addBookButton.focus();
});

[titleInput, authorInput, pagesInput].forEach((input) => {
  input.addEventListener('input', () => input.setCustomValidity(''));
});

addBookForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  const author = authorInput.value.trim();
  const pages = Number(pagesInput.value);

  titleInput.setCustomValidity(title ? '' : 'Enter a book title.');
  authorInput.setCustomValidity(author ? '' : 'Enter an author name.');
  pagesInput.setCustomValidity(
    Number.isInteger(pages) && pages > 0 ? '' : 'Enter a whole number greater than zero.',
  );

  if (!addBookForm.reportValidity()) {
    return;
  }

  const newBook = new Book(title, author, pages, readInput.checked);
  myLibrary.push(newBook);
  saveLibrary();
  createLibrary();
  addBookForm.reset();
  addBookDialog.close();
  announce(`Added “${newBook.title}” to your library.`);
});

confirmRemoveButton.addEventListener('click', () => {
  const bookIndex = myLibrary.findIndex((book) => book.id === pendingDeleteId);

  if (bookIndex === -1) {
    removeDialog.close();
    return;
  }

  const [deletedBook] = myLibrary.splice(bookIndex, 1);
  saveLibrary();
  createLibrary();

  const remainingCards = library.querySelectorAll('.library-card');
  const nextCard = remainingCards[Math.min(bookIndex, remainingCards.length - 1)];
  removeDialogReturnTarget = nextCard?.querySelector('.delete-btn') || addBookButton;

  removeDialog.close();
  announce(`Removed “${deletedBook.title}” from your library.`);
});

cancelRemoveButton.addEventListener('click', () => {
  removeDialog.close();
});

removeDialog.addEventListener('click', closeDialogFromBackdrop);

removeDialog.addEventListener('close', () => {
  const returnTarget = removeDialogReturnTarget?.isConnected
    ? removeDialogReturnTarget
    : addBookButton;

  pendingDeleteId = null;
  removeDialogReturnTarget = null;
  returnTarget.focus();
});

saveLibrary();
createLibrary();
