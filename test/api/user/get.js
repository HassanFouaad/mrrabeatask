const expect = require("chai").expect;
const request = require("supertest");

const app = require("../../../index.js");
const conn = require("../../../config/index");

describe("GET /api/user/5f59b8a53c49793bb4cc4a7c", () => {
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

  it("OK, Fetching User", (done) => {
    request(app)
      .get("/api/user/5f59b8a53c49793bb4cc4a7c")
      .then((res) => {
        const body = res.body;
        expect(body).to.contain.property("firstname");
        expect(body).to.contain.property("lastname");
        expect(body).to.contain.property("email");
        expect(body).to.contain.property("username");
        /*         expect(body).to.contain.property("createdAt");
        expect(body).to.contain.property("updatedAt") */ done();
      })
      .catch((err) => done(err));
  });
});

describe("GET /api/users", () => {
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

  it("OK, Fetching Users", (done) => {
    request(app)
      .get("/api/user/5f59b8a53c49793bb4cc4a7c")
      .then((res) => {
        const body = res.body;
        console.log(body);
        done();
      })
      .catch((err) => done(err));
  });
});
