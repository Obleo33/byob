const gameData = require('../../../raw_data/byob_games_jsonfile.json')


exports.seed = (knex, Promise) => {
  return knex('games').del()
    .then(() => {
      return Promise.all([
        knex('games').insert(gameData.games)
      ]);
    });
};
