const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs')

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json());

app.set('port', process.env.PORT || 3000)
app.locals.title = 'byob'

app.get('/', (request, response) => {
  response.send("i am here")
})

app.get('/api/v1/users', (request, response) => {
  database('users').select()
  .then(folders => response.status(200).json(folders))
  .catch(error => response.sendStatus(500));
});

app.get('/api/v1/games', (request, response) => {
  database('games').select()
  .then(folders => response.status(200).json(folders))
  .catch(error => response.sendStatus(500));
});

app.get('/api/v1/users/:user_id', (request, response) => {
  database('users').where('id', request.params.user_id).select()
  .then(folders => response.status(200).json(folders))
  .catch(error => response.sendStatus(404));
});

app.get('/api/v1/games/:game_id', (request, response) => {
  database('games').where('id', request.params.game_id).select()
  .then(folders => response.status(200).json(folders))
  .catch(error => response.sendStatus(404));
});

app.post('/api/v1/collections', (request, response) => {
  const validCollection = ["user_id", "game_id"].every(prop => request.body.hasOwnProperty(prop));
  const collection = request.body;

  if(validCollection){
    database('collections').where({
      user_id: request.body.user_id,
      game_id: request.body.game_id
    }).first()
    .then((found) => {
      if (found){
        response.json('game already in collection');
      } else {
        database('collections').insert(collection,['user_id', 'game_id'])
        .then(collection => response.status(201).json(collection[0]))
        .catch(error => response.sendStatus(422));
      }
    });
  } else {
    response.sendStatus(422);
  }
});

app.post('/api/v1/users', (request, response) => {
  const validUser = ["firstname", "lastname", "email"].every(prop => request.body.hasOwnProperty(prop));
  const user = request.body;

  if(validUser){
    database('users').where({
      email: request.body.email,
    }).first()
    .then((found) => {
      if (found){
        response.json('email already exists in database');
      } else {
        database('users').insert(user,['id', 'firstname', 'lastname', 'email'])
        .then(collection => response.status(201).json(collection[0]))
        .catch(error => response.sendStatus(422));
      }
    });
  } else {
    response.sendStatus(422);
  }
});

app.patch('api/v1/users/:user_id', (request, response) => {
  database('users').where({
    id: request.params.user_id,
  }).first()
    .then((found) => {
      if(found){
        database
      } else {
        response.sendStatus(404)
      }
    })
})


app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}`)
})

exports.seed = function(database, Promise) {
    var sql = fs.readFileSync('./raw-data/BoardGames.sql').toString();
    console.log(sql);
    return database.raw('DROP DATABASE byob')
       .then(() => database.raw('CREATE DATABASE byob'))
       .then(() => database.raw(sql))
};
