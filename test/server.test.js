'use strict';

const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;

chai.use(chaiHttp);

let badNote = {
  'content' : 'dude wheres my title?'
};


describe('Express static', function () {

  it('GET request "/" should return the index page', function () {
    return chai.request(app)
      .get('/')
      .then(function (res) {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.be.html;
      });
  });

});

describe('404 handler', function () {

  it('should respond with 404 when given a bad path', function () {
    return chai.request(app)
      .get('/DOES/NOT/EXIST')
      .then(res => {
        expect(res).to.have.status(404);
      });
  });

});

//testing strategy
//make get request
//should return array.length === 10
//for each in array, object should have specified keys

describe ('GET/api/notes', function () {
  it('should have 10 items and expected keys', function () {
    return chai.request(app)
      .get('/api/notes')
      .then( res => {
        expect(res.body).to.have.length(10);
        expect(res.body.forEach(item => {
          Object.keys(item) === ['id', 'title', 'content'];
        }));
      });
  }); 
});


describe ('GET/api/notes', function () {
  let constructedQuery = {
    searchTerm: 'government',
  };

  let badQuery = {
    larroquette: 'foo',
  };

  it('should hreturn correct searchresults for a valid query', function () {
    return chai.request(app)
      .get('/api/notes', constructedQuery)
      .then( res => {
        expect(Object.values(res.body).includes(constructedQuery.searchTerm));
      });
  });

  it('should return an empty array for an incorrect query', function(){
    return chai.request(app)
      .get('/api/notes', badQuery)
      .then ( res => {
        expect(res.body === []);
      });
  });
});



describe ('GET/api/notes/:id', function () {
  let id = 1000;
  it ('should return correct note object with id, title and content for a given id', function () {
    return chai.request(app)
      .get(`/api/notes/${id}`)
      .then (res => {
        expect(res.body.length ===1);
        expect(res.body.id === id);
        expect(Object.keys(res.body)) === ['id', 'title', 'content'];
      });

  });

});

describe ('POST/api/notes/', function () {
  let createdNote = {
    'title': 'I am a note!',
    'content': 'I contain content'
  };


  it('should create and return a new item with location header when provided valid data', function () {
    return chai.request(app)
      .post('/api/notes/')
      .send(createdNote)
      .then( res => {
        expect(res).to.have.status(200);
        expect(res.body).to.include.keys(['title', 'content', 'id']);
      });
  });
  it('should return an object with a message property "Missing title in request body" when missing "title" field', function () {
    let expectedError = {
      message: 'Missing `title` in request body' 
    };
    return chai.request(app)
      .post('/api/notes/')
      .send(badNote)
      .then (res => {
        // expect(res).to.have.status(400);
        // expect(res).to.be.an('object');
        expect(res.body.message).to.equal(expectedError.message);
      });
  });

});

describe ('PUT/api/notes:id', function (){
  let testID = 1001;
  let testUpdate = {
    
    title: 'updating title',
    content: 'here is some content'
  };

  it('should update and return a note object when given valid data', function (){
  

    return chai.request(app)
      .put(`/api/notes/${testID}`)
      .send(testUpdate)
      .then (res => {
        expect(res).to.be.an('object');
        expect(res.body).to.include.keys(['title', 'content', 'id']);
        expect(res.body.title).to.equal(testUpdate.title);
        expect(res.body.content).to.equal(testUpdate.content);
        expect(res.body.id).to.equal(testID);
      });
  });
  it('should respond with a 404 for an invalid id (/api/notes/DOESNOTEXIST)', function () {
    return chai.request(app)
      .put('/api/notes/DOESNOTEXIST')
      .send(testUpdate)
      .then ( res => {
        expect(res).to.be.status(404);
      });
  });
  it('should return an object with a message property "Missing title in request body" when missing "title" field', function () {
    let expectedError = {
      message: 'Missing `title` in request body' 
    };
    return chai.request(app)
      .post('/api/notes/')
      .send(badNote)
      .then (res => {
        // expect(res).to.have.status(400);
        // expect(res).to.be.an('object');
        expect(res.body.message).to.equal(expectedError.message);
      });
  });

});

describe ('DELETE/api/notes/:id', function () {
  it ('should delete an item by id', function (){
    let deleteID = 1005;
    return chai.request(app)
      .delete(`/api/notes/${deleteID}`)
      .then (res => {
        expect(res).to.have.status(204);
       
      });
         

  });

});