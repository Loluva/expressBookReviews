const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
let userswithsamename=users.filter(user=>user.username==username)
if(userswithsamename.length>0){
  return false
}else{
    return true
}
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
console.log(users)    
let authenticatedUser=users.filter(user=>{
        return (user.username == username && user.password == password)
    })
    if(authenticatedUser.length>0){
        return true
    }else{
        return false
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  let username=req.query.username
  let password=req.query.password

  if(!(username&&password))
  return res.status(404).send("username or password missing")

  if(authenticatedUser(username,password)){
    let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
  }else{
  return res.status(403).send("User is not resgistered")
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let username=req.session.authorization.username
  let isbn=req.params.isbn
  let review=req.query.review

  let book=books[isbn]
  let reviews=book.reviews
  reviews[username]=review
  books[isbn].reviews=reviews

  return res.status(200).send(JSON.stringify(books[isbn],null,4));
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
    let username=req.session.authorization.username
    let isbn=req.params.isbn
  
    let book=books[isbn]
    let reviews=book.reviews
    delete reviews[username]
    books[isbn].reviews=reviews
  
    return res.status(200).send(JSON.stringify(books[isbn],null,4));
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
