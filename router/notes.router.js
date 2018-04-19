'use strict';

const express = require('express');

// Create an router instance (aka "mini-app")
const router = express.Router();

// TEMP: Simple In-Memory Database
const data = require('../db/notes');
const simDB = require('../db/simDB');
const notes = simDB.initialize(data);


router.use(express.json());


// Get All (and search by query)
router.get('/notes', (req, res, next) => {
  console.log('get request for all');
  const { searchTerm } = req.query;

  notes.filter(searchTerm) 
    .then(list => {
      if (list) {
        res.json(list);
      }
      else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

// Get a single item
router.get('/notes/:id', (req, res, next) => {
  const id = req.params.id;
  notes.find(id)
    .then(item => {
      if (item) {
        res.json(item);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

// Put update an item
router.put('/notes/:id', (req, res, next) => {
  console.log(req);
  const id = req.params.id;

  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateableFields = ['title', 'content'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  /***** Never trust users - validate input *****/
  if (!updateObj.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  notes.update(id, updateObj) 
    .then(item => {
      if (item) {
        res.json(item);
      } else {
        next();
      }
    })
    .catch (err => next(err));

});

// Post (insert) an item
router.post('/notes', (req, res, next) => {
  const { title, content } = req.body;

  const newItem = { title, content };
  /***** Never trust users - validate input *****/
  if (!newItem.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  notes.create(newItem) 
    .then(newItem=> {
      if (newItem) {
        res.json(newItem);
      } else {
        next();
      }})
    .catch (err => next(err));
     
});


// Delete an item
router.delete('/notes/:id', (req, res, next) => {
  const id = req.params.id;

  notes.delete(id) 
    .then (res.status(204).json({'message':'you got it bro'}))
    .catch (err => next(err));
});

module.exports = router;