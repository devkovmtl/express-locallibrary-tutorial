const async = require('async');
const { body, validationResult } = require('express-validator');

const Genre = require('../models/genre');
const Book = require('../models/book');

// Display list of all Genre.
exports.genre_list = function (req, res) {
  Genre.find({}, function (err, list_genres) {
    if (err) {
      return next(err);
    }
    res.render('genre_list', {
      title: 'Genre List',
      genre_list: list_genres,
    });
  });
};

// Display detail page for a specific Genre.
exports.genre_detail = function (req, res, next) {
  async.parallel(
    {
      genre: function (callback) {
        Genre.findById(req.params.id).exec(callback);
      },
      genre_books: function (callback) {
        Book.find({ genre: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.genre == null) {
        const err = new Error('Genre not found');
        err.status = 404;
        return next(err);
      }
      res.render('genre_detail', {
        title: 'Genre Detail',
        genre: results.genre,
        genre_books: results.genre_books,
      });
    }
  );
};

// Display Genre create form on GET.
exports.genre_create_get = function (req, res) {
  res.render('genre_form', { title: 'Create Genre', errors: [], genre: null });
};

// Handle Genre create on POST.
// Invoking middleware in order
// body() validate and sanitize
exports.genre_create_post = [
  // validate and sanitizie the name field
  body('name', 'Genre name required').trim().isLength({ min: 1 }).escape(),
  // process request after validation and sanitization
  (req, res, next) => {
    // extract after validation and sanization
    const errors = validationResult(req);
    // create genre object with escaped and trimmed data
    const genre = new Genre({ name: req.body.name });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error message.
      res.render('genre_form', {
        title: 'Create Genre',
        genre,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid
      // check if genre with same name already exists
      Genre.findOne({ name: req.body.name }).exec(function (err, found_genre) {
        if (err) {
          return next(err);
        }
        if (found_genre) {
          // genre exist, redirect to its detail page
          res.redirect(found_genre.url);
        } else {
          genre.save(function (err) {
            if (err) {
              return next(err);
            }
            res.redirect(genre.url);
          });
        }
      });
    }
  },
];

// Display Genre delete form on GET.
exports.genre_delete_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Genre delete GET');
};

// Handle Genre delete on POST.
exports.genre_delete_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Genre delete POST');
};

// Display Genre update form on GET.
exports.genre_update_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Genre update GET');
};

// Handle Genre update on POST.
exports.genre_update_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Genre update POST');
};
