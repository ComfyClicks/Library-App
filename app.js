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
const book2 = new Book("1984", "George Orwell", 328, false);
const book3 = new Book("The Great Gatsby", "F. Scott Fitzgerald", 180, true);
const book4 = new Book("The Catcher in the Rye", "J.D. Salinger", 214, false);
const book5 = new Book("Moby-Dick", "Herman Melville", 635, true);
const book6 = new Book("Pride and Prejudice", "Jane Austen", 279, false);

const myLibrary = [book1, book2, book3, book4, book5, book6];
console.log('My Library: ', myLibrary.map(book => book.title));


function createLibrary(books) {
  const library = document.getElementById('library');

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

    libraryCard.appendChild(cardButtons);
    library.appendChild(libraryCard);
  })
}

createLibrary(myLibrary);