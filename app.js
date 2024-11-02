function generateUniqueId() {
  return Math.floor(100 + Math.random() * 900).toString();
}

class Book {
  constructor(title, author, pages, read) {
    this.id = generateUniqueId();
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
  }
}

function addBookToLibrary(book) {
  myLibrary.push(book);
}

const book1 = new Book("To Kill a Mockingbird", "Harper Lee", 281, true);
const book2 = new Book("1984", "George Orwell", 328, true);
const book3 = new Book("The Great Gatsby", "F. Scott Fitzgerald", 180, true);
const book4 = new Book("The Catcher in the Rye", "J.D. Salinger", 214, true);
const book5 = new Book("Moby-Dick", "Herman Melville", 635, true);
const book6 = new Book("Pride and Prejudice", "Jane Austen", 279, true);

const myLibrary = [book1, book2, book3, book4, book5, book6];
console.log('My Library: ', myLibrary.map(book => book.title));


function createLibrary(books) {
  const library = document.getElementById('library');
  library.innerHTML = ''; // Clear existing content

  books.forEach((book, index) => {
    const libraryCard = document.createElement('div');
    libraryCard.classList.add('library-card');
    libraryCard.setAttribute('data-id', book.id); 
    console.log(`${book.title}, id: ${libraryCard.getAttribute('data-id')}`);

    const bookTitle = document.createElement('h1');
    bookTitle.textContent = book.title;
    libraryCard.appendChild(bookTitle);

    const bookAuthor = document.createElement('p');
    bookAuthor.textContent = book.author;
    libraryCard.appendChild(bookAuthor);

    const bookPages = document.createElement('p');
    bookPages.textContent = `Pages: ${book.pages}`;
    libraryCard.appendChild(bookPages);

    const cardButtons = document.createElement('div');
    cardButtons.classList.add('card-btns');

    const statusButton = document.createElement('button');
    statusButton.textContent = book.read ? 'Read' : 'Unread';
    statusButton.classList.add(book.read ? 'read' : 'unread');
    cardButtons.appendChild(statusButton);

    statusButton.addEventListener('click', () => {
      const id = libraryCard.getAttribute('data-id');
      const bookIndex = myLibrary.findIndex(book => book.id === id);
      if (bookIndex !== -1) {
        const book = myLibrary[bookIndex];
        book.read = !book.read;
        statusButton.textContent = book.read ? 'Read' : 'Unread';
        statusButton.classList.toggle('read', book.read);
        statusButton.classList.toggle('unread', !book.read);
        console.log(`${book.title} updated to ${book.read ? 'read' : 'unread'}.`);
      }
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-btn');
    cardButtons.appendChild(deleteButton);

    deleteButton.addEventListener('click', () => {
      const id = libraryCard.getAttribute('data-id');
      const bookIndex = myLibrary.findIndex(book => book.id === id);
      if (bookIndex !== -1) {
        myLibrary.splice(bookIndex, 1);
        libraryCard.remove();
        console.log(`${book.title} removed.`, myLibrary.map(book => book.title));
      }
    });

    library.appendChild(libraryCard);
    libraryCard.appendChild(cardButtons);
  })
}


function addNewBook() {
  const addBookBtn = document.getElementById('new-book-btn');
  const modal = document.getElementById('modal');
  const closeBtn = document.querySelector('.close-btn');

  // Show the modal when the "Add New Book" button is clicked
  addBookBtn.addEventListener('click', () => {
    modal.style.display = 'block';
  });

  // Hide the modal when the close button is clicked
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Hide the modal when clicking outside of the modal
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Handle form submission
  const form = document.getElementById('new-book-form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const pages = document.getElementById('pages').value;
    const read = document.getElementById('read').checked;

    // Add new book to the library array
    const newBook = new Book(title, author, pages, read);
    myLibrary.push(newBook);
    
    // Re-render the library
    createLibrary(myLibrary);

    // Hide the modal
    modal.style.display = 'none';

    // Reset the form
    form.reset();
  })
}

createLibrary(myLibrary);
addNewBook();