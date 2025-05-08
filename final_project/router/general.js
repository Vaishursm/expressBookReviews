const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

let getbooks = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(books);
  }, 6000);
});

// Get book by ISBN (as a Promise)
let getbooksbyisbn = (isbn) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject("Book not found");
      }
    }, 3000); // Optional: different delay
  });
};

// Get books by author (as a Promise)
let getbooksbyauthor = (author) => {
  return new Promise((resolve, reject) => {
    const result = Object.values(books).filter((book) => book.author === author);
    if (result.length > 0) resolve(result);
    else reject("Author not found");
  });
};

// Get books by title (as a Promise)
let getbooksbytitle = (title) => {
  return new Promise((resolve, reject) => {
    const result = Object.values(books).filter((book) => book.title === title);
    if (result.length > 0) resolve(result);
    else reject("Title not found");
  });
};

public_users.post("/register", (req,res) => {
  const username = req.body.username
  const password =  req.body.password
  if(!username || !password){
    res.status(400).json({message : "Enter the username and password"})
  }
  else{
    if(isValid(username)){
      res.status(409).json({message: "User already exists"})
    }
    else{
      users.push({
        "username" : username,
        "password": password
      })
      res.status(200).json({message: "User registered successfully"}) 
    }
  }
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  try{
    const booklist = await getbooks 
    return res.status(200).json(booklist);
  }
  catch(err){
    return res.status(500).json({Error: err})
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  const isbn = req.params.isbn
  try{
    const book = await getbooksbyisbn(isbn) 
    return res.status(200).json(book);
  }
  catch(err){
    return res.status(500).json({Error: err})
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  const author = req.params.author
  try{
    const book = await getbooksbyauthor(author) 
    return res.status(200).json(book);
  }
  catch(err){
    return res.status(500).json({Error: err})
  }
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  const title = req.params.title
  try{
    const book = await getbooksbytitle(title) 
    return res.status(200).json(book);
  }
  catch(err){
    return res.status(500).json({Error: err})
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let filteredbook = books[req.params.isbn]
  return res.status(200).json(filteredbook.reviews);
});

module.exports.general = public_users;
