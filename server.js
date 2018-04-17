'use strict';

const express = require('express');
const data = require('./db/notes');
const { PORT } = require('./config');
const {middleLogger} =require('./middleware/logger.js');
const app = express();



app.use(express.static('public'));
app.use(middleLogger);




app.get('/api/notes', (req, res) => {
  let searchInput = req.query.searchTerm;

  //MENTOR SESSION: WHY DON'T I NEED TO RETURN?
  (!searchInput) ? res.json(data) : res.json(data.filter(items => items.title.includes(searchInput)));

});

app.get('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  const item= data.find(item => item.id === Number(id));
  console.log(id);
  return res.json(item);

});

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({ message: 'Not Found' });
});

// Listen for incoming connections
app.listen(PORT, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});