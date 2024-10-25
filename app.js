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
    console.log(`Book: ${book.title}, id: ${libraryCard.getAttribute('data-id')}`);

    const bookTitle = document.createElement('h1');
    bookTitle.textContent = book.title;
    libraryCard.appendChild(bookTitle);

    const bookAuthor = document.createElement('p');
    bookAuthor.textContent = book.author;
    libraryCard.appendChild(bookAuthor);

    const bookPages = document.createElement('p');
    bookPages.textContent = book.pages;
    libraryCard.appendChild(bookPages);

    const bookStatus = document.createElement('p');
    bookStatus.textContent = `Read: ${book.read ? 'Yes' : 'No'}`;
    libraryCard.appendChild(bookStatus);

    const statusButton = document.createElement('button');
    statusButton.textContent = `${book.read ? 'Mark as unread' : 'Mark as read'}`;
    libraryCard.appendChild(statusButton);

    statusButton.addEventListener('click', () => {
      const id = libraryCard.getAttribute('data-id');
      const bookIndex = myLibrary.findIndex(book => book.id === id);
      if (bookIndex !== -1) {
        const book = myLibrary[bookIndex];
        book.read = !book.read;
        bookStatus.textContent = `Read: ${book.read ? 'Yes' : 'No'}`;
        statusButton.textContent = book.read ? 'Mark as unread' : 'Mark as read';
        console.log(`${book.title} updated to ${book.read ? 'read' : 'unread'}.`);
      }
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Remove Book';
    libraryCard.appendChild(deleteButton);

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
  })
}

createLibrary(myLibrary);