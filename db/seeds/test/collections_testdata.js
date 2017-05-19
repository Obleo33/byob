exports.seed = (knex, Promise) => {
  return knex('collections').del()
    .then(() => knex('collections').del())
    .then(() => {
      return Promise.all([
        // knex('collections').insert({
        //   id: 1,
        //   user_id: 1,
        //   game_id: 1,
        // }),
        // knex('collections').insert({
        //   id: 2,
        //   user_id: 1,
        //   game_id: 7,
        // }),
        // knex('collections').insert({
        //   id: 3,
        //   user_id: 1,
        //   game_id: 10,
        // }),
        // knex('collections').insert({
        //   id: 4,
        //   user_id: 2,
        //   game_id: 1,
        // }),
        // knex('collections').insert({
        //   id: 5,
        //   user_id: 2,
        //   game_id: 4,
        // }),
      ]);
    });
};
