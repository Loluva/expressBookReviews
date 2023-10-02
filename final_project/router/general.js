const express = require('express');
const axios=require('axios')
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  let username=req.body.username
  let password=req.body.password
  if(!(username&&password))
  return res.status(404).send("username or password missing")

  if(!isValid(username))
  return res.status(403).send("username is alrady used")

  users.push({"username":username,"password":password})
  console.log(JSON.stringify(users,null,4))
  return res.status(200).send("user "+username+" created")
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books,null, 4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn=req.params.isbn
  let book=books[isbn]
  if(book){
    return res.status(200).send(JSON.stringify(book,null,4))
  }
  return res.status(404).send("invalid parameter")

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author=req.params.author
  let filteredBooks=Object.values(books).filter(book=>book.author==author)
  if(filteredBooks.length>0){
    return res.status(200).send(JSON.stringify(filteredBooks,null,4))
  } 
  return res.status(404).send("invalid parameter")
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title=req.params.title
    let filteredBooks=Object.values(books).filter(book=>book.title==title)
    if(filteredBooks.length>0){
      return res.status(200).send(JSON.stringify(filteredBooks,null,4))
    } 
    return res.status(404).send("invalid parameter")
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn=req.params.isbn
  let book=books[isbn]
  console.log(book)
  if(book){
    return res.status(200).send(JSON.stringify(book.reviews,null,4))
  }
  return res.status(404).send("invalid parameter")
});


const getBooks=async ()=>{
let url="https://calaa-5000.theiadocker-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/"
let req=await axios.get(url)
let data=req.data
console.log(data)
}
const getBookByIsbn=async ()=>{
    let isbn="5"
    let url="https://calaa-5000.theiadocker-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/isbn/"+isbn
    let req=await axios.get(url)
    let data=req.data
    console.log(data)
}
const getBookByAuthor=async ()=>{
    let author="Unknown"
    let url="https://calaa-5000.theiadocker-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/author/"+author
    let req=await axios.get(url)
    let data=req.data
    console.log(data)
}
const getBookByTitle=async ()=>{
    let title="Fairy tales"
    let url="https://calaa-5000.theiadocker-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/title/"+title
    let req=await axios.get(url)
    let data=req.data
    console.log(data)
}


module.exports.general = public_users;
