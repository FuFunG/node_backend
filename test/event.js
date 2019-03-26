process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();

chai.use(chaiHttp);
let event_id = 0

describe('Event', () => {

    describe('/GET event', () => {
        it('it should GET all the events', (done) => {
          chai.request(app)
              .get('/event')
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    // res.body.length.should.be.eql(1);
                done();
              });
        });
    });

    describe('/GET/:id event', () => {
        it('it should not GET a event with non exist id', (done) => {
          let event = {
            id: 99999999999,
          }
          chai.request(app)
              .get(`/event/${event.id}`)
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('result');
                  res.body.result.should.be.eql(false);
                done();
              });
        });

        it('it should GET a event given the id', (done) => {
            let event = {
              id: 1
            }
            chai.request(app)
                .get(`/event/${event.id}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('result');
                    res.body.result.should.be.eql(true);
                    res.body.should.have.property('payload');
                    res.body.payload.should.have.property('id');
                    res.body.payload.should.have.property('userId');
                    res.body.payload.should.have.property('title');
                    res.body.payload.should.have.property('description');
                    res.body.payload.should.have.property('createdAt');
                    res.body.payload.should.have.property('startAt');
                    res.body.payload.should.have.property('endAt');
                    res.body.payload.should.have.property('updatedAt');
                    res.body.payload.should.have.property('address');
                  done();
                });
          });
    });

    describe('/POST event', () => {
        it('it should not POST event without userId, title, description, startAt, endAt or address', (done) => {
          let event = {
          }
          chai.request(app)
              .post('/event')
              .send(event)
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('result');
                    res.body.result.should.be.eql(false);
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('messages');
                    res.body.errors.messages.should.be.eql('some fields missing');
                    res.body.errors.should.have.property('fields');
                    res.body.errors.fields.should.have.property('userId');
                    res.body.errors.fields.userId.should.be.eql('required');
                    res.body.errors.fields.should.have.property('title');
                    res.body.errors.fields.title.should.be.eql('required');
                    res.body.errors.fields.should.have.property('description');
                    res.body.errors.fields.description.should.be.eql('required');
                    res.body.errors.fields.should.have.property('startAt');
                    res.body.errors.fields.startAt.should.be.eql('required');
                    res.body.errors.fields.should.have.property('endAt');
                    res.body.errors.fields.endAt.should.be.eql('required');
                    res.body.errors.fields.should.have.property('address');
                    res.body.errors.fields.address.should.be.eql('required');
                done();
              });
        });
        
        it('it should not POST a event with not exsiting userId', (done) => {
            let event = {
                userId: "999999999",
                title: "test event",
                description: "testing",
                startAt: "2019-03-24 05:00:00",
                endAt: "2019-03-24 06:00:00",
                address: "Hong Kong"
            }
            chai.request(app)
                .post('/event')
                .send(event)
                .end((err, res) => {
                      res.should.have.status(200);
                      res.body.should.be.a('object');
                      res.body.should.have.property('result');
                      res.body.result.should.be.eql(false);
                      res.body.should.have.property('errors');
                      res.body.errors.should.have.property('messages');
                      res.body.errors.messages.should.eql('user not exsiting');
                  done();
                });
          });
    
        it('it should POST a event', (done) => {
          let event = {
              userId: "1",
              title: "test event",
              description: "testing",
              startAt: "2019-03-24 05:00:00",
              endAt: "2019-03-24 06:00:00",
              address: "Hong Kong"
          }
          chai.request(app)
              .post('/event')
              .send(event)
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('result');
                    res.body.result.should.be.eql(true);
                    res.body.should.have.property('payload');
                    res.body.payload.should.have.property('id');
                    event_id = res.body.payload.id
                done();
              });
        });
    });

    describe('/PUT/:id event', () => {
        it('it should not PUT event without userId, title, description, startAt, endAt or address', (done) => {
          let event = {
            id: 3
          }
          chai.request(app)
              .put(`/event/${event.id}`)
              .send(event)
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('result');
                    res.body.result.should.be.eql(false);
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('messages');
                    res.body.errors.messages.should.be.eql('some fields missing');
                    res.body.errors.should.have.property('fields');
                    res.body.errors.fields.should.have.property('userId');
                    res.body.errors.fields.userId.should.be.eql('required');
                    res.body.errors.fields.should.have.property('title');
                    res.body.errors.fields.title.should.be.eql('required');
                    res.body.errors.fields.should.have.property('description');
                    res.body.errors.fields.description.should.be.eql('required');
                    res.body.errors.fields.should.have.property('startAt');
                    res.body.errors.fields.startAt.should.be.eql('required');
                    res.body.errors.fields.should.have.property('endAt');
                    res.body.errors.fields.endAt.should.be.eql('required');
                    res.body.errors.fields.should.have.property('address');
                    res.body.errors.fields.address.should.be.eql('required');
                done();
              });
        });
    
        it('it should not PUT a event with non exist id', (done) => {
          let event = {
            id: 99999999999,
            userId: "3",
            title: "test event2",
            description: "testing2",
            startAt: "2019-03-24 05:00:00",
            endAt: "2019-03-24 06:00:00",
            address: "Hong Kong2"
          }
          chai.request(app)
              .put(`/event/${event.id}`)
              .send(event)
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('result');
                  res.body.result.should.be.eql(false);
                done();
              });
        });
        
        it('it should PUT a event', (done) => {
          let event = {
            id: 3,
            userId: "4",
            title: "test update event",
            description: "testing update",
            startAt: "2019-03-24 05:00:00",
            endAt: "2019-03-24 06:00:00",
            address: "Hong Kong update"
          }
          chai.request(app)
              .put(`/event/${event.id}`)
              .send(event)
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('result');
                  res.body.result.should.be.eql(true);
                done();
              });
        });
      });

    describe('/DELETE/:id event', () => {
        it('it should not DELETE a event with non exist id', (done) => {
          let event = {
            id: 9999999
          }
          chai.request(app)
              .delete(`/event/${event.id}`)
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('result');
                  res.body.result.should.be.eql(false);
                done();
              });
        });
        it('it should DELETE a event given the id', (done) => {
          let event = {
            id: event_id
          }
          chai.request(app)
              .delete(`/event/${event.id}`)
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
