const expect = require("chai").expect;
const request = require("supertest");

const app = require("../../../index.js");
const conn = require("../../../config/index");

describe("DELETE /api/users", () => {
  before((done) => {
    conn
      .connect(process.env.DATABASEURL)
      .then(() => done())
      .catch((err) => done(err));
  });
  after((done) => {
    conn
      .disconnect()
      .then(() => done())
      .catch((err) => done(err));
  });

  it("OK, Deleteing All Users", (done) => {
    request(app)
      .delete("/api/users")
      .then((res) => {
        const body = res.body;
        expect(body).to.contain.property("msg");
        done();
      })
      .catch((err) => done(err));
  });
});


describe("DELETE /api/users/:userId", () => {
    before((done) => {
      conn
        .connect(process.env.DATABASEURL)
        .then(() => done())
        .catch((err) => done(err));
    });
    after((done) => {
      conn
        .disconnect()
        .then(() => done())
        .catch((err) => done(err));
    });
  
    it("OK, Deleteing User", (done) => {
      request(app)
        .delete("/api/user/:userId")
        .then((res) => {
          const body = res.body;
          expect(body).to.contain.property("msg");
          done();
        })
        .catch((err) => done(err));
    });
  });
  