const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{
    let userExist = users.find((user) => {
        return user.username === username && user.password === password;
    });

    if (userExist) {
        return true;
    } else {
        return false;
    }
}

const bookExistByIsbn = (isbn)=>{
    let bookExist = null;

    //chgeck book exist or not for given isbn
    for(const key of Object.keys(books))
    {
        if(books[key].isbn === isbn)
        {
            bookExist = books[key];
            break;

        }
    }

    return bookExist;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(!username || !password)
    {
        return res.status(400).json({message: "Unable to login"});
    }

    if(authenticatedUser(username,password))
    {   
        accesstoken = jwt.sign({data:password},'access',{expiresIn:60*60});
        req.session.authorization = {
            accesstoken, username
        };
        return res.status(200).json({message: "User successfully loged in"});

    }else{
        return res.status(404).json({message: "User not found"});

    }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const newReview = req.body.review;
    
    //get logged in username from session
    const authUser = req.session.authorization['username'];

    const bookExist = bookExistByIsbn(isbn);
    if(!bookExist)
    {
        return res.status(404).json({message: "Book not found"});

    }else{
        if(bookExist.reviews.hasOwnProperty(authUser))
        {
            bookExist.reviews[authUser] = newReview;
            return res.status(200).json({data:bookExist,message: "Review Modified"});

        }else{
            bookExist.reviews[authUser] = newReview;
            return res.status(200).json({data:bookExist,message: "Review Added"});
        }
       
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
   
    //get logged in username from session
    const authUser = req.session.authorization['username'];

    const bookExist = bookExistByIsbn(isbn);
    if(!bookExist)
    {
        return res.status(404).json({message: "Book not found"});

    }else{
        if(bookExist.reviews.hasOwnProperty(authUser))
        {
            delete bookExist.reviews[authUser];
            return res.status(200).json({data:bookExist,message: "Review Deleted"});

        }else{
            return res.status(404).json({data:bookExist,message: "Review not found"});
        }
       
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
