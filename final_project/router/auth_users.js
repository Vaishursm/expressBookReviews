const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{"username":"user1", "password":"password1"}];

const isValid = (username)=>{ //returns boolean
  filtereduser = users.filter((user) =>  user.username === username)
  return filtereduser.length > 0
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
 const validateUser = users.filter((user) => user.username === username && user.password === password)
 return validateUser.length > 0
}

//only registered users can login
regd_users.post("/login", (req,res, next) => {
  const username = req.body.username
  const password =  req.body.password
  if(!username || !password){
    res.status(400).json({message: "Enter the username and password for login"})
  }
  else{
    if(authenticatedUser(username, password)){
      const accessToken = jwt.sign({data: password },'secretkey', {expiresIn : 60*60})
      req.session.authorization = {
        accessToken, username
      }
      res.status(200).json({message: "User logged in successfully"})
      next();
    }
    else{
      res.status(401).json({message: "Invalid username or password"})
    }
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res, next) => {
  const isbn = req.params.isbn
  const review = req.query.review
  const username = req.session.authorization["username"]
  if(review){
    const book = books[isbn]
    book.reviews[username] = {"review" : review}
    res.status(200).json({message : "Book review updated successfully"})
  }
  else{
    res.status(400).json({message: "No review found"})
  }
});

regd_users.delete("/auth/review/:isbn", (req, res, next) => {
  const isbn = req.params.isbn
  const review = req.query.review
  const username = req.session.authorization["username"]
  if(review){
    const book = books[isbn]
    delete book.reviews[username]
    res.status(200).json({message : `Book review deleted for ${username}`})
  }
  else{
    res.status(400).json({message: "No review found"})
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
