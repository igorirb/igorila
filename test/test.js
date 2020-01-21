// Import the dependencies for testing
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server.js');

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("Investments", () => {
    describe("GET /", () => {
      // Test to get all investments
      it("should get all investments record", (done) => {
        chai.request(app)
            .get('/api/investments')
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('array');
              done();
            });
      });

      // Test to get no investment records
      it("should not get a single investment record", (done) => {
        const id = 1;
        chai.request(app)
            .post(`/api/investments/${id}`)
            .end((err, res) => {
              res.should.have.status(404);
              done();
            });
       });

       // Test to get single investment record
       it("should get a single investment record", (done) => {
        const id = 5;
        chai.request(app)
            .get(`/api/investments/${id}`)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('array');
              done();
            });
        });
    });

    describe("POST /", () => {
      // Test to add new investment
      it("should add new investment record", (done) => {
        const req = {
          body: JSON.stringify({
            type: 'RENDA_FIXA',
            value: '1',
            date: '2020-01-01'
          }),
        }
        chai.request(app)
            .post(`/api/investments`)
            .send({
              'body': {
                type: 'RENDA_FIXA',
                value: 1,
                date: '2020-01-01'
              }
            })
            .end((err, res) => {
              if (err) done(err);
              res.should.have.status(200);
            });
            done();
       });
    });

    describe("DELETE /", () => {
      // Test to delete investment record
      it("should delete an investment record", (done) => {
        const id = 5;
        chai.request(app)
          .delete(`/api/investments`)
          .send({
            'body': {
              id: this.id
            }
          })
          .end((err, res) => {
            if (err) done(err);
            res.should.have.status(200);
          });
          done();
       });
    });
});
