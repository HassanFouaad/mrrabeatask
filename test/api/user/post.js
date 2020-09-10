const expect = require("chai").expect;
const request = require("supertest");

const app = require("../../../index.js");
const conn = require("../../../config/index");

describe("POST /api/signup", () => {
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

  it("OK, Signing up", (done) => {
    request(app)
      .post("/api/signup")
      .send({
        firstname: "USER FIRSTNAME",
        lastname: "USER LASTNAME",
        email: "TEST@TEST.TEST",
        password: "123456",
        username: "thisisTester",
      })
      .then((res) => {
        const body = res.body;
        expect(body).to.contain.property("user");
        expect(body).to.contain.property("token");
        done();
      })
      .catch((err) => done(err));
  });
});
