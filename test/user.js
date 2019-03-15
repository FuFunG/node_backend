process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();

chai.use(chaiHttp);
let user_id = 0
describe('Users', () => {
    // beforeEach((done) => { //Before each test we empty the database
    //     Book.remove({}, (err) => { 
    //        done();           
    //     });        
    // });
/*
  * Test the /GET route
  */
  describe('/GET user', () => {
      it('it should GET all the users', (done) => {
        chai.request(app)
            .get('/user')
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('array');
                  // res.body.length.should.be.eql(1);
              done();
            });
      });
  });

  describe('/GET/:id user', () => {
    it('it should not GET a user with non exist id', (done) => {
      let user = {
        id: 99999999999,
      }
      chai.request(app)
          .get(`/user/${user.id}`)
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('result');
              res.body.result.should.be.eql(false);
            done();
          });
    });
    
    it('it should GET a user given the id', (done) => {
      let user = {
        id: 3
      }
      chai.request(app)
          .get(`/user/${user.id}`)
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('result');
              res.body.result.should.be.eql(true);
              res.body.should.have.property('payload');
              res.body.payload.should.have.property('id');
              res.body.payload.should.have.property('email');
              res.body.payload.should.have.property('createdAt');
            done();
          });
    });
  });
  
  describe('/PUT/:id user', () => {
    it('it should not PUT without newPassword', (done) => {
      let user = {
        id: 4
      }
      chai.request(app)
          .put(`/user/${user.id}`)
          .send(user)
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('result');
                res.body.result.should.be.eql(false);
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('messages');
                res.body.errors.messages.should.be.eql('some fields missing');
                res.body.errors.should.have.property('fields');
                res.body.errors.fields.should.have.property('newPassword');
                res.body.errors.fields.newPassword.should.be.eql('required');
            done();
          });
    });

    it('it should not UPDATE a user with non exist id', (done) => {
      let user = {
        id: 99999999999,
        newPassword: 'newPassword'
      }
      chai.request(app)
          .put(`/user/${user.id}`)
          .send(user)
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('result');
              res.body.result.should.be.eql(false);
            done();
          });
    });
    
    it('it should UPDATE a user given the id', (done) => {
      let user = {
        id: 4,
        newPassword: 'newPassword'
      }
      chai.request(app)
          .put(`/user/${user.id}`)
          .send(user)
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('result');
              res.body.result.should.be.eql(true);
            done();
          });
    });
  });

  // register
  describe('/POST user/register', () => {
    it('it should not POST without email and password and name', (done) => {
      let user = {
      }
      chai.request(app)
          .post('/user/register')
          .send(user)
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('result');
                res.body.result.should.be.eql(false);
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('messages');
                res.body.errors.messages.should.be.eql('some fields missing');
                res.body.errors.should.have.property('fields');
                res.body.errors.fields.should.have.property('email');
                res.body.errors.fields.email.should.be.eql('required');
                res.body.errors.fields.should.have.property('password');
                res.body.errors.fields.password.should.be.eql('required');
                res.body.errors.fields.should.have.property('name');
                res.body.errors.fields.name.should.be.eql('required');
            done();
          });
    });
    
    it('it should not POST with exising email', (done) => {
      let user = {
        email: 'admin',
        password: 'admin',
        name: 'admin'
      }
      chai.request(app)
          .post('/user/register')
          .send(user)
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('result');
                res.body.result.should.be.eql(false);
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('messages');
                res.body.errors.messages.should.be.eql('email already exist');
            done();
          });
    });

    it('it should POST a user', (done) => {
      let user = {
        email: 'admin3',
        password: 'admin3',
        name: 'admin3'
      }
      chai.request(app)
          .post('/user/register')
          .send(user)
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('result');
                res.body.result.should.be.eql(true);
                res.body.should.have.property('payload');
                res.body.payload.should.have.property('id');
                user_id = res.body.payload.id
            done();
          });
    });
  });

  describe('/POST user/login', () => {
    it('it should not LOGIN without email', (done) => {
      let user = {
        password: 'admin'
      }
      chai.request(app)
          .post('/user/login')
          .send(user)
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('result');
                res.body.result.should.be.eql(false);
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('messages');
                res.body.errors.messages.should.be.eql('some fields missing');
                res.body.errors.should.have.property('fields');
                res.body.errors.fields.should.have.property('email');
                res.body.errors.fields.email.should.be.eql('required');
            done();
          });
    });

    it('it should not LOGIN without password', (done) => {
      let user = {
        email: 'admin'
      }
      chai.request(app)
          .post('/user/login')
          .send(user)
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('result');
                res.body.result.should.be.eql(false);
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('messages');
                res.body.errors.messages.should.be.eql('some fields missing');
                res.body.errors.should.have.property('fields');
                res.body.errors.fields.should.have.property('password');
                res.body.errors.fields.password.should.be.eql('required');
            done();
          });
    });

    it('it should not LOGIN without email and password', (done) => {
      let user = {
      }
      chai.request(app)
          .post('/user/login')
          .send(user)
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('result');
                res.body.result.should.be.eql(false);
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('messages');
                res.body.errors.messages.should.be.eql('some fields missing');
                res.body.errors.should.have.property('fields');
                res.body.errors.fields.should.have.property('email');
                res.body.errors.fields.email.should.be.eql('required');
                res.body.errors.fields.should.have.property('password');
                res.body.errors.fields.password.should.be.eql('required');
            done();
          });
    });

    it('it should not LOGIN with an non exist account', (done) => {
      let user = {
        email: 'fakeemail',
        password: 'faksepassowrd'
      }
      chai.request(app)
          .post('/user/login')
          .send(user)
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('result');
                res.body.result.should.be.eql(false);
            done();
          });
    });

    it('it should not LOGIN with wroung password', (done) => {
      let user = {
        email: 'admin',
        password: 'faksepassowrd'
      }
      chai.request(app)
          .post('/user/login')
          .send(user)
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('result');
                res.body.result.should.be.eql(false);
            done();
          });
    });

    it('it should LOGIN', (done) => {
      let user = {
        email: 'admin',
        password: 'admin'
      }
      chai.request(app)
          .post('/user/login')
          .send(user)
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('result');
                res.body.result.should.be.eql(true);
                res.body.should.have.property('payload');
                res.body.payload.should.have.property('id');
                res.body.payload.id.should.be.eql(3);
            done();
          });
    });
  });

  describe('/DELETE/:id user', () => {
    it('it should DELETE a user given the id', (done) => {
      let user = {
        id: user_id
      }
      chai.request(app)
          .delete(`/user/${user.id}`)
          .send(user)
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('result');
              res.body.result.should.be.eql(true);
            done();
          });
    });
  });

});