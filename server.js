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
  res.sendFile('views/index.html' , { root : __dirname });
});

// get all books
app.get('/api/books', function (req, res) {
  // send all books as JSON response
  db.Book.find()
    .populate('author')
    .exec(function(err, books){
      if (err) { return console.log("index error: " + err); }
      res.json(books);
    });
});

// get one book
app.get('/api/books/:id', function (req, res) {
  // find one book by its id
  db.Book.findById(req.params.id)
    .populate('author')
    .exec(function(err, book) {
      if (err) { return console.log("show error: " + err); }
      res.json(book);
    });
});

// create new book
app.post('/api/books', function (req, res) {
  // create new book with form data (`req.body`)
  var newBook = new db.Book({
    title: req.body.title,
    image: req.body.image,
    releaseDate: req.body.releaseDate,
  });

  // this code will only add an author to a book if the author already exists
  console.log("author :" + req.body.author);
  db.Author.findOne({name: req.body.author}, function(err, author){
    newBook.author = author;
    // add newBook to database
    newBook.save(function(err, book){
      if (err) {
        return console.log("create error: " + err);
      }
      console.log("created ", book.title);
      res.json(book);
    });
  });

});

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
