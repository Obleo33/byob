exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users', (table) => {
      table.increments('id').primary();
      table.string('firstname');
      table.string('lastname');
      table.string('email');
      table.timestamps(true, true);
    }),

    knex.schema.createTable('games', (table) => {
      table.increments('id').primary();
      table.integer('rank');
      table.string('bgg_url');
      table.integer('bgg_id');
      table.string('names');
      table.integer('min_players');
      table.integer('max_players');
      table.integer('avg_time');
      table.integer('min_time');
      table.integer('max_time');
      table.integer('year');
      table.float('avg_rating');
      table.float('geek_rating');
      table.integer('num_votes');
      table.string('image_url');
      table.integer('age');
      table.string('mechanic');
      table.integer('owned');
      table.string('category');
      table.string('designer');
      table.float('weight');
      table.timestamps(true, true);
    }),

    knex.schema.createTable('collections', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned();
      table.foreign('user_id').references('users.id');
      table.integer('game_id').unsigned();
      table.foreign('game_id').references('games.id');
      table.timestamps(true, true);
    }),

  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('users'),
    knex.schema.dropTable('games'),
    knex.schema.dropTable('collections'),
  ]);
};
