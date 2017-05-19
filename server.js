
const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json());

app.set('port', process.env.PORT || 3000);
app.locals.title = 'byob';

app.get('/', (request, response) => {
  response.send('i am here');
});

app.get('/api/v1/users', (request, response) => {
  database('users').select()
  .then(user => response.status(200).json(user))
  .catch(error => response.status(500).send(error));
});

app.get('/api/v1/games', (request, response) => {
  database('games').select()
  .then(games => response.status(200).json(games))
  .catch(error => response.status(500).send(error));
});

app.get('/api/v1/users/:user_id', (request, response) => {
  database('users').where('id', request.params.user_id).select()
  .then((user) => {
    if (!user.length) {
      response.sendStatus(404);
    } else {
      response.status(200).json(user);
    }
  })
  .catch(error => response.status(500).send(error));
});

app.get('/api/v1/games/:game_id', (request, response) => {
  database('games').where('id', request.params.game_id).select()
  .then((game) => {
    if (!game.length) {
      response.sendStatus(404);
    } else {
      response.status(200).json(game);
    }
  })
  .catch(error => response.status(500).send(error));
});

app.get('/api/v1/collections', (request, response) => {
  database('collections').select()
  .then(collections => response.status(200).json(collections))
  .catch(error => response.status(500).send(error));
});

app.get('/api/v1/collections/:user_id', (request, response) => {
  database('collections').where('user_id', request.params.user_id).select()
  .then((games) => {
    if (!games.length) {
      response.sendStatus(404);
    } else {
      response.status(200).json(games);
    }
  })
  .catch(error => response.status(500).send(error));
});


app.post('/api/v1/collections', (request, response) => {
  const validCollection = ['user_id', 'game_id'].every(prop => request.body.hasOwnProperty(prop));
  const collection = request.body;

  if (validCollection) {
    database('collections').where({
      user_id: request.body.user_id,
      game_id: request.body.game_id,
    }).first()
    .then((found) => {
      if (found) {
        response.status(422).json('game already in collection');
      } else {
        database('collections').insert(collection, ['user_id', 'game_id'])
        .then(collectionResponse => response.status(201).json(collectionResponse[0]))
        .catch(error => response.status(422).send(error));
      }
    });
  } else {
    response.sendStatus(422);
  }
});

app.post('/api/v1/users', (request, response) => {
  const validUser = ['firstname', 'lastname', 'email'].every(prop => request.body.hasOwnProperty(prop));
  const user = request.body;

  if (validUser) {
    database('users').where({
      email: request.body.email,
    }).first()
    .then((found) => {
      if (found) {
        response.status(422).json('email already exists in database');
      } else {
        database('users').insert(user, ['id', 'firstname', 'lastname', 'email'])
        .then(collection => response.status(201).json(collection[0]))
        .catch(error => response.sendStatus(422, error));
      }
    });
  } else {
    response.sendStatus(422);
  }
});

app.patch('/api/v1/users/:user_id', (request, response) => {
  database('users').where('id', request.params.user_id).select()
  .then((selectedUser) => {
    if (!selectedUser.length) {
      response.sendStatus(404);
    } else {
      if (request.body.email) {
        database('users').where({ email: request.body.email }).first()
        .then((found) => {
          if (found) {
            response.status(422).send('email already exists in database');
          } else {
            database('users').where('id', request.params.user_id).update(request.body, ['id', 'firstname', 'lastname', 'email'])
            .then(updated => response.status(200).send(updated[0]))
            .catch(error => response.status().send(error));
          }
        });
      } else {
        database('users').where('id', request.params.user_id).update(request.body, ['id', 'firstname', 'lastname', 'email'])
          .then(updated => response.status(200).send(updated[0]))
          .catch(error => response.status().send(error));
      }
    }
  })
  .catch(error => response.status(500).send(error));
});

app.patch('/api/v1/games/:game_id', (request, response) => {
  const keys = Object.keys(request.body);
  database('games').where('id', request.params.game_id).update(request.body, ['id', ...keys])
  .then((updated) => {
    if (!updated.length) {
      response.sendStatus(404);
    } else {
      response.status(200).send(updated[0]);
    }
  })
  .catch(error => response.status(500).send(error));
});

app.delete('/api/v1/collections/:collection_id', (request, response) => {
  database('collections').where({ id: request.params.collection_id }).select()
    .then((record) => {
      if (!record.length) {
        response.sendStatus(404);
      } else {
        database('collections').where({ id: request.params.collection_id }).del()
        .then(() => response.status(200).send('record deleted'));
      }
    });
});

app.delete('/api/v1/users/:user_id', (request, response) => {
  database('users').where({ id: request.params.user_id }).select()
    .then((record) => {
      if (!record.length) {
        response.sendStatus(404);
      } else {
        database('collections').where({ user_id: request.params.user_id }).del()
          .then(() => database('users').where({ id: request.params.user_id }).del())
        .then(() => response.status(200).send('record deleted'));
      }
    });
});


app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}`);
});

exports.seed = (database, Promise) => {
    let sql = fs.readFileSync('./raw-data/BoardGames.sql').toString();
    console.log(sql);
    return database.raw('DROP DATABASE byob')
       .then(() => database.raw('CREATE DATABASE byob'))
       .then(() => database.raw(sql));
};

module.exports = app;
