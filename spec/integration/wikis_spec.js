// npm test spec/integration/wikis_spec.js

const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis/";
const sequelize = require('../../src/db/models/index').sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

describe("routes : wikis", () => {


  //begin context for admin user
  beforeEach((done) => {

    this.user;
    this.wiki;
    
    sequelize.sync({force: true}).then((res) => {
      User.create({
        username: "UserExample",
        email: "user@example.com",
        password: "123456",
        role: "premium"
      })
      .then((user) => {
        this.user = user;
        request.get({
          url: "http://localhost:3000/auth/fake",
          form: {
            role: user.role,
            userId: user.id,
            email: user.email
          }
        });
        Wiki.create({
          title: "Test Wiki" ,
          body: "This is the wiki body.",
          userId: user.id
        })
        .then((wiki) => {
          this.wiki = wiki;
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        })
      })
      .catch((err) => {
        console.log(err);
        done();
      })
    });
  });

  describe("GET /wikis/", () => {
    it("should render the wiki index page", (done) => {
      request.get(`${base}private`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Wikis");
        done();
      });
    });
  });

  describe("GET /wikis/new", () => {
    it("should render a view with a new wiki form", (done) => {
      request.get(`${base}new`, (err, res, body) => {
        expect(err).toBeNull();
        done();
      });
    });
  });

  describe("POST /wikis/create", () => {
    it("should create a new wiki and redirect", (done) => {
      const options = {
        url: `${base}create`,
        form: {
          title: "New Wiki",
          body: "New Wiki body",
          private: true,
          userId: this.user.id
        }
      };
      request.post(options,
        (err, res, body) => {
          Wiki.findOne({where: {title: "New Wiki"}})
          .then((wiki) => {
            expect(wiki.title).toBe("New Wiki");
            expect(wiki.body).toBe("New Wiki body");
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        }
      );
    });
  });

  describe("GET /wikis/:id", () => {
    it("should render a view with the selected wiki", (done) => {
      request.get(`${base}${this.wiki.id}`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Test Wiki");
        done();
      });
    });
  });

  describe("POST /wikis/:id/destroy", () => {
    it("should delete the wiki with the associated ID", (done) => {
        Wiki.all()
        .then((wikis) => {
            const wikiCountBeforeDelete = wikis.length;
            expect(wikiCountBeforeDelete).toBe(1);
            request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
                Wiki.all()
                .then((wikis) => {
                    expect(err).toBeNull();
                    expect(wikis.length).toBe(wikiCountBeforeDelete -1);
                    done();
                })
                .catch((err) => {
                console.log(err);
                done();
                })
            });
        })
    });
  });

  describe("GET /wikis/:id/edit", () => {
    it("should render a view with an edit wiki form", (done) => {
      request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Edit Wiki");
        done();
      });
    });
  });

  describe("POST /wikis/:id/update", () => {
    it("should update the wiki with the given values", (done) => {
      request.post({
        url: `${base}${this.wiki.id}/update`,
        form: {
          title: "JavaScript Frameworks",
          body: "There are a lot of them",
          userId: this.user.id
        }
      }, (err, res, body) => {
        expect(err).toBeNull();
        Wiki.findOne({
          where: {id:1}
        })
        .then((wiki) => {
          expect(wiki.title).toBe("JavaScript Frameworks");
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });
  });
  
  //end context for admin user

});