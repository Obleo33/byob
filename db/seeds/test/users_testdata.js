exports.seed = (knex, Promise) => {
  return knex('users').del()
    .then(() => knex('users').del())
    .then(() => {
      return Promise.all([
        knex('users').insert({
          id: 1,
          firstname: 'One',
          lastname: 'OneLast',
          email: 'one@onelast.com',
        }),
        knex('users').insert({
          id: 2,
          firstname: 'Two',
          lastname: 'TwoLast',
          email: 'two@twolast.com',
        }),
      ]);
    });
};
