exports.seed = (knex, Promise) => {
  return knex('users').del()
    .then(() => knex('users').del())
    .then(() => {
      return Promise.all([
        knex('users').insert({
          firstname: 'One',
          lastname: 'OneLast',
          email: 'one@onelast.com',
        }, 'id'),
        knex('users').insert({
          firstname: 'Two',
          lastname: 'TwoLast',
          email: 'two@twolast.com',
        }, 'id'),
        knex('users').insert({
          firstname: 'Three',
          lastname: 'ThreeLast',
          email: 'three@threelast.com',
        }, 'id'),
        knex('users').insert({
          firstname: 'Four',
          lastname: 'FourLast',
          email: 'four@fourlast.com',
        }, 'id'),
        knex('users').insert({
          firstname: 'Five',
          lastname: 'FiveLast',
          email: 'five@fivelast.com',
        }, 'id'),
        knex('users').insert({
          firstname: 'Six',
          lastname: 'SixLast',
          email: 'six@sixlast.com',
        }, 'id'),
        knex('users').insert({
          firstname: 'Seven',
          lastname: 'SevenLast',
          email: 'seven@sevenlast.com',
        }, 'id'),
        knex('users').insert({
          firstname: 'Eight',
          lastname: 'EightLast',
          email: 'eight@eightlast.com',
        }, 'id'),
        knex('users').insert({
          firstname: 'Nine',
          lastname: 'NineLast',
          email: 'nine@ninelast.com',
        }, 'id'),
        knex('users').insert({
          firstname: 'Ten',
          lastname: 'TenLast',
          email: 'ten@tenlast.com',
        }, 'id'),
      ]);
    });
};
