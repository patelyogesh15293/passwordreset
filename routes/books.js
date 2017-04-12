
// express setup
let express = require('express');
let router = express.Router();

// link to the book model for CRUD operations
let Book = require('../models/book');

// auth check
function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next(); // user is logged, so call the next function
    }
    res.redirect('/'); // not logged in so redirect tooo home
}

/* GET books main page */
router.get('/', function(req, res, next) {

   // use mongoose model to query mongodb for all books
   Book.find(function(err, books) {
      if (err) {
         console.log(err);
         res.end(err);
         return;
      }

      // no error so send the books to the index view
      res.render('books/index', {
         books: books,
          title: "Books List",
          user: req.user
      });
   });
});

// Get handler for add book
router.get('/add', isLoggedIn, function(req, res, neext){
    // show the add form
    res.render('books/add', {
        title: "Book's Details",
        user: req.user
    });
});

// POST books
router.post('/add', isLoggedIn, function(req, res, next){

    Book.create({
        title: req.body.title,
        author: req.body.author,
        price: req.body.price,
        year: req.body.year
    }, function(err, book){
            if(err){
                console.log(err);
                res.render('error');
                return;
            }
            res.redirect('/books');
        }
    );

});

// Get /book/delete/_id
router.get('/delete/:_id', isLoggedIn, function(req, res, next){
    // get the id parameter from the url
    let _id = req.params._id;

    // use Mongoose to delete
    Book.remove({ _id: _id}, function(err){
        if (err){
            console.log(err);
            res.render('err');
            return;
        }
        res.redirect('/books');
    });
});

// GET books/_id - show edit page and pass selected fields
router.get('/:_id', function(req, res, next){
   // GET id from url
    let _id = req.params._id;

    // use mongoose to find selected book
    Book.findById( _id, function(err, book){
        if(err){
            console.log(err);
            res.render('error');
            return;
        }
        res.render('books/edit', {
            book: book,
            title:"Book's Details",
            user: req.user
        })
    });
});

// POST /books/_id - for save the upddated values
router.post('/:_id', isLoggedIn, function(req, res, next){
    // Get id from url
    let _id = req.params._id;

    // populate new book from the form
    var book = new Book({
        _id: _id,
        title: req.body.title,
        author: req.body.author,
        price: req.body.price,
        year: req.body.year,
    });

    Book.update({_id: _id}, book, function(err){
        if(err){
            console.log(err);
            res.render('error');
            return;
        }
        res.redirect('/books');
    });
});

// make this file public
module.exports = router;
