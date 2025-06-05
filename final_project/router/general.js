const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const public_users = express.Router();

// Middleware para verificar token JWT
function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Authorization header missing" });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, "access_secret_key", (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = decoded;
    next();
  });
}

// Task 10: Get all books using async callback function
public_users.get('/async/books', async (req, res) => {
  const getAllBooks = () => {
    return new Promise((resolve) => {
      resolve(books);
    });
  };

  try {
    const allBooks = await getAllBooks();
    res.json(allBooks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching books" });
  }
});

// Task 11: Search by ISBN using Promises
public_users.get('/promise/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  const getBookByISBN = (isbn) => {
    return new Promise((resolve, reject) => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject("Book not found");
      }
    });
  };

  getBookByISBN(isbn)
    .then(book => res.json(book))
    .catch(err => res.status(404).json({ message: err }));
});

// Task 12: Search by author using Promises
public_users.get('/promise/author/:author', (req, res) => {
  const author = req.params.author.toLowerCase();

  const getBooksByAuthor = (author) => {
    return new Promise((resolve, reject) => {
      const filteredBooks = Object.values(books).filter(book => book.author.toLowerCase() === author);
      if (filteredBooks.length > 0) {
        resolve(filteredBooks);
      } else {
        reject("No books found by this author");
      }
    });
  };

  getBooksByAuthor(author)
    .then(books => res.json(books))
    .catch(err => res.status(404).json({ message: err }));
});

// Task 13: Search by title using Promises
public_users.get('/promise/title/:title', (req, res) => {
  const title = req.params.title.toLowerCase();

  const getBooksByTitle = (title) => {
    return new Promise((resolve, reject) => {
      const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase() === title);
      if (filteredBooks.length > 0) {
        resolve(filteredBooks);
      } else {
        reject("No books found with this title");
      }
    });
  };

  getBooksByTitle(title)
    .then(books => res.json(books))
    .catch(err => res.status(404).json({ message: err }));
});

module.exports.general = public_users;
