exports.seed = (knex, Promise) => {
  return knex('collections').del()
    .then(() => knex('collections').del())
    .then(() => {
      return Promise.all([
      ]);
    });
};
