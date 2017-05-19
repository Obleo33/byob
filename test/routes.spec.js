/* eslint-env node, mocha */
process.env.NODE_ENV = 'test';

const environment = 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server.js');

chai.should();


chai.use(chaiHttp);

describe('boyb server testing', () => {
  beforeEach((done) => {
    database.migrate.latest()
    .then(() => {
      database.seed.run()
      .then(() => {
        done();
      });
    });
  });

  afterEach((done) => {
    database.seed.run()
    .then(() => {
      done();
    });
  });

  describe('API routes', () => {
    describe('GET /api/v1/users', () => {
      it('should return all users', (done) => {
        chai.request(server)
        .get('/api/v1/users')
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.a('array');
          response.body.should.have.length(2);
          response.body[0].should.have.property('id');
          response.body[0].should.have.property('firstname');
          response.body[0].should.have.property('lastname');
          response.body[0].should.have.property('email');
          done();
        });
      });
    });

    describe('GET /api/v1/games', () => {
      it('should return all games', (done) => {
        chai.request(server)
        .get('/api/v1/games')
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.a('array');
          response.body.should.have.length(10);
          response.body[0].should.have.property('id');
          response.body[0].should.have.property('rank');
          response.body[0].should.have.property('bgg_url');
          response.body[0].should.have.property('bgg_id');
          response.body[0].should.have.property('names');
          response.body[0].should.have.property('min_players');
          response.body[0].should.have.property('max_players');
          response.body[0].should.have.property('avg_time');
          response.body[0].should.have.property('min_time');
          response.body[0].should.have.property('max_time');
          response.body[0].should.have.property('year');
          response.body[0].should.have.property('avg_rating');
          response.body[0].should.have.property('geek_rating');
          response.body[0].should.have.property('num_votes');
          response.body[0].should.have.property('image_url');
          response.body[0].should.have.property('age');
          response.body[0].should.have.property('mechanic');
          response.body[0].should.have.property('owned');
          response.body[0].should.have.property('category');
          response.body[0].should.have.property('designer');
          response.body[0].should.have.property('weight');
          done();
        });
      });
    });

    describe('GET /api/v1/users/:user_id', () => {
      it('shoud return a specified user', (done) => {
        chai.request(server)
        .get('/api/v1/users/1')
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.a('array');
          response.body.should.have.length(1);
          response.body[0].firstname.should.equal('One');
          response.body[0].lastname.should.equal('OneLast');
          response.body[0].email.should.equal('one@onelast.com');
          done();
        });
      });

      it('shoud return 404 if not found', (done) => {
        chai.request(server)
        .get('/api/v1/users/30')
        .end((error, response) => {
          response.should.have.status(404);
          done();
        });
      });
    });

    describe('GET /api/v1/games/:game_id', () => {
      it('shoud return a specified game', (done) => {
        chai.request(server)
        .get('/api/v1/games/1')
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.a('array');
          response.body.should.have.length(1);
          response.body[0].id.should.equal(1);
          response.body[0].rank.should.equal(1);
          response.body[0].bgg_url.should.equal('https://boardgamegeek.com/boardgame/161936/pandemic-legacy-season-1');
          response.body[0].bgg_id.should.equal(161936);
          response.body[0].names.should.equal('Pandemic Legacy: Season 1');
          response.body[0].min_players.should.equal(2);
          response.body[0].max_players.should.equal(4);
          response.body[0].avg_time.should.equal(60);
          response.body[0].min_time.should.equal(60);
          response.body[0].max_time.should.equal(60);
          response.body[0].year.should.equal(2015);
          response.body[0].avg_rating.should.equal(8.66801);
          response.body[0].geek_rating.should.equal(8.48529);
          response.body[0].num_votes.should.equal(17158);
          response.body[0].image_url.should.equal('//cf.geekdo-images.com/images/pic2452831.png');
          response.body[0].age.should.equal(13);
          response.body[0].mechanic.should.equal('Action Point Allowance System| Co-operative Play| Hand Management| Point to Point Movement| Set Collection| Trading| Variable Player Powers');
          response.body[0].owned.should.equal(28156);
          response.body[0].category.should.equal('Environmental| Medical');
          response.body[0].designer.should.equal('Rob Daviau| Matt Leacock');
          response.body[0].weight.should.equal(2.8023);
          done();
        });
      });

      it('shoud return 404 if not found', (done) => {
        chai.request(server)
        .get('/api/v1/games/30')
        .end((error, response) => {
          response.should.have.status(404);
          done();
        });
      });
    });

    describe('POST /api/v1/collecions', () => {
      it('should create a new collection record', (done) => {
        chai.request(server)
        .post('/api/v1/collections')
        .send({
          user_id: 1,
          game_id: 1,
        })
        .end((error, response) => {
          response.should.have.status(201);
          response.body.user_id.should.equal(1);
          response.body.game_id.should.equal(1);
          chai.request(server)
          .delete('/api/v1/users')
          .send({
            user_id: 1,
          });
          done();
        });
      });
    });

    describe('POST /api/v1/users', () => {
      it('should create a new user', (done) => {
        chai.request(server)
        .post('/api/v1/users')
        .send({
          firstname: 'Tacos',
          lastname: 'Are',
          email: 'really@cool.com',
        })
        .end((error, response) => {
          response.should.have.status(201);
          response.body.firstname.should.equal('Tacos');
          response.body.lastname.should.equal('Are');
          response.body.email.should.equal('really@cool.com');
          done();
        });
      });

      it('should send a 422 error if the email is in the database', (done) => {
        chai.request(server)
        .post('/api/v1/users')
        .send({
          firstname: 'test',
          lastname: 'testlast',
          email: 'one@onelast.com',
        })
        .end((error, response) => {
          response.should.have.status(422);
          done();
        });
      });

      it('should send a 422 error if request is missing information', (done) => {
        chai.request(server)
        .post('/api/v1/users')
        .send({
          firstname: 'test',
          lastname: 'testlast',
        })
        .end((error, response) => {
          response.should.have.status(422);
          done();
        });
      });
    });

    describe('PATCH /api/v1/users/:user_id', () => {
      it('should update a specified users firstname', (done) => {
        chai.request(server)
        .patch('/api/v1/users/1')
        .send({
          firstname: 'Newname',
        })
        .end((error, response) => {
          response.should.have.status(200);
          response.body.firstname.should.equal('Newname');
          response.body.lastname.should.equal('OneLast');
          response.body.email.should.equal('one@onelast.com');
          done();
        });
      });

      it('should update a specified users lastname', (done) => {
        chai.request(server)
        .patch('/api/v1/users/1')
        .send({
          lastname: 'NewLast',
        })
        .end((error, response) => {
          response.should.have.status(200);
          response.body.firstname.should.equal('One');
          response.body.lastname.should.equal('NewLast');
          response.body.email.should.equal('one@onelast.com');
          done();
        });
      });

      it('should update a specified users email', (done) => {
        chai.request(server)
        .patch('/api/v1/users/1')
        .send({
          email: 'new@email.com',
        })
        .end((error, response) => {
          response.should.have.status(200);
          response.body.firstname.should.equal('One');
          response.body.lastname.should.equal('OneLast');
          response.body.email.should.equal('new@email.com');
          done();
        });
      });

      it('should send a 422 if the email exists', (done) => {
        chai.request(server)
        .patch('/api/v1/users/1')
        .send({
          email: 'two@twolast.com',
        })
        .end((error, response) => {
          response.should.have.status(422);
          done();
        });
      });

      it('should send a 404 if user does not exist', (done) => {
        chai.request(server)
        .patch('/api/v1/users/10')
        .send({
          last: 'Hey',
        })
        .end((error, response) => {
          response.should.have.status(404);
          done();
        });
      });

      it('should send a 500 for sad path', (done) => {
        chai.request(server)
        .patch('/api/v1/users/sad')
        .send({
          last: 'Hey',
        })
        .end((error, response) => {
          response.should.have.status(500);
          done();
        });
      });
    });

    describe('PATCH /api/v1/games/:game_id', () => {
      it('should update a specified games property', (done) => {
        chai.request(server)
        .patch('/api/v1/games/1')
        .send({
          min_players: 100,
        })
        .end((error, response) => {
          response.should.have.status(200);
          response.body.id.should.equal(1);
          response.body.min_players.should.equal(100);
          done();
        });
      });

      it('should send a 404 if the game is not found', (done) => {
        chai.request(server)
        .patch('/api/v1/games/100')
        .send({
          names: 'test',
        })
        .end((error, response) => {
          response.should.have.status(404);
          done();
        });
      });

      it('should send a 500 if property is not found', (done) => {
        chai.request(server)
        .patch('/api/v1/games/1')
        .send({
          tacos: 'test',
        })
        .end((error, response) => {
          response.should.have.status(500);
          done();
        });
      });
    });

    xdescribe('DELETE /api/v1/collcetions/:collection_id', () => {
      it('should remove a collection from the database', (done) => {
        chai.request(server)
        .post('/api/v1/collections')
        .send({
          user_id: 1,
          game_id: 1,
        }).end((error, response) => {
          response.should.have.status(201);
          response.body.user_id.should.equal(1);
          response.body.game_id.should.equal(1);
        })
        .then(() => {
          chai.request(server)
          .delete('/api/v1/users')
          .send({
            user_id: 1,
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.text.should.equal('record deleted');
          });
        });
        done();
      });
    });

    describe('DELETE /api/v1/users/:user_id', () => {
      it('should remove a user from the database', (done) => {
        chai.request(server)
        .delete('/api/v1/users/1')
        .end((error, response) => {
          response.should.have.status(200);
          response.text.should.equal('record deleted');
        });
        done();
      });
    });
  });
});
