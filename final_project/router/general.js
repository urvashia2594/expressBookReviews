const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(username && password)
    {
        if (!isValid(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    else{
        res.status(400).json({"Message":"Unable to register User "});
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json({ books });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let findBook= null;

  for(const [key, book] of Object.entries(books))
  { 
    if(book.isbn === isbn)
    {
        findBook = book;
        break;
    }
  } 

  if(findBook)
  {
    return res.status(200).json({"book": findBook});
  }else{
    return res.status(404).json({"Message": "Book Not Found"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  
    const author = req.params.author;
    let findBook = [];
    for(const key of Object.keys(books))
    {
        if(books[key].author === author)
        {
           findBook.push(books[key]);
        }
    }

    if(findBook.length > 0)
    {
        return res.status(200).json(findBook);
    }
    return res.status(404).json({message: "Book not found"});
  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let findbook = [];
  for(const key of Object.keys(books))
  {
    if(books[key].title === title)
    {
        findbook.push(books[key]) ;
    }
  }

  if(findbook.length > 0)
  {
    return res.status(200).json(findbook);
  }
  return res.status(404).json({message: "Book not found"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  findbook = null;
  for(const key of Object.keys(books))
  {
    if(books[key].isbn === isbn)
    {
        findbook = books[key]; 
    }
  }

  if(!findbook)
  {
    return res.status(404).json({"message": "Book not found"})
  }
  return res.status(200).json(findbook.reviews)
});

module.exports.general = public_users;
