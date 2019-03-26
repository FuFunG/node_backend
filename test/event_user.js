process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();

chai.use(chaiHttp);
let event_id = "2"
let user_id = "1"

describe('Event_User', () => {
    describe('/GET event_user', () => {
        it('it should GET all the event_user', (done) => {
          chai.request(app)
              .get('/event_user')
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('result');
                res.body.result.should.be.eql(true);
                res.body.should.have.property('payload');
                res.body.payload.should.be.a('array');
                done();
              });
        });
    });

    describe('/GET:id event_user', () => {
        it('it should not GET a event_user with non exist id', (done) => {
          let event_user = {
            id: 99999999999,
          }
          chai.request(app)
              .get(`/event_user/${event_user.id}`)
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('result');
                  res.body.result.should.be.eql(false);
                done();
              });
        });

        it('it should GET a event_user', (done) => {
            let event_user = {
                id: 1,
            }
            chai.request(app)
                .get(`/event_user/${event_user.id}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('result');
                    res.body.result.should.be.eql(true);
                    done();
                });
        });
    })

    describe('/GET:id event_user/event', () => {
        it('it should not GET a event_user with non exist eventId', (done) => {
          let eventId = 999999
          chai.request(app)
              .get(`/event_user/event/${eventId}`)
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('result');
                  res.body.result.should.be.eql(false);
                done();
              });
        });

        it('it should GET a event_user', (done) => {
            let eventId = 1
            chai.request(app)
                .get(`/event_user/event/${eventId}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('result');
                    res.body.result.should.be.eql(true);
                    res.body.should.have.property('payload');
                    res.body.payload.should.be.a('array');
                    done();
                });
        });
    })

    describe('/GET:id event_user/user', () => {
        it('it should not GET a event_user with non exist userId', (done) => {
          let userId = 999999
          chai.request(app)
              .get(`/event_user/event/${userId}`)
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('result');
                  res.body.result.should.be.eql(false);
                done();
              });
        });

        it('it should GET a event_user', (done) => {
            let userId = 1
            chai.request(app)
                .get(`/event_user/event/${userId}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('result');
                    res.body.result.should.be.eql(true);
                    res.body.should.have.property('payload');
                    res.body.payload.should.be.a('array');
                    done();
                });
        });
    })

    describe('/POST event_user', () => {
        it('it should not POST event_user without eventId or userId', (done) => {
          let event_user = {
          }
          chai.request(app)
              .post('/event_user')
              .send(event_user)
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('result');
                    res.body.result.should.be.eql(false);
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('messages');
                    res.body.errors.messages.should.be.eql('some fields missing');
                    res.body.errors.should.have.property('fields');
                    res.body.errors.fields.should.have.property('eventId');
                    res.body.errors.fields.eventId.should.be.eql('required');
                    res.body.errors.fields.should.have.property('userId');
                    res.body.errors.fields.userId.should.be.eql('required');
                done();
              });
        });

        it('it should not POST event_user with non exsiting eventId or userId', (done) => {
            let event_user = {
                eventId: "9999999",
                userId: "999999"
            }
          chai.request(app)
              .post('/event_user')
              .send(event_user)
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('result');
                    res.body.result.should.be.eql(false);
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('messages');
                    res.body.errors.messages.should.be.eql('Event or User not created');
                done();
              });
        });

        it('it should not POST event_user with exsiting eventId and userId', (done) => {
            let event_user = {
                eventId: "1",
                userId: "1"
            }
          chai.request(app)
              .post('/event_user')
              .send(event_user)
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('result');
                    res.body.result.should.be.eql(false);
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('messages');
                    res.body.errors.messages.should.be.eql('This user already join the event.');
                done();
              });
        });

        it('it should POST a event_user', (done) => {
            let event_user = {
                eventId: "2",
                userId: "1"
            }
            chai.request(app)
                .post('/event_user')
                .send(event_user)
                .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('result');
                        res.body.result.should.be.eql(true);
                        res.body.should.have.property('payload');
                        res.body.payload.should.have.property('id');
                    done();
                });
        });
    });

    describe('/DELETE event_user', () => {
        it('it should not DELETE a event_user with non exist eventId and userId', (done) => {
            let event_user = {
                eventId: "99999999",
                userId: "9999999"
            }
            chai.request(app)
                .delete(`/event_user`)
                .send(event_user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('result');
                    res.body.result.should.be.eql(false);
                    done();
                });
        });

        it('it should DELETE a event given the id', (done) => {
            let event_user = {
                eventId: event_id,
                userId: user_id
            }
            chai.request(app)
                .delete(`/event_user`)
                .send(event_user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('result');
                    res.body.result.should.be.eql(true);
                    done();
                });
        });
    });
})