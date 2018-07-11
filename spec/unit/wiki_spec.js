//npm test spec/unit/wiki_spec.js

const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

describe("Wiki", () => {
    beforeEach((done) => {
        sequelize.sync({force: true})
        .then(() => {
            done();
        })
        .catch((err) => {
            console.log(err);
            done();
        });
    });

    describe("#create()", () => {
        it("should create a private Wiki object with a valid title and body", (done) => {
            Wiki.create({
                title: "Test Wiki",
                body: "This is the wiki body.",
                private: true
            })
            .then((wiki) => {
                expect(wiki.title).toBe("Test Wiki");
                expect(wiki.body).toBe("This is the wiki body.");
                expect(wiki.private).toBe(true);
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });
        it("should not create a wiki with a title already taken", (done) => {
            Wiki.create({
              title: "Test Wiki",
              body: "This is the wiki body.",
              private: true
            })
            .then((wiki) => {
              Wiki.create({
                  title: "Test Wiki",
                  body: "This is the body of a duplicate wiki.",
                  private: true
              })
              .then((wiki) => {
                // the code in this block will not be evaluated since the validation error
                // will skip it. Instead, we'll catch the error in the catch block below
                // and set the expectations there
                done();
              })
              .catch((err) => {
                expect(err.message).toContain("Validation error");
                done();
              });
              done();
            })
            .catch((err) => {
              console.log(err);
              done();
            });
          });
      
        });

        describe("User - Wiki association", () => {
            it("should associate a wiki and a user together", (done) => {
                User.create({
                    username: "UserExample",
                    email: "user@example.com",
                    password: "1234567890"
                })
                .then((user) => {
                    this.user = user;

                    Wiki.create({
                        title: "Test Wiki",
                        body: "This is the body of the wiki",
                        private: true,
                        userId: this.user.id
                    })
                    .then((wiki) => {
                        expect(wiki.userId).toBe(this.user.id);
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
});