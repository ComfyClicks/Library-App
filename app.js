// Generates a unique ID to be assigned to each book
function generateUniqueId() {
  return Math.floor(100 + Math.random() * 900).toString();
}

// Creates book objects
class Book {
  constructor(title, author, pages, read) {
    this.id = generateUniqueId();
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
  }
}

// Hard-coded books to populate library
const book1 = new Book("To Kill a Mockingbird", "Harper Lee", 281, true);
const book2 = new Book("1984", "George Orwell", 328, true);
const book3 = new Book("The Great Gatsby", "F. Scott Fitzgerald", 180, true);
const book4 = new Book("The Catcher in the Rye", "J.D. Salinger", 214, true);
const book5 = new Book("Moby-Dick", "Herman Melville", 635, true);
const book6 = new Book("Pride and Prejudice", "Jane Austen", 279, true);

// Hard-coded library
const myLibrary = [book1, book2, book3, book4, book5, book6];
console.log('My Library: ', myLibrary.map(book => book.title));

// Creates library cards for each book and displays on page
function createLibrary(books) {
  const library = document.getElementById('library');
  library.innerHTML = ''; // Clear existing content

  books.forEach((book, index) => {
    // Creates each library card
    const libraryCard = document.createElement('div');
    libraryCard.classList.add('library-card');
    libraryCard.setAttribute('data-id', book.id); 
    console.log(`${book.title}, id: ${libraryCard.getAttribute('data-id')}`);

    const bookTitle = document.createElement('h1');
    bookTitle.textContent = book.title;
    libraryCard.appendChild(bookTitle);

    const bookAuthor = document.createElement('p');
    bookAuthor.textContent = `Written by ${book.author}`;
    libraryCard.appendChild(bookAuthor);

    const bookPages = document.createElement('p');
    bookPages.textContent = `${book.pages} pages`;
    libraryCard.appendChild(bookPages);

    const cardButtons = document.createElement('div');
    cardButtons.classList.add('card-btns');

    // Adds read status button to library card
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

    // Adds delete button to library card
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-btn');
    cardButtons.appendChild(deleteButton);

    deleteButton.addEventListener('click', () => {
      const id = libraryCard.getAttribute('data-id');
      const bookIndex = myLibrary.findIndex(book => book.id === id);
      const removeDialog = document.querySelector('.remove-dialog');
      if (bookIndex !== -1) { //Check if book exists in the array
        removeDialog.showModal();

        // Handle the delete confirmation action
        const confirmRemoveBtn = document.querySelector('.confirm-remove-btn');
        confirmRemoveBtn.onclick = () => {
          const deletedBook = myLibrary.splice(bookIndex, 1)[0]; // Removes book from Library array
          libraryCard.remove(); // Removes library card from the DOM
          console.log(`${deletedBook.title} removed:`, deletedBook);
          console.log("Here's Your Updated Library:", myLibrary.map(book => book.title));
          removeDialog.close();
        };

        // Handle the cancel delete action
        const cancelRemoveBtn = document.querySelector('.cancel-remove-btn');
        cancelRemoveBtn.onclick = () => {
          removeDialog.close();
        };

        // Close the dialog if the user clicks outside of it
        window.addEventListener('click', (event) => {
          if (event.target === removeDialog) {
            removeDialog.close();
          }
        });
      }
    });

    library.appendChild(libraryCard);
    libraryCard.appendChild(cardButtons);
  })
}

// Adds new book to library
function addBookToLibrary() {
  const addBookBtn = document.getElementById('new-book-btn');
  const modal = document.querySelector('.modal');
  const closeBtn = document.querySelector('.close-btn');

  // Show the modal when the "Add New Book" button is clicked
  addBookBtn.addEventListener('click', () => {
    modal.showModal();
  });

  // Hide the modal when the close button is clicked
  closeBtn.addEventListener('click', () => {
    modal.close();
  });

  // Hide the modal when clicking outside of the modal
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.close();
    }
  });

  // Handle form submission
  const form = document.getElementById('new-book-form');
  form.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the browser from navigating to the link
    // Handle the link click with JavaScript and adds book to library array
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const pages = document.getElementById('pages').value;
    const read = document.getElementById('read-check').checked;

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
addBookToLibrary();