// server.js
// SERVER-SIDE JAVASCRIPT


/////////////////////////////
//  SETUP and CONFIGURATION
/////////////////////////////

//require our models from index.js
var db = require('./models');

//require express in our app
var express = require('express'),
  bodyParser = require('body-parser');

// generate a new express app and call it 'app'
var app = express();

// serve static files in public
app.use(express.static('public'));

// body parser config to accept our datatypes
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());



////////////////////
//  DATA
///////////////////

// var books = [
//   {
//     _id: 15,
//     title: "The Four Hour Workweek",
//     author: "Tim Ferriss",
//     image: "https://s3-us-west-2.amazonaws.com/sandboxapi/four_hour_work_week.jpg",
//     release_date: "April 1, 2007"
//   },
//   {
//     _id: 16,
//     title: "Of Mice and Men",
//     author: "John Steinbeck",
//     image: "https://s3-us-west-2.amazonaws.com/sandboxapi/of_mice_and_men.jpg",
//     release_date: "Unknown 1937"
//   },
//   {
//     _id: 17,
//     title: "Romeo and Juliet",
//     author: "William Shakespeare",
//     image: "https://s3-us-west-2.amazonaws.com/sandboxapi/romeo_and_juliet.jpg",
//     release_date: "Unknown 1597"
//   }
// ];

////////////////////
//  ROUTES
///////////////////




// define a root route: localhost:3000/
app.get('/', function (req, res) {
  res.sendFile('views/index.html' , { root : __dirname});
});

// get all books
app.get('/api/books', function (req, res) {
  // send all books as JSON response
  db.Book.find(function(err, books) {
    //if error return log of that error
    if (err) { return console.log('index error: ' + err); }
    // if no error return the books from database to page as json
    res.json(books);
  });
});

// get one book
app.get('/api/books/:id', function (req, res) {
  // find one book by its id
  //if no errors find Book by id with findOne
  var book = db.Book.findOne({ _id: req.params.id }, function(err, book) {
    if (err) { return console.log('index error: ' + err); }
    res.json(book);
  });
});

// create new book
app.post('/api/books', function (req, res) {
  // create new book with form data (`req.body`)
  console.log('books create', req.body);
  var newBook = req.body;
  console.log(newBook);
  db.Book.create(newBook, function (err, book) {
    res.json(book);
  });
});

// update book
// app.put('/api/books/:id', controllers.books.update);

// delete book
app.delete('/api/books/:id', function (req, res) {
  // get book id from url params (`req.params`)
  console.log('books delete', req.params);
  db.Book.findOneAndRemove(req.params.id, function(err, book) {
    var response = {
        message: "Book successfully deleted",
        id: book._id
    };
    res.send(response);
  });
});





app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening at http://localhost:3000/');
});
